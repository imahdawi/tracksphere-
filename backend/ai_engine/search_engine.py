# ================================================================
#  🔍 SEARCH ENGINE - نموذجنا احنا
#  بيفهم السؤال ويلاقي الإجابة
# ================================================================

import re
from .knowledge_base import KNOWLEDGE

class SearchEngine:
    def __init__(self):
        # الكلمات المفتاحية وربطها بالمسارات
        self.keywords = {
            # التطبيق
            'ايه هو TrackSphere': 'app.description',
            'what is TrackSphere': 'app.description',
            'تعريف TrackSphere': 'app.description',
            'مميزات': 'app.features',
            'features': 'app.features',
            'ازاي استخدم': 'app.how_to_use',
            'how to use': 'app.how_to_use',
            
            # المطور
            'مين مهدي': 'developer.name',
            'who is mahdi': 'developer.name',
            'المطور': 'developer.name',
            'developer': 'developer.name',
            'مهارات مهدي': 'developer.skills',
            'مشاريع مهدي': 'developer.projects',
            
            # العادات
            'اضيف عادة': 'habits.add',
            'إضافة عادة': 'habits.add',
            'add habit': 'habits.add',
            'احذف عادة': 'habits.delete',
            'حذف عادة': 'habits.delete',
            'delete habit': 'habits.delete',
            'سجل عادة': 'habits.toggle',
            'تسجيل عادة': 'habits.toggle',
            'log habit': 'habits.toggle',
            'السلسلة': 'habits.streak',
            'streak': 'habits.streak',
            'تصنيفات': 'habits.categories',
            'categories': 'habits.categories',
            'صحية': 'habits.categories.healthy',
            'healthy': 'habits.categories.healthy',
            'تعليمية': 'habits.categories.educational',
            'educational': 'habits.categories.educational',
            'روحية': 'habits.categories.spiritual',
            'spiritual': 'habits.categories.spiritual',
            'رياضية': 'habits.categories.sports',
            'sports': 'habits.categories.sports',
            
            # النقاط
            'النقاط': 'points.description',
            'points': 'points.description',
            'ازاي اجيب نقاط': 'points.rules',
            'how to get points': 'points.rules',
            'نظام النقاط': 'points.rules',
            
            # الإنجازات
            'الإنجازات': 'achievements.description',
            'achievements': 'achievements.description',
            'انجازات': 'achievements.description',
            'قائمة الإنجازات': 'achievements.list',
            'achievements list': 'achievements.list',
            
            # المشاركة
            'شارك': 'share.description',
            'share': 'share.description',
            'مشاركة': 'share.description',
            'ازاي أشارك': 'share.how',
            'how to share': 'share.how',
            'صورة المشاركة': 'share.image',
            
            # النسخ الاحتياطي
            'نسخ احتياطي': 'backup.description',
            'backup': 'backup.description',
            'تصدير': 'backup.export',
            'export': 'backup.export',
            'استيراد': 'backup.import',
            'import': 'backup.import',
            
            # الإشعارات
            'إشعارات': 'notifications.description',
            'notifications': 'notifications.description',
            'اشعارات': 'notifications.description',
            
            # الإعدادات
            'اللغة': 'settings.language',
            'language': 'settings.language',
            'الوضع': 'settings.theme',
            'theme': 'settings.theme',
            
            # الرسم البياني
            'رسم بياني': 'chart.description',
            'chart': 'chart.description',
        }
    
    def search(self, query):
        """البحث عن إجابة للسؤال"""
        query_lower = query.lower().strip()
        
        # 1. البحث المباشر بالكلمات المفتاحية
        for key, path in self.keywords.items():
            if key in query_lower:
                result = self._get_by_path(KNOWLEDGE, path)
                if result:
                    return result
        
        # 2. لو السؤال عن إضافة عادة معينة
        match = re.search(r'(?:ضيف|add)\s+([^\s?]+)', query_lower)
        if match:
            habit_name = match.group(1)
            return f"✅ تم إضافة عادة '{habit_name}' (محاكاة)\n\n💡 في التطبيق: اكتب الاسم في حقل الإضافة واضغط 'أضف'"
        
        # 3. لو السؤال عن حالة المستخدم
        if 'انا' in query_lower or 'حالتي' in query_lower:
            return "📊 أنت في رحلة تحسين ذاتك! استمر في تسجيل عاداتك يومياً لتحقيق أهدافك. 💪"
        
        # 4. مش لاقي حاجة
        return None
    
    def _get_by_path(self, data, path):
        """استخراج قيمة من قاموس متداخل"""
        parts = path.split('.')
        current = data
        for part in parts:
            if isinstance(current, dict) and part in current:
                current = current[part]
            else:
                return None
        return current