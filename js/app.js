// ====== APP STATE ======
let habits = [];
let points = 0;
let achievements = [];

// ====== DOM REFS ======
const habitsList = document.getElementById('habits-list');
const habitInput = document.getElementById('habit-input');
const habitCategory = document.getElementById('habit-category');
const addBtn = document.getElementById('add-btn');
const totalHabitsEl = document.getElementById('total-habits');
const totalStreakEl = document.getElementById('total-streak');
const completionRateEl = document.getElementById('completion-rate');
const totalPointsEl = document.getElementById('total-points');
const todayDateEl = document.getElementById('today-date');

// ================================================================
//  🛠️ حساب النقاط من العادات الموجودة فقط
// ================================================================
function calculatePointsFromHabits() {
    let total = 0;
    habits.forEach(habit => {
        total += habit.history.length * 10;
        if (habit.history.length >= 1) total += 5;
        if (habit.history.length >= 7) total += 15;
        if (habit.history.length >= 30) total += 30;
        if (habit.streak >= 7) total += 20;
        if (habit.streak >= 30) total += 50;
        if (habit.streak >= 100) total += 100;
    });
    return total;
}

// ====== INIT ======
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderHabits();
    updateStats();
    updateAchievements();
    updateDate();
    setTimeout(() => {
        if (typeof resetChartState === 'function') resetChartState();
        initChart();
    }, 200);

    // ====== التحكم في شاشة البداية (تظهر كل مرة) ======
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
        splashScreen.classList.remove('hidden');
    }
});

// ====== ADD HABIT ======
addBtn.addEventListener('click', () => {
    const name = habitInput.value.trim();
    const category = habitCategory.value;
    if (!name) return showToast('toast_error_empty_name', 'error');
    if (habits.some(h => h.name.toLowerCase() === name.toLowerCase())) return showToast('toast_error_exists', 'warning');
    habits.push({
        id: Date.now(),
        name: name,
        category: category,
        icon: getCategoryIcon(category),
        completed: false,
        streak: 0,
        bestStreak: 0,
        history: [],
        createdAt: new Date().toISOString()
    });
    habitInput.value = '';
    saveData();
    renderHabits();
    updateStats();
    updateAchievements();
    updateChart();
    showToast('toast_success_added', 'success', name);
});

// ====== TOGGLE HABIT ======
function toggleHabit(id) {
    const habit = habits.find(h => h.id === id);
    if (!habit) return showToast('⚠️ العادة غير موجودة', 'error');
    const today = new Date().toDateString();
    if (habit.history.includes(today)) return showToast('toast_warning_toggle', 'warning', habit.name);
    habit.history.push(today);
    habit.completed = true;
    calculateStreak(habit);
    saveData();
    renderHabits();
    updateStats();
    updateAchievements();
    updateChart();
    showToast('toast_success_toggle', 'success', habit.name);
}

// ====== CALCULATE STREAK ======
function calculateStreak(habit) {
    if (habit.history.length === 0) { habit.streak = 0; return; }
    let streak = 0;
    let currentDate = new Date();
    for (let i = 0; i < habit.history.length; i++) {
        const dateStr = new Date(currentDate).toDateString();
        if (habit.history.includes(dateStr)) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else break;
    }
    habit.streak = streak;
    if (streak > habit.bestStreak) habit.bestStreak = streak;
}

// ====== DELETE HABIT ======
function deleteHabit(id) {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;
    if (!confirm(`🗑️ هل أنت متأكد من حذف عادة "${habit.name}"؟`)) return;
    habits = habits.filter(h => h.id !== id);
    saveData();
    renderHabits();
    updateStats();
    updateAchievements();
    updateChart();
    showToast('toast_info_deleted', 'info', habit.name);
}

// ====== RENDER HABITS ======
function renderHabits() {
    if (habits.length === 0) {
        habitsList.innerHTML = `<div class="empty-state"><i class="fas fa-plus-circle"></i><p data-i18n="habits_empty">لا توجد عادات بعد! أضف عادة جديدة 👆</p></div>`;
        return;
    }
    habitsList.innerHTML = habits.map(habit => {
        const today = new Date().toDateString();
        const isDoneToday = habit.history.includes(today);
        return `
        <div class="habit-item ${isDoneToday ? 'completed' : ''}">
            <div class="habit-info">
                <span class="habit-icon">${habit.icon}</span>
                <div>
                    <span class="habit-name">${habit.name}</span>
                    <span class="habit-category">${habit.category}</span>
                </div>
            </div>
            <div class="habit-streak"><i class="fas fa-fire"></i> ${habit.streak || 0} ${t('habits_day')}</div>
            <div class="habit-actions">
                <button class="btn-check" onclick="toggleHabit(${habit.id})" ${isDoneToday ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : ''}><i class="fas fa-check"></i></button>
                <button class="btn-delete" onclick="deleteHabit(${habit.id})"><i class="fas fa-trash"></i></button>
            </div>
        </div>`;
    }).join('');
}

// ====== UPDATE STATS ======
function updateStats() {
    const total = habits.length;
    const today = new Date().toDateString();
    const completedToday = habits.filter(h => h.history.includes(today)).length;
    const rate = total === 0 ? 0 : Math.round((completedToday / total) * 100);
    const maxStreak = habits.reduce((max, h) => Math.max(max, h.streak || 0), 0);
    points = calculatePointsFromHabits();
    totalHabitsEl.textContent = total;
    totalStreakEl.textContent = maxStreak;
    completionRateEl.textContent = rate + '%';
    totalPointsEl.textContent = points;
    saveData();
}

// ====== UPDATE DATE ======
function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    todayDateEl.textContent = now.toLocaleDateString('ar-EG', options);
}

// ====== CATEGORY ICON ======
function getCategoryIcon(category) {
    const icons = { 'صحية': '💪', 'تعليمية': '📚', 'روحية': '🕌', 'رياضية': '⚽', 'أخرى': '✨' };
    return icons[category] || '✨';
}

// ====== RESET ======
document.getElementById('reset-btn').addEventListener('click', () => {
    if (confirm('⚠️ هل أنت متأكد من حذف جميع البيانات؟')) {
        if (confirm('⚠️ هل أنت متأكد مرة أخرى؟')) {
            localStorage.removeItem('tracksphere_data');
            habits = [];
            points = 0;
            achievements = [];
            renderHabits();
            updateStats();
            updateAchievements();
            updateChart();
            showToast('🗑️ تم حذف جميع البيانات بنجاح', 'success');
        }
    }
});

// ================================================================
//  🌐 THEME (من الإعدادات بس)
// ================================================================

// ====== استرجاع الثيم ======
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light');
}

// ================================================================
//  📤 SHARE PROGRESS
// ================================================================

function generateShareText() {
    const total = habits.length;
    const today = new Date().toDateString();
    const completedToday = habits.filter(h => h.history.includes(today)).length;
    const rate = total === 0 ? 0 : Math.round((completedToday / total) * 100);
    const maxStreak = habits.reduce((max, h) => Math.max(max, h.streak || 0), 0);
    const todayStr = new Date().toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', year: 'numeric' });
    const bestHabit = habits.length > 0 ? [...habits].sort((a, b) => (b.streak || 0) - (a.streak || 0))[0] : null;
    let text = `🚀 يوم ${todayStr}\n🔥 ${maxStreak} يوم متتالي\n📈 ${rate}% إنجاز\n⭐ ${points} نقطة\n`;
    if (bestHabit && bestHabit.streak > 0) text += `🏆 ${bestHabit.icon} ${bestHabit.name}: ${bestHabit.streak} يوم\n`;
    text += `\n💪 أنا بحسن من نفسي يوم عن يوم!\n#Mahdawi_Challenge`;
    return text;
}

function generateShareHTML() {
    const total = habits.length;
    const today = new Date().toDateString();
    const completedToday = habits.filter(h => h.history.includes(today)).length;
    const rate = total === 0 ? 0 : Math.round((completedToday / total) * 100);
    const maxStreak = habits.reduce((max, h) => Math.max(max, h.streak || 0), 0);
    const todayStr = new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const bestHabit = habits.length > 0 ? [...habits].sort((a, b) => (b.streak || 0) - (a.streak || 0))[0] : null;

    let html = `
        <div style="text-align:center;padding:24px 20px;background:linear-gradient(135deg, #0A0A1A 0%, #1A1A3E 100%);border-radius:20px;border:2px solid #6C63FF;width:500px;margin:0 auto;font-family:'Cairo',sans-serif;box-sizing:border-box;">
            <div style="display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:6px;">
                <span style="font-size:2.4rem;">🚀</span>
                <span style="font-size:2rem;font-weight:800;color:#6C63FF;">TrackSphere</span>
            </div>
            <div style="color:#A0A0C0;font-size:1rem;margin-bottom:10px;">${todayStr}</div>
            <hr style="border-color:rgba(108,99,255,0.15);margin:8px 0;" />
            <div style="display:flex;justify-content:center;gap:20px;flex-wrap:wrap;margin:10px 0;">
                <span style="background:rgba(108,99,255,0.12);padding:6px 18px;border-radius:50px;font-weight:600;font-size:1.1rem;">🔥 ${maxStreak} يوم</span>
                <span style="background:rgba(0,200,83,0.12);padding:6px 18px;border-radius:50px;font-weight:600;font-size:1.1rem;color:#00C853;">📈 ${rate}%</span>
                <span style="background:rgba(255,214,0,0.12);padding:6px 18px;border-radius:50px;font-weight:600;font-size:1.1rem;color:#FFD600;">⭐ ${points}</span>
            </div>
            ${bestHabit && bestHabit.streak > 0 ? `
            <hr style="border-color:rgba(108,99,255,0.15);margin:8px 0;" />
            <div style="font-size:1rem;color:#A0A0C0;">
                🏆 أكثر عادة: <strong style="color:#fff;">${bestHabit.icon} ${bestHabit.name}</strong>
                <span style="color:#FFD600;font-size:0.9rem;">(${bestHabit.streak} يوم)</span>
            </div>` : ''}
            <hr style="border-color:rgba(108,99,255,0.15);margin:10px 0;" />
            <div style="font-size:1.2rem;color:#fff;font-weight:500;margin:6px 0;">💪 أنا بحسن من نفسي يوم عن يوم!</div>
            <div style="font-size:0.8rem;color:#6C63FF;margin-top:8px;">#Mahdawi_Challenge</div>
        </div>
    `;
    return html;
}

function shareProgress(platform) {
    switch (platform) {
        case 'whatsapp':
            const text = generateShareText();
            const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
            window.open(url, '_blank');
            break;
        case 'instagram':
            generateShareImage();
            showToast('📸 تم تحميل الصورة! شاركها في ستوري إنستجرام', 'success');
            break;
        case 'tiktok':
            generateShareImage();
            showToast('📸 تم تحميل الصورة! ارفعها كفيديو على تيك توك', 'success');
            break;
        case 'image':
            generateShareImage();
            break;
        default:
            showToast('⚠️ منصة غير مدعومة', 'error');
    }
}

function generateShareImage() {
    if (typeof html2canvas === 'undefined') {
        showToast('⏳ جاري تحميل المكتبة...', 'info');
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
        script.onload = function() {
            showToast('✅ تم التحميل، جاري إنشاء الصورة...', 'success');
            generateShareImage();
        };
        script.onerror = function() {
            showToast('⚠️ فشل تحميل المكتبة، تأكد من الاتصال بالإنترنت', 'error');
        };
        document.head.appendChild(script);
        return;
    }

    const preview = document.getElementById('share-preview');
    if (!preview) {
        showToast('⚠️ عنصر المعاينة غير موجود', 'error');
        return;
    }

    preview.style.display = 'flex';
    preview.style.justifyContent = 'center';
    preview.style.alignItems = 'center';
    preview.style.background = 'transparent';
    preview.style.padding = '0';
    preview.style.margin = '0 auto';
    preview.style.width = '500px';
    preview.style.maxWidth = '100%';

    preview.innerHTML = generateShareHTML();

    html2canvas(preview, {
        backgroundColor: null,
        scale: 2.5,
        useCORS: true,
        logging: false,
        width: 500,
        onclone: function(doc) {
            const videos = doc.querySelectorAll('video');
            videos.forEach(v => v.pause());
        }
    })
    .then(canvas => {
        const link = document.createElement('a');
        link.download = `tracksphere_${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        showToast('toast_share_image', 'success');
    })
    .catch(err => {
        console.error('Error generating image:', err);
        showToast('toast_share_error', 'error');
    });
}

// ================================================================
//  🚀 SPLASH SCREEN
// ================================================================

const splashScreen = document.getElementById('splash-screen');
const splashStart = document.getElementById('splash-start');
const splashSettings = document.getElementById('splash-settings');
const splashInfo = document.getElementById('splash-info');
const splashAbout = document.getElementById('splash-about');
const splashModal = document.getElementById('splash-modal');
const splashModalBody = document.getElementById('splash-modal-body');

// ====== إخفاء شاشة البداية ======
function hideSplash() {
    if (splashScreen) {
        splashScreen.classList.add('hidden');
    }
}

// ====== فتح المودال ======
function openSplashModal(content) {
    if (splashModalBody) {
        splashModalBody.innerHTML = content;
    }
    if (splashModal) {
        splashModal.style.display = 'flex';
    }
}

// ====== غلق المودال ======
function closeSplashModal() {
    if (splashModal) {
        splashModal.style.display = 'none';
    }
}

// ====== زر Start ======
if (splashStart) {
    splashStart.addEventListener('click', hideSplash);
}

// ====== زر Settings ======
if (splashSettings) {
    splashSettings.addEventListener('click', openSettingsModal);
}

function openSettingsModal() {
    const isLight = document.body.classList.contains('light');
    const themeText = isLight ? t('settings_theme_light') : t('settings_theme_dark');
    const themeIcon = isLight ? '☀️' : '🌙';

    openSplashModal(`
        <h2 style="text-align:center;font-size:1.6rem;margin-bottom:20px;color:var(--primary);">
            ⚙️ ${t('settings_title')}
        </h2>
        
        <div class="settings-group">
            <div class="settings-label">
                <i class="fas fa-globe"></i>
                <span>${t('settings_language')}</span>
            </div>
            <div class="settings-options">
                <button onclick="setLanguage('ar')" class="settings-option-btn ${currentLang === 'ar' ? 'active' : ''}">
                    ${t('settings_language_ar')}
                </button>
                <button onclick="setLanguage('en')" class="settings-option-btn ${currentLang === 'en' ? 'active' : ''}">
                    ${t('settings_language_en')}
                </button>
            </div>
        </div>

        <div class="settings-group">
            <div class="settings-label">
                <i class="fas fa-moon"></i>
                <span>${t('settings_theme')}</span>
            </div>
            <div class="settings-options">
                <button onclick="toggleThemeFromSettings()" class="settings-option-btn" style="flex:1;justify-content:center;gap:8px;">
                    <span>${themeIcon}</span>
                    <span>${themeText}</span>
                    <span style="font-size:0.8rem;color:var(--text-secondary);">(تبديل)</span>
                </button>
            </div>
        </div>

        <div class="settings-group" style="border-bottom:none;margin-bottom:0;padding-bottom:0;">
            <div class="settings-label" style="justify-content:center;gap:6px;">
                <i class="fas fa-tag"></i>
                <span style="font-size:0.9rem;color:var(--text-secondary);">${t('settings_version')} ${t('version')}</span>
            </div>
        </div>
    `);
}

// ====== تبديل الثيم من الإعدادات ======
function toggleThemeFromSettings() {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    openSettingsModal();
}

// ====== زر Info ======
if (splashInfo) {
    splashInfo.addEventListener('click', function() {
        openSplashModal(`
            <h2>${t('info_title')}</h2>
            <p>${t('info_desc')}</p>
            <div class="modal-section">
                <h4>${t('info_features')}</h4>
                <p>${t('info_features_list')}</p>
            </div>
            <div class="modal-section">
                <h4>${t('settings_version')}</h4>
                <p>${t('version')}</p>
            </div>
        `);
    });
}

// ====== زر About Us ======
if (splashAbout) {
    splashAbout.addEventListener('click', function() {
        openSplashModal(`
            <h2>${t('about_title')}</h2>
            <p><strong>${t('about_name')}</strong></p>
            <div class="modal-section">
                <h4>🚀 عني</h4>
                <p>${t('about_desc')}</p>
            </div>
            <div class="modal-section">
                <h4>${t('about_follow')}</h4>
                <p>
                    🐙 <a href="https://github.com/imahdawi" target="_blank" style="color:var(--primary);">GitHub</a><br>
                    🎵 <a href="https://tiktok.com/@imahdawi" target="_blank" style="color:var(--primary);">TikTok</a><br>
                    📧 <a href="mailto:mahdi.business.new@gmail.com" style="color:var(--primary);">mahdi.business.new@gmail.com</a>
                </p>
            </div>
            <div class="modal-section">
                <h4>📦 الإصدار</h4>
                <p>${t('version')}</p>
            </div>
        `);
    });
}

// ====== غلق المودال عند الضغط على الخلفية ======
if (splashModal) {
    splashModal.addEventListener('click', function(e) {
        if (e.target === splashModal) {
            closeSplashModal();
        }
    });
}

// ================================================================
//  ⚙️ HEADER SETTINGS BUTTON
// ================================================================

const headerSettingsBtn = document.getElementById('header-settings');

if (headerSettingsBtn) {
    headerSettingsBtn.addEventListener('click', function() {
        openSettingsModal();
    });
}

// ================================================================
//  🔔 TOAST
// ================================================================

function showToast(messageKey, type = 'info', name = '') {
    let message = t(messageKey);
    if (name) {
        message = message.replace('{name}', name);
    }

    const oldToast = document.querySelector('.toast-notification');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.textContent = message;

    const colors = { success: '#00C853', error: '#FF1744', warning: '#FFD600', info: '#2979FF' };
    toast.style.cssText = `
        position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
        background: var(--card); backdrop-filter: blur(10px);
        border: 2px solid ${colors[type] || '#6C63FF'}; color: var(--text);
        padding: 14px 28px; border-radius: 12px; font-size: 1rem;
        z-index: 9999; box-shadow: 0 8px 30px rgba(0,0,0,0.4);
        animation: slideUp 0.4s ease; max-width: 90%; text-align: center;
        font-family: 'Cairo', sans-serif;
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(-20px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

console.log('🚀 TrackSphere - تم التحميل بنجاح!');
console.log('📊 عدد العادات:', habits.length);
console.log('⭐ النقاط:', points);