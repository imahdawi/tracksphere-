# ================================================================
#  🤖 BACKEND SERVER - نموذجنا احنا
#  من غير مفاتيح، من غير APIs، من غير فلوس
# ================================================================

from flask import Flask, request, jsonify
from flask_cors import CORS
import os

# ✅ استيراد نموذجنا احنا
from ai_engine.response_generator import ResponseGenerator

app = Flask(__name__)
CORS(app)

# ====== تهيئة النموذج ======
ai_engine = ResponseGenerator()
print('🧠 نموذج TrackSphere AI جاهز!')

# ================================================================
#  📡 API ENDPOINTS
# ================================================================

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'status': 'online',
        'message': '🧠 TrackSphere AI (نموذجنا احنا) is running!',
        'ai_type': 'Custom Knowledge Base + Search Engine'
    })

@app.route('/api/ask', methods=['POST'])
def ask():
    try:
        data = request.get_json()
        query = data.get('query', '').strip()
        
        if not query:
            return jsonify({'response': '⚠️ من فضلك اكتب سؤالاً'})
        
        # ✅ استخدم نموذجنا احنا
        habits_data = data.get('habits', None)
        response = ai_engine.generate(query, habits_data)
        
        return jsonify({'response': response})
    
    except Exception as e:
        return jsonify({'response': f'⚠️ حدث خطأ: {str(e)}'})

# ================================================================
#  🚀 تشغيل السيرفر
# ================================================================

if __name__ == '__main__':
    print('=' * 50)
    print('🧠 TrackSphere AI Server (نموذجنا احنا) Starting...')
    print('📍 Server running on http://localhost:5000')
    print('=' * 50)
    app.run(debug=True, host='0.0.0.0', port=5000)