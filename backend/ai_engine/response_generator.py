# ================================================================
#  🗣️ RESPONSE GENERATOR - نموذجنا احنا
#  بيصيغ الردود بشكل طبيعي
# ================================================================

import random
import re
from .search_engine import SearchEngine

class ResponseGenerator:
    def __init__(self):
        self.search_engine = SearchEngine()
        
        # التحيات
        self.greetings_ar = ['السلام عليكم', 'صباح الخير', 'مساء الخير', 'اهلا', 'هلو', 'مرحباً', 'أهلاً']
        self.greetings_en = ['hi', 'hello', 'hey', 'good morning', 'good evening']
        
    def generate(self, query, habits_data=None):
        """توليد رد ذكي على السؤال"""
        
        query_lower = query.lower().strip()
        
        # 1. التحية
        if any(g in query_lower for g in self.greetings_ar):
            return self._get_greeting_ar()
        
        if any(g in query_lower for g in self.greetings_en):
            return self._get_greeting_en()
        
        # 2. البحث في قاعدة المعرفة
        answer = self.search_engine.search(query)
        if answer:
            return self._format_response(answer)
        
        # 3. لو السؤال عن العادات الحالية
        if habits_data and ('عاداتي' in query_lower or 'my habits' in query_lower or 'تقدمي' in query_lower):
            return self._get_habits_summary(habits_data)
        
        # 4. لو السؤال عن مساعدة
        if 'ساعد' in query_lower or 'help' in query_lower:
            return self._get_help_response()
        
        # 5. مش فاهم
        return self._get_clarification_response()
    
    def _format_response(self, answer):
        """تنسيق الرد"""
        if isinstance(answer, list):
            return "📋 " + "\n".join([f"• {item}" for item in answer])
        return str(answer)
    
    def _get_greeting_ar(self):
        return random.choice([
            "وعليكم السلام ورحمة الله وبركاته! 🌙 كيف يمكنني مساعدتك اليوم في TrackSphere؟",
            "أهلاً بك! 👋 أنا مساعد TrackSphere. اسألني عن أي حاجة في التطبيق.",
            "مرحباً! 😊 كيف أقدر أساعدك في تتبع عاداتك اليوم؟",
            "أهلاً وسهلاً! 🌟 أنا هنا عشان أساعدك تحقق أهدافك."
        ])
    
    def _get_greeting_en(self):
        return random.choice([
            "Hello! 👋 Welcome to TrackSphere! How can I help you today?",
            "Hi there! 😊 I'm your TrackSphere assistant. Ask me anything about the app!",
            "Hey! 🚀 Ready to track your habits? I'm here to help!"
        ])
    
    def _get_help_response(self):
        return """
📚 **أنا هنا لمساعدتك!** اسألني عن:

• 📝 **إضافة عادة** - ازاي أضيف عادة جديدة؟
• ✅ **تسجيل عادة** - ازاي أسجل عادة اليوم؟
• 🔥 **السلسلة** - ايه هي السلسلة؟
• ⭐ **النقاط** - ازاي أجيب نقاط؟
• 🏆 **الإنجازات** - ايه هي الإنجازات؟
• 📤 **المشاركة** - ازاي أشارك تقدمي؟
• 💾 **النسخ الاحتياطي** - ازاي أحفظ بياناتي؟

أو قولي لي أي حاجة عن TrackSphere! 🚀
"""
    
    def _get_habits_summary(self, habits_data):
        if not habits_data:
            return "📋 ماعندكش عادات مسجلة حالياً! جرب تضيف عادة جديدة بقولك 'ضيف عادة [الاسم]'."
        
        total = len(habits_data)
        active = sum(1 for h in habits_data if h.get('history', []))
        streaks = [h.get('streak', 0) for h in habits_data]
        max_streak = max(streaks) if streaks else 0
        
        return f"""
📊 **ملخص عاداتك:**

• عدد العادات: {total}
• العادات النشطة: {active}
• أطول سلسلة: {max_streak} يوم

💪 استمر في تسجيل عاداتك يومياً!
"""
    
    def _get_clarification_response(self):
        return random.choice([
            "🤔 أنا مش فاهم سؤالك بالضبط. جرب تسأل عن: إضافة عادة، تسجيل، السلسلة، النقاط، أو الإنجازات.",
            "😅 سؤال جميل! لكن أنا متخصص في TrackSphere. جرب تسأل عن حاجة في التطبيق.",
            "🧠 أنا هنا عشان أساعدك في تتبع عاداتك! اسألني عن إزاي تضيف عادة أو تسجل تقدمك.",
            "💡 جرب تسألني حاجة عن التطبيق: ازاي أضيف عادة؟ إيه هي النقاط؟ إزاي أشارك تقدمي؟"
        ])