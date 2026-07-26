// ================================================================
//  🌐 LANGUAGE MANAGER - النسخة النهائية
// ================================================================

var translations = {
    ar: {
        splash_title: 'تتبع عاداتك اليومية',
        splash_start: 'ابدأ',
        splash_settings: 'الإعدادات',
        splash_info: 'معلومات',
        splash_about: 'عن المطور',
        settings_title: 'الإعدادات',
        settings_language: 'اللغة',
        settings_language_ar: 'العربية',
        settings_language_en: 'English',
        settings_theme: 'الوضع',
        settings_theme_dark: 'داكن',
        settings_theme_light: 'فاتح',
        settings_version: 'الإصدار',
        info_title: 'معلومات',
        info_desc: 'TrackSphere هو تطبيق لتتبع العادات اليومية.',
        info_features: 'المميزات',
        info_features_list: '✅ إضافة عادات يومية<br>✅ تسجيل التقدم اليومي<br>✅ متابعة السلاسل (Streak)<br>✅ رسوم بيانية تفاعلية<br>✅ مشاركة التقدم مع الأصدقاء',
        about_title: 'عن المطور',
        about_name: 'مهدي أحمد',
        about_desc: 'مطور Front-End شغوف ببناء تجارب ويب مميزة. أتعلم وأطبّق يومياً، وأبحث عن فرص للتعاون والمشاركة في مشاريع حقيقية.',
        about_follow: 'تابعني',
        header_settings: 'الإعدادات',
        header_reset: 'حذف جميع البيانات',
        stats_total_habits: 'إجمالي العادات',
        stats_best_streak: 'أطول سلسلة',
        stats_completion: 'نسبة الإنجاز',
        stats_points: 'النقاط',
        add_placeholder: 'أضف عادة جديدة...',
        add_category_healthy: 'صحية',
        add_category_educational: 'تعليمية',
        add_category_spiritual: 'روحية',
        add_category_sports: 'رياضية',
        add_category_other: 'أخرى',
        add_button: 'أضف',
        habits_title: 'عاداتي اليومية',
        habits_empty: 'لا توجد عادات بعد! أضف عادة جديدة 👆',
        habits_day: 'يوم',
        chart_title: 'تقدمك',
        chart_weekly: 'أسبوعي',
        chart_monthly: 'شهري',
        chart_week: 'الأسبوع',
        chart_month: 'الشهر',
        chart_completed: 'عادة مكتملة',
        day_sunday: 'الأحد',
        day_monday: 'الإثنين',
        day_tuesday: 'الثلاثاء',
        day_wednesday: 'الأربعاء',
        day_thursday: 'الخميس',
        day_friday: 'الجمعة',
        day_saturday: 'السبت',
        day_today: '(اليوم)',
        month_january: 'يناير',
        month_february: 'فبراير',
        month_march: 'مارس',
        month_april: 'أبريل',
        month_may: 'مايو',
        month_june: 'يونيو',
        month_july: 'يوليو',
        month_august: 'أغسطس',
        month_september: 'سبتمبر',
        month_october: 'أكتوبر',
        month_november: 'نوفمبر',
        month_december: 'ديسمبر',
        achievements_title: 'الإنجازات',
        share_title: 'شارك تقدمك',
        share_desc: 'شارك إنجازاتك مع أصحابك وحفزهم!',
        share_whatsapp: 'واتساب',
        share_instagram: 'ستوري',
        share_tiktok: 'تيك توك',
        share_image: 'صورة',
        footer_made: 'Made with ❤️ by Mahdi Ahmed',
        toast_error_empty_name: '⚠️ من فضلك اكتب اسم العادة',
        toast_error_exists: '⚠️ هذه العادة موجودة بالفعل',
        toast_success_added: '✅ تم إضافة "{name}" بنجاح',
        toast_success_toggle: '✅ تم تسجيل "{name}" بنجاح',
        toast_warning_toggle: '⚠️ "{name}" مسجلة اليوم بالفعل!',
        toast_info_deleted: '🗑️ تم حذف "{name}"',
        toast_share_image: '📸 تم تحميل الصورة!',
        toast_share_error: '⚠️ حدث خطأ',
        toast_achievement: '🏆 تم فتح إنجاز جديد: {name}!',
        version: 'v1.0.0'
    },
    en: {
        splash_title: 'Track your daily habits',
        splash_start: 'Start',
        splash_settings: 'Settings',
        splash_info: 'Info',
        splash_about: 'About Us',
        settings_title: 'Settings',
        settings_language: 'Language',
        settings_language_ar: 'العربية',
        settings_language_en: 'English',
        settings_theme: 'Theme',
        settings_theme_dark: 'Dark',
        settings_theme_light: 'Light',
        settings_version: 'Version',
        info_title: 'Info',
        info_desc: 'TrackSphere is a daily habit tracking app.',
        info_features: 'Features',
        info_features_list: '✅ Add daily habits<br>✅ Track daily progress<br>✅ Monitor streaks<br>✅ Interactive charts<br>✅ Share progress with friends',
        about_title: 'About the Developer',
        about_name: 'Mahdi Ahmed',
        about_desc: 'Front-End Developer passionate about building exceptional web experiences. I learn and apply daily, looking for opportunities to collaborate on real projects.',
        about_follow: 'Follow me',
        header_settings: 'Settings',
        header_reset: 'Delete all data',
        stats_total_habits: 'Total Habits',
        stats_best_streak: 'Best Streak',
        stats_completion: 'Completion Rate',
        stats_points: 'Points',
        add_placeholder: 'Add new habit...',
        add_category_healthy: 'Healthy',
        add_category_educational: 'Educational',
        add_category_spiritual: 'Spiritual',
        add_category_sports: 'Sports',
        add_category_other: 'Other',
        add_button: 'Add',
        habits_title: 'My Daily Habits',
        habits_empty: 'No habits yet! Add a new habit 👆',
        habits_day: 'day',
        chart_title: 'Your Progress',
        chart_weekly: 'Weekly',
        chart_monthly: 'Monthly',
        chart_week: 'Week',
        chart_month: 'Month',
        chart_completed: 'habit(s) completed',
        day_sunday: 'Sunday',
        day_monday: 'Monday',
        day_tuesday: 'Tuesday',
        day_wednesday: 'Wednesday',
        day_thursday: 'Thursday',
        day_friday: 'Friday',
        day_saturday: 'Saturday',
        day_today: '(Today)',
        month_january: 'January',
        month_february: 'February',
        month_march: 'March',
        month_april: 'April',
        month_may: 'May',
        month_june: 'June',
        month_july: 'July',
        month_august: 'August',
        month_september: 'September',
        month_october: 'October',
        month_november: 'November',
        month_december: 'December',
        achievements_title: 'Achievements',
        share_title: 'Share Your Progress',
        share_desc: 'Share your achievements with your friends and motivate them!',
        share_whatsapp: 'WhatsApp',
        share_instagram: 'Story',
        share_tiktok: 'TikTok',
        share_image: 'Image',
        footer_made: 'Made with ❤️ by Mahdi Ahmed',
        toast_error_empty_name: '⚠️ Please write the habit name',
        toast_error_exists: '⚠️ This habit already exists',
        toast_success_added: '✅ "{name}" added successfully',
        toast_success_toggle: '✅ "{name}" logged successfully',
        toast_warning_toggle: '⚠️ "{name}" is already logged today!',
        toast_info_deleted: '🗑️ "{name}" deleted',
        toast_share_image: '📸 Image downloaded!',
        toast_share_error: '⚠️ An error occurred',
        toast_achievement: '🏆 New achievement unlocked: {name}!',
        version: 'v1.0.0'
    }
};

// ====== CATEGORY SYSTEM ======
var CATEGORY_KEYS = ['healthy', 'educational', 'spiritual', 'sports', 'other'];

var CATEGORY_MAP = {
    'healthy': { ar: 'صحية', en: 'Healthy' },
    'educational': { ar: 'تعليمية', en: 'Educational' },
    'spiritual': { ar: 'روحية', en: 'Spiritual' },
    'sports': { ar: 'رياضية', en: 'Sports' },
    'other': { ar: 'أخرى', en: 'Other' }
};

var CATEGORY_ICONS = {
    'healthy': '💪',
    'educational': '📚',
    'spiritual': '🕌',
    'sports': '⚽',
    'other': '✨'
};

var CATEGORY_COLORS = {
    'healthy': '#00C853',
    'educational': '#2979FF',
    'spiritual': '#FF6D00',
    'sports': '#FF1744',
    'other': '#6C63FF'
};

// ====== LANGUAGE STATE ======
var currentLang = localStorage.getItem('track_lang') || 'ar';

// ====== TRANSLATION FUNCTION ======
function t(key) {
    var keys = key.split('.');
    var result = translations[currentLang];
    for (var i = 0; i < keys.length; i++) {
        if (result && result[keys[i]] !== undefined) {
            result = result[keys[i]];
        } else {
            return key;
        }
    }
    return result;
}

// ====== CATEGORY HELPERS ======
function getCategoryTranslation(key) {
    if (CATEGORY_MAP[key] && CATEGORY_MAP[key][currentLang]) {
        return CATEGORY_MAP[key][currentLang];
    }
    return key;
}

function getCategoryIcon(key) {
    return CATEGORY_ICONS[key] || '✨';
}

function getCategoryColor(key) {
    return CATEGORY_COLORS[key] || '#6C63FF';
}

function isValidCategory(key) {
    return CATEGORY_KEYS.indexOf(key) !== -1;
}

// ====== MIGRATE OLD DATA ======
function migrateCategoryKeys(habitsData) {
    var oldToNew = {
        'صحية': 'healthy',
        'تعليمية': 'educational',
        'روحية': 'spiritual',
        'رياضية': 'sports',
        'أخرى': 'other',
        'Healthy': 'healthy',
        'Educational': 'educational',
        'Spiritual': 'spiritual',
        'Sports': 'sports',
        'Other': 'other'
    };

    for (var i = 0; i < habitsData.length; i++) {
        if (oldToNew[habitsData[i].category]) {
            habitsData[i].category = oldToNew[habitsData[i].category];
        }
        if (!isValidCategory(habitsData[i].category)) {
            habitsData[i].category = 'other';
        }
    }
    return habitsData;
}

// ====== SET LANGUAGE - ⭐ الإصلاح النهائي ======
function setLanguage(lang) {
    if (lang === currentLang) return;

    console.log('🌐 Changing language from', currentLang, 'to', lang);

    currentLang = lang;
    localStorage.setItem('track_lang', lang);

    // 1. تحديث الواجهة
    updateUILanguage();

    // 2. تحديث القوائم
    if (typeof renderHabits === 'function') {
        renderHabits();
    }
    if (typeof updateStats === 'function') {
        updateStats();
    }
    if (typeof updateAchievements === 'function') {
        updateAchievements();
    }
    if (typeof updateDate === 'function') {
        updateDate();
    }

    // 3. ⭐ إعادة تهيئة الرسم البياني - الطريقة الصحيحة
    if (typeof resetChartState === 'function') {
        resetChartState();
    }

    // 4. ⭐ إعادة بناء الرسم من الصفر بعد تأخير
    setTimeout(function() {
        if (typeof initChart === 'function') {
            console.log('🌐 Re-initializing chart after language change');
            // التأكد من أن chartInstance = null قبل إعادة التهيئة
            if (typeof resetChartState === 'function') {
                resetChartState();
            }
            initChart();
        }
    }, 400);

    // تحديث المودال
    var modal = document.getElementById('splash-modal');
    if (modal && modal.style.display === 'flex') {
        if (typeof openSettingsModal === 'function') {
            openSettingsModal();
        }
    }
}

// ====== UPDATE UI ======
function updateUILanguage() {
    console.log('🌐 Updating UI to:', currentLang);

    // 1. data-i18n elements
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
        var key = els[i].getAttribute('data-i18n');
        els[i].textContent = t(key);
    }

    // 2. Placeholders
    var phs = document.querySelectorAll('[data-i18n-placeholder]');
    for (var i = 0; i < phs.length; i++) {
        var key = phs[i].getAttribute('data-i18n-placeholder');
        phs[i].placeholder = t(key);
    }

    // 3. Splash buttons
    var splashStart = document.getElementById('splash-start');
    if (splashStart) splashStart.innerHTML = '<i class="fas fa-play"></i> ' + t('splash_start');

    var splashSettings = document.getElementById('splash-settings');
    if (splashSettings) splashSettings.innerHTML = '<i class="fas fa-cog"></i> ' + t('splash_settings');

    var splashInfo = document.getElementById('splash-info');
    if (splashInfo) splashInfo.innerHTML = '<i class="fas fa-info-circle"></i> ' + t('splash_info');

    var splashAbout = document.getElementById('splash-about');
    if (splashAbout) splashAbout.innerHTML = '<i class="fas fa-user"></i> ' + t('splash_about');

    var splashSubtitle = document.querySelector('.splash-subtitle');
    if (splashSubtitle) splashSubtitle.textContent = t('splash_title');

    // 4. Header
    var settingsHeader = document.getElementById('header-settings');
    if (settingsHeader) settingsHeader.title = t('header_settings');

    var resetHeader = document.getElementById('reset-btn');
    if (resetHeader) resetHeader.title = t('header_reset');

    // 5. Stats
    var statLabels = document.querySelectorAll('.stat-label');
    if (statLabels.length >= 4) {
        statLabels[0].textContent = t('stats_total_habits');
        statLabels[1].textContent = t('stats_best_streak');
        statLabels[2].textContent = t('stats_completion');
        statLabels[3].textContent = t('stats_points');
    }

    // 6. Add Habit - Select Options ⭐
    var select = document.getElementById('habit-category');
    if (select && select.options.length >= 5) {
        var values = ['healthy', 'educational', 'spiritual', 'sports', 'other'];
        var keys = ['add_category_healthy', 'add_category_educational', 'add_category_spiritual', 'add_category_sports', 'add_category_other'];
        var icons = ['💪', '📚', '🕌', '⚽', '✨'];

        for (var i = 0; i < select.options.length && i < values.length; i++) {
            select.options[i].value = values[i];
            select.options[i].text = icons[i] + ' ' + t(keys[i]);
        }
    }

    var addBtn = document.getElementById('add-btn');
    if (addBtn) addBtn.innerHTML = '<i class="fas fa-plus"></i> ' + t('add_button');

    // 7. Habits Title
    var habitsTitle = document.querySelector('.habits-header h2');
    if (habitsTitle) habitsTitle.innerHTML = '<i class="fas fa-list"></i> ' + t('habits_title');

    // 8. Chart
    var chartTitle = document.querySelector('#chart-section .chart-header h2');
    if (chartTitle) chartTitle.innerHTML = '<i class="fas fa-chart-bar"></i> ' + t('chart_title');

    var filterBtns = document.querySelectorAll('.chart-filter-btn');
    if (filterBtns.length >= 2) {
        filterBtns[0].innerHTML = '<i class="fas fa-calendar-week"></i> ' + t('chart_weekly');
        filterBtns[1].innerHTML = '<i class="fas fa-calendar-alt"></i> ' + t('chart_monthly');
    }

    // 9. Achievements
    var achTitle = document.querySelector('#achievements h2');
    if (achTitle) achTitle.innerHTML = '<i class="fas fa-trophy"></i> ' + t('achievements_title');

    // 10. Share
    var shareTitle = document.querySelector('.share-wrapper h3');
    if (shareTitle) shareTitle.innerHTML = '<i class="fas fa-share-alt"></i> ' + t('share_title');

    var shareDesc = document.querySelector('.share-wrapper p');
    if (shareDesc) shareDesc.textContent = t('share_desc');

    var shareBtns = document.querySelectorAll('.share-btn');
    if (shareBtns.length >= 4) {
        shareBtns[0].innerHTML = '<i class="fab fa-whatsapp"></i> ' + t('share_whatsapp');
        shareBtns[1].innerHTML = '<i class="fab fa-instagram"></i> ' + t('share_instagram');
        shareBtns[2].innerHTML = '<i class="fab fa-tiktok"></i> ' + t('share_tiktok');
        shareBtns[3].innerHTML = '<i class="fas fa-image"></i> ' + t('share_image');
    }

    // 11. Footer
    var footerText = document.querySelector('footer p');
    if (footerText) footerText.textContent = t('footer_made');

    // 12. Direction
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;

    // 13. Update date
    if (typeof updateDate === 'function') {
        updateDate();
    }

    console.log('🌐 UI updated successfully');
}

// ====== UPDATE DATE ======
function updateDate() {
    var el = document.getElementById('today-date');
    if (!el) return;

    var now = new Date();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    if (currentLang === 'ar') {
        el.textContent = now.toLocaleDateString('ar-EG', options);
    } else {
        el.textContent = now.toLocaleDateString('en-US', options);
    }
}

// ====== EXPOSE GLOBALS ======
window.t = t;
window.currentLang = currentLang;
window.setLanguage = setLanguage;
window.updateUILanguage = updateUILanguage;
window.updateDate = updateDate;
window.getCategoryTranslation = getCategoryTranslation;
window.getCategoryIcon = getCategoryIcon;
window.getCategoryColor = getCategoryColor;
window.isValidCategory = isValidCategory;
window.migrateCategoryKeys = migrateCategoryKeys;
window.CATEGORY_KEYS = CATEGORY_KEYS;
window.CATEGORY_MAP = CATEGORY_MAP;
window.CATEGORY_ICONS = CATEGORY_ICONS;
window.CATEGORY_COLORS = CATEGORY_COLORS;

console.log('🌐 Language module loaded! Current:', currentLang);