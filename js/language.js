// ================================================================
//  🌐 LANGUAGE MANAGER - الترجمة الكاملة
// ================================================================

const translations = {
    ar: {
        // ====== Toast Messages ======
        toast_error_empty_name: '⚠️ من فضلك اكتب اسم العادة',
        toast_error_exists: '⚠️ هذه العادة موجودة بالفعل',
        toast_success_added: '✅ تم إضافة "{name}" بنجاح',
        toast_success_toggle: '✅ تم تسجيل "{name}" بنجاح',
        toast_warning_toggle: '⚠️ "{name}" مسجلة اليوم بالفعل!',
        toast_info_deleted: '🗑️ تم حذف "{name}"',
        toast_share_image: '📸 تم تحميل الصورة!',
        toast_share_error: '⚠️ حدث خطأ',

        // ====== Splash ====== 
        splash_title: 'تتبع عاداتك اليومية',
        splash_start: 'ابدأ',
        splash_settings: 'الإعدادات',
        splash_info: 'معلومات',
        splash_about: 'عن المطور',

        // ====== Settings ======
        settings_title: 'الإعدادات',
        settings_language: 'اللغة',
        settings_language_ar: 'العربية',
        settings_language_en: 'English',
        settings_theme: 'الوضع',
        settings_theme_dark: 'داكن',
        settings_theme_light: 'فاتح',
        settings_version: 'الإصدار',

        // ====== Info ======
        info_title: 'معلومات',
        info_desc: 'TrackSphere هو تطبيق لتتبع العادات اليومية.',
        info_features: 'المميزات',
        info_features_list: '✅ إضافة عادات يومية<br>✅ تسجيل التقدم اليومي<br>✅ متابعة السلاسل (Streak)<br>✅ رسوم بيانية تفاعلية<br>✅ مشاركة التقدم مع الأصدقاء',

        // ====== About ======
        about_title: 'عن المطور',
        about_name: 'مهدي أحمد',
        about_desc: 'مطور Front-End شغوف ببناء تجارب ويب مميزة. أتعلم وأطبّق يومياً، وأبحث عن فرص للتعاون والمشاركة في مشاريع حقيقية.',
        about_follow: 'تابعني',

        // ====== Header ======
        header_settings: 'الإعدادات',
        header_reset: 'حذف جميع البيانات',

        // ====== Stats ======
        stats_total_habits: 'إجمالي العادات',
        stats_best_streak: 'أطول سلسلة',
        stats_completion: 'نسبة الإنجاز',
        stats_points: 'النقاط',

        // ====== Add Habit ======
        add_placeholder: 'أضف عادة جديدة...',
        add_category_healthy: '💪صحية',
        add_category_educational: '📚تعليمية',
        add_category_spiritual: '🕌روحية',
        add_category_sports: '⚽رياضية',
        add_category_other: 'أخرى',
        add_button: 'أضف',

        // ====== Habits List ======
        habits_title: 'عاداتي اليومية',
        habits_empty: 'لا توجد عادات بعد! أضف عادة جديدة 👆',
        habits_day: 'يوم',

        // ====== Chart ======
        chart_title: 'تقدمك',
        chart_weekly: 'أسبوعي',
        chart_monthly: 'شهري',
        chart_week: 'الأسبوع',
        chart_month: 'الشهر',
        chart_completed: 'عادة مكتملة',

        // ====== Achievements ======
        achievements_title: 'الإنجازات',

        // ====== Share ======
        share_title: 'شارك تقدمك',
        share_desc: 'شارك إنجازاتك مع أصحابك وحفزهم!',
        share_whatsapp: 'واتساب',
        share_instagram: 'ستوري',
        share_tiktok: 'تيك توك',
        share_image: 'صورة',

        // ====== Footer ======
        footer_made: 'Made with ❤️ by Mahdi Ahmed',

        // ====== Common ======
        version: 'v1.1'
    },
    en: {
        // ====== Toast Messages ======
        toast_error_empty_name: '⚠️ Please write the habit name',
        toast_error_exists: '⚠️ This habit already exists',
        toast_success_added: '✅ "{name}" added successfully',
        toast_success_toggle: '✅ "{name}" logged successfully',
        toast_warning_toggle: '⚠️ "{name}" is already logged today!',
        toast_info_deleted: '🗑️ "{name}" deleted',
        toast_share_image: '📸 Image downloaded!',
        toast_share_error: '⚠️ An error occurred',

        // ====== Splash ======
        splash_title: 'Track your daily habits',
        splash_start: 'Start',
        splash_settings: 'Settings',
        splash_info: 'ℹInfo',
        splash_about: 'About Us',

        // ====== Settings ======
        settings_title: 'Settings',
        settings_language: 'Language',
        settings_language_ar: 'العربية',
        settings_language_en: 'English',
        settings_theme: 'Theme',
        settings_theme_dark: 'Dark',
        settings_theme_light: 'Light',
        settings_version: 'Version',

        // ====== Info ======
        info_title: 'Info',
        info_desc: 'TrackSphere is a daily habit tracking app.',
        info_features: 'Features',
        info_features_list: '✅ Add daily habits<br>✅ Track daily progress<br>✅ Monitor streaks<br>✅ Interactive charts<br>✅ Share progress with friends',

        // ====== About ======
        about_title: 'About the Developer',
        about_name: 'Mahdi Ahmed',
        about_desc: 'Front-End Developer passionate about building exceptional web experiences. I learn and apply daily, looking for opportunities to collaborate on real projects.',
        about_follow: 'Follow me',

        // ====== Header ======
        header_settings: 'Settings',
        header_reset: 'Delete all data',

        // ====== Stats ======
        stats_total_habits: 'Total Habits',
        stats_best_streak: 'Best Streak',
        stats_completion: 'Completion Rate',
        stats_points: 'Points',

        // ====== Add Habit ======
        add_placeholder: 'Add new habit...',
        add_category_healthy: '💪Healthy',
        add_category_educational: '📚Educational',
        add_category_spiritual: '🕌Spiritual',
        add_category_sports: '⚽Sports',
        add_category_other: 'Other',
        add_button: 'Add',

        // ====== Habits List ======
        habits_title: 'My Daily Habits',
        habits_empty: 'No habits yet! Add a new habit 👆',
        habits_day: 'day',

        // ====== Chart ======
        chart_title: 'Your Progress',
        chart_weekly: 'Weekly',
        chart_monthly: 'Monthly',
        chart_week: 'Week',
        chart_month: 'Month',
        chart_completed: 'habit(s) completed',

        // ====== Achievements ======
        achievements_title: 'Achievements',

        // ====== Share ======
        share_title: 'Share Your Progress',
        share_desc: 'Share your achievements with your friends and motivate them!',
        share_whatsapp: 'WhatsApp',
        share_instagram: 'Story',
        share_tiktok: 'TikTok',
        share_image: 'Image',

        // ====== Footer ======
        footer_made: 'Made with ❤️ by Mahdi Ahmed',

        // ====== Common ======
        version: 'v1.1'
    }
};

// ====== Current Language ======
let currentLang = localStorage.getItem('track_lang') || 'ar';

// ====== Get Translation ======
function t(key) {
    const keys = key.split('.');
    let result = translations[currentLang];
    for (const k of keys) {
        if (result && result[k] !== undefined) {
            result = result[k];
        } else {
            return key;
        }
    }
    return result;
}

// ====== Set Language ======
function setLanguage(lang) {
    if (lang === currentLang) return;
    currentLang = lang;
    localStorage.setItem('track_lang', lang);
    updateUILanguage();

    // لو المودال مفتوح، نحدّث محتواه
    const modal = document.getElementById('splash-modal');
    if (modal && modal.style.display === 'flex') {
        openSettingsModal();
    }
}

// ====== Update UI (كل حاجة) ======
function updateUILanguage() {
    // 1. تحديث كل العناصر اللي فيها data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });

    // 2. تحديث الـ Splash
    const splashTitle = document.querySelector('.splash-subtitle');
    if (splashTitle) splashTitle.textContent = t('splash_title');

    const startBtn = document.getElementById('splash-start');
    if (startBtn) startBtn.innerHTML = `<i class="fas fa-play"></i> ${t('splash_start')}`;

    const settingsBtn = document.getElementById('splash-settings');
    if (settingsBtn) settingsBtn.innerHTML = `<i class="fas fa-cog"></i> ${t('splash_settings')}`;

    const infoBtn = document.getElementById('splash-info');
    if (infoBtn) infoBtn.innerHTML = `<i class="fas fa-info-circle"></i> ${t('splash_info')}`;

    const aboutBtn = document.getElementById('splash-about');
    if (aboutBtn) aboutBtn.innerHTML = `<i class="fas fa-user"></i> ${t('splash_about')}`;

    // 3. تحديث الـ Header
    const settingsHeader = document.getElementById('header-settings');
    if (settingsHeader) settingsHeader.title = t('header_settings');

    const resetHeader = document.getElementById('reset-btn');
    if (resetHeader) resetHeader.title = t('header_reset');

    // 4. تحديث الإحصائيات
    const statLabels = document.querySelectorAll('.stat-label');
    if (statLabels.length >= 4) {
        statLabels[0].textContent = t('stats_total_habits');
        statLabels[1].textContent = t('stats_best_streak');
        statLabels[2].textContent = t('stats_completion');
        statLabels[3].textContent = t('stats_points');
    }

    // 5. تحديث إضافة عادة
    const addInput = document.getElementById('habit-input');
    if (addInput) addInput.placeholder = t('add_placeholder');

    const addSelect = document.getElementById('habit-category');
    if (addSelect) {
        const options = addSelect.options;
        if (options.length >= 5) {
            options[0].text = t('add_category_healthy');
            options[1].text = t('add_category_educational');
            options[2].text = t('add_category_spiritual');
            options[3].text = t('add_category_sports');
            options[4].text = t('add_category_other');
        }
    }

    const addBtn = document.getElementById('add-btn');
    if (addBtn) addBtn.innerHTML = `<i class="fas fa-plus"></i> ${t('add_button')}`;

    // 6. تحديث قائمة العادات
    const habitsTitle = document.querySelector('.habits-header h2');
    if (habitsTitle) habitsTitle.innerHTML = `<i class="fas fa-list"></i> ${t('habits_title')}`;

    // 7. تحديث الـ Chart
    const chartTitle = document.querySelector('#chart-section .chart-header h2');
    if (chartTitle) chartTitle.innerHTML = `<i class="fas fa-chart-bar"></i> ${t('chart_title')}`;

    const chartFilterBtns = document.querySelectorAll('.chart-filter-btn');
    if (chartFilterBtns.length >= 2) {
        chartFilterBtns[0].innerHTML = `<i class="fas fa-calendar-week"></i> ${t('chart_weekly')}`;
        chartFilterBtns[1].innerHTML = `<i class="fas fa-calendar-alt"></i> ${t('chart_monthly')}`;
    }

    // 8. تحديث الإنجازات
    const achievementsTitle = document.querySelector('#achievements h2');
    if (achievementsTitle) achievementsTitle.innerHTML = `<i class="fas fa-trophy"></i> ${t('achievements_title')}`;

    // 9. تحديث المشاركة
    const shareTitle = document.querySelector('.share-wrapper h3');
    if (shareTitle) shareTitle.innerHTML = `<i class="fas fa-share-alt"></i> ${t('share_title')}`;

    const shareDesc = document.querySelector('.share-wrapper p');
    if (shareDesc) shareDesc.textContent = t('share_desc');

    const shareBtns = document.querySelectorAll('.share-btn');
    if (shareBtns.length >= 4) {
        shareBtns[0].innerHTML = `<i class="fab fa-whatsapp"></i> ${t('share_whatsapp')}`;
        shareBtns[1].innerHTML = `<i class="fab fa-instagram"></i> ${t('share_instagram')}`;
        shareBtns[2].innerHTML = `<i class="fab fa-tiktok"></i> ${t('share_tiktok')}`;
        shareBtns[3].innerHTML = `<i class="fas fa-image"></i> ${t('share_image')}`;
    }

    // 10. تحديث الفوتر
    const footerText = document.querySelector('footer p');
    if (footerText) footerText.textContent = t('footer_made');

    // 11. اتجاه الصفحة
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;

    console.log('🌐 Language updated to:', currentLang);
}

// ====== Toggle Language from Settings ======
function toggleLanguage() {
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
}

// ====== Initialize ======
document.addEventListener('DOMContentLoaded', function() {
    updateUILanguage();
    console.log('🌐 Language module loaded! Current:', currentLang);
});

console.log('🌐 Language module loaded!');