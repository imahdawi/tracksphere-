# ================================================================
#  🤖 BACKEND SERVER - TrackSphere AI
#  Python + Flask + Gemini API
# ================================================================

from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
import re

# ====== تحميل المفتاح من ملف .env ======
load_dotenv()
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

# ====== إعداد Flask ======
app = Flask(__name__)
CORS(app)  # ✅ يسمح لـ JavaScript بالتواصل مع السيرفر

# ====== إعداد Gemini ======
AI_AVAILABLE = False
if GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-2.0-flash')
        AI_AVAILABLE = True
        print('🤖 Gemini API is ready!')
    except Exception as e:
        print(f'⚠️ Gemini initialization error: {e}')
        AI_AVAILABLE = False
else:
    print('⚠️ Gemini API key not found!')

# ====== معرفة التطبيق ======
APP_CONTEXT = """
أنت مساعد ذكي لتطبيق TrackSphere، تطبيق لتتبع العادات اليومية.

معلومات عن التطبيق:
- الاسم: TrackSphere
- المطور: مهدي أحمد (Mahdi Ahmed)
- الوظيفة: تتبع العادات اليومية، تسجيل التقدم، متابعة السلسلة (Streak)
- المميزات: إضافة عادات، تسجيل يومي، سلسلة، نقاط، إنجازات، مشاركة، إشعارات، نسخ احتياطي
- الألوان: أرجواني (#6C63FF) أساسي، مع وضع ليلي ونهاري

تعليمات للرد:
- لو السؤال عن التطبيق، جاوب بمعلومات دقيقة عن TrackSphere.
- لو السؤال عام، جاوب برد مفيد وذكي.
- خلي ردودك مختصرة ومفيدة (حد أقصى 3-4 جمل).
- لو السؤال بالعربي، رد بالعربي. لو بالإنجليزي، رد بالإنجليزي.
- متتكلمش عن نفسك كـ AI، بس عن TrackSphere.
"""

# ================================================================
#  📡 API ENDPOINTS
# ================================================================

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'status': 'online',
        'message': '🤖 TrackSphere AI Assistant is running!',
        'ai_available': AI_AVAILABLE
    })

@app.route('/api/ask', methods=['POST'])
def ask():
    """
    استقبال سؤال من المستخدم والرد عليه باستخدام Gemini
    """
    try:
        # قراءة البيانات
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        query = data.get('query', '').strip()
        
        if not query:
            return jsonify({'response': '⚠️ من فضلك اكتب سؤالاً'})
        
        # ✅ لو الـ AI مش متاح، نرجع رد Offline
        if not AI_AVAILABLE:
            return jsonify({'response': get_offline_response(query)})
        
        # ✅ بناء prompt كامل
        prompt = f"{APP_CONTEXT}\n\nسؤال المستخدم: {query}\n\nالرد:"
        
        # ✅ طلب من Gemini
        response = model.generate_content(prompt)
        
        # ✅ استخراج الرد
        if response and response.text:
            return jsonify({'response': response.text.strip()})
        else:
            return jsonify({'response': '⚠️ آسف، حصل خطأ في توليد الرد.'})
    
    except Exception as e:
        print(f'❌ Error: {e}')
        return jsonify({'response': f'⚠️ حدث خطأ: {str(e)}'})

@app.route('/api/analyze', methods=['POST'])
def analyze_habits():
    """
    تحليل عادات المستخدم وإعطاء نصائح مخصصة
    """
    try:
        data = request.get_json()
        habits_data = data.get('habits', [])
        
        if not habits_data:
            return jsonify({'analysis': 'لا توجد عادات لتحليلها'})
        
        total = len(habits_data)
        active = sum(1 for h in habits_data if h.get('history', []))
        streaks = [h.get('streak', 0) for h in habits_data]
        max_streak = max(streaks) if streaks else 0
        
        analysis = f"""
📊 **تحليل عاداتك:**

- عدد العادات الكلي: {total}
- العادات النشطة: {active}
- نسبة النشاط: {round((active/total)*100 if total > 0 else 0)}%
- أطول سلسلة: {max_streak} يوم

💡 نصيحة: استمر في تسجيل عاداتك يومياً لتحقيق أهدافك!
"""
        
        return jsonify({'analysis': analysis.strip()})
    
    except Exception as e:
        return jsonify({'analysis': f'⚠️ حدث خطأ: {str(e)}'})

# ================================================================
#  📚 OFFLINE RESPONSES (لو Gemini مش متاح)
# ================================================================

def get_offline_response(query):
    query_lower = query.lower().strip()
    
    # ردود مخصصة للأسئلة الشائعة
    responses = {
        'اضيف عادة': 'اكتب اسم العادة في حقل الإضافة، اختار التصنيف، واضغط "أضف". هتظهر في قائمة عاداتك فوراً.',
        'سجل عادة': 'اضغط على زر ✔️ بجانب العادة في القائمة. هتتسجل اليوم وتاخد نقاط!',
        'السلسلة': 'السلسلة (Streak) هي عدد الأيام المتتالية اللي حافظت فيها على عادة. كل ما زادت، زادت نقاطك!',
        'النقاط': 'النقاط مكافآت بتحصل عليها عند تسجيل العادات. كل تسجيل = 10 نقاط، والسلسلة الطويلة = مكافآت إضافية.',
        'الإنجازات': 'جوائز بتحصل عليها عند تحقيق أهداف معينة: أول عادة، 7 أيام، 30 يوم، 5 عادات، يوم مثالي، 500 نقطة.',
        'شارك': 'اضغط على زر "شارك" في القسم المخصص، واختار الطريقة: واتساب، ستوري، تيك توك، أو تحميل صورة.',
        'نسخ احتياطي': 'اضغط على "تصدير البيانات" في قسم المشاركة، هينزل ملف JSON بكل بياناتك.',
        'مين مهدي': 'مهدي أحمد هو مطور Front-End ومصمم TrackSphere. شغوف ببناء تجارب ويب مميزة.',
        'ايه هو TrackSphere': 'TrackSphere تطبيق لتتبع العادات اليومية. يساعدك على بناء عادات إيجابية وتتبع تقدمك.',
        'السلام عليكم': 'وعليكم السلام ورحمة الله وبركاته! 🌙 كيف يمكنني مساعدتك في التطبيق اليوم؟',
        'صباح الخير': 'صباح النور! ☀️ يوم جديد مليء بالفرص. ابدأ عاداتك الآن!',
        'مساء الخير': 'مساء الخير! 🌙 وقت رائع لمراجعة إنجازاتك اليومية.',
        'شكرا': 'العفو! 😊 أنا هنا لمساعدتك في أي وقت. استمر في تحقيق أهدافك!',
        'هلو': 'مرحباً! 👋 أنا مساعد TrackSphere. اسألني عن أي حاجة في التطبيق.',
        'hi': 'Hello! 👋 I\'m TrackSphere assistant. Ask me anything about the app!',
        'hello': 'Hello! 👋 How can I help you with TrackSphere today?',
        'how to add habit': 'Write the habit name in the input field, choose the category, and click "Add". It will appear in your habits list!',
        'what is streak': 'Streak is the number of consecutive days you\'ve maintained a habit. The longer the streak, the more points you earn!',
    }
    
    for key, value in responses.items():
        if key in query_lower:
            return value
    
    # لو السؤال مش في القائمة
    return '🤔 سؤال جميل! أنا في وضع عدم الاتصال. جرب تسأل عن: إضافة عادة، تسجيل، السلسلة، النقاط، الإنجازات، أو المشاركة.'

# ================================================================
#  🚀 تشغيل السيرفر
# ================================================================

if __name__ == '__main__':
    print('=' * 50)
    print('🚀 TrackSphere AI Server Starting...')
    print(f'🔑 AI Available: {AI_AVAILABLE}')
    print(f'📍 Server running on http://localhost:5000')
    print('=' * 50)
    app.run(debug=True, host='0.0.0.0', port=5000)