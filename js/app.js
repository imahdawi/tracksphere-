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
});

// ====== ADD HABIT ======
addBtn.addEventListener('click', () => {
    const name = habitInput.value.trim();
    const category = habitCategory.value;
    if (!name) return showToast('⚠️ من فضلك اكتب اسم العادة', 'error');
    if (habits.some(h => h.name.toLowerCase() === name.toLowerCase())) return showToast('⚠️ هذه العادة موجودة بالفعل', 'warning');
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
    showToast(`✅ تم إضافة "${name}" بنجاح`, 'success');
});

// ====== TOGGLE HABIT ======
function toggleHabit(id) {
    const habit = habits.find(h => h.id === id);
    if (!habit) return showToast('⚠️ العادة غير موجودة', 'error');
    const today = new Date().toDateString();
    if (habit.history.includes(today)) return showToast(`⚠️ "${habit.name}" مسجلة اليوم بالفعل!`, 'warning');
    habit.history.push(today);
    habit.completed = true;
    calculateStreak(habit);
    saveData();
    renderHabits();
    updateStats();
    updateAchievements();
    updateChart();
    showToast(`✅ تم تسجيل "${habit.name}" بنجاح`, 'success');
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
    showToast(`🗑️ تم حذف "${habit.name}"`, 'info');
}

// ====== RENDER HABITS ======
function renderHabits() {
    if (habits.length === 0) {
        habitsList.innerHTML = `<div class="empty-state"><i class="fas fa-plus-circle"></i><p>لا توجد عادات بعد! أضف عادة جديدة 👆</p></div>`;
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
            <div class="habit-streak"><i class="fas fa-fire"></i> ${habit.streak || 0} يوم</div>
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
            habits = [];
            points = 0;
            achievements = [];
            localStorage.clear();
            location.reload();
        }
    }
});

// ====== THEME TOGGLE ======
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('light');
    const icon = document.querySelector('#theme-toggle i');
    if (document.body.classList.contains('light')) {
        icon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'light');
    } else {
        icon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'dark');
    }
});

if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light');
    document.querySelector('#theme-toggle i').className = 'fas fa-sun';
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
    const today = new Date();
    const todayStr = today.toLocaleDateString('ar-EG', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });

    // حساب الإحصائيات من العادات الموجودة
    const completedToday = habits.filter(h => h.history.includes(today.toDateString())).length;
    const rate = total === 0 ? 0 : Math.round((completedToday / total) * 100);
    const maxStreak = habits.reduce((max, h) => Math.max(max, h.streak || 0), 0);
    const bestHabit = habits.length > 0 ? [...habits].sort((a, b) => (b.streak || 0) - (a.streak || 0))[0] : null;

    let html = `
        <div style="
            text-align:center;
            padding:24px 20px;
            background:linear-gradient(135deg, #0A0A1A 0%, #1A1A3E 100%);
            border-radius:20px;
            border:3px solid #6C63FF;
            width:520px;
            height:340px;
            margin:0 auto;
            font-family: 'Cairo', 'Segoe UI', sans-serif;
            display:flex;
            flex-direction:column;
            justify-content:center;
            align-items:center;
            box-sizing:border-box;
            box-shadow: 0 8px 40px rgba(108,99,255,0.15);
        ">
            <!-- Logo -->
            <div style="display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:2px;">
                <span style="font-size:2.4rem;">🚀</span>
                <span style="font-size:2rem;font-weight:800;color:#6C63FF;letter-spacing:1px;">TrackSphere</span>
            </div>
            
            <!-- التاريخ -->
            <div style="color:#A0A0C0;font-size:1rem;font-weight:400;margin-bottom:6px;">📅 ${todayStr}</div>

            <hr style="border-color:rgba(108,99,255,0.12);margin:6px 0;width:75%;" />

            <!-- Stats -->
            <div style="display:flex;justify-content:center;gap:18px;flex-wrap:wrap;margin:6px 0;">
                <span style="background:rgba(108,99,255,0.1);padding:6px 18px;border-radius:50px;font-weight:600;font-size:1rem;color:#fff;">🔥 ${maxStreak} يوم</span>
                <span style="background:rgba(0,200,83,0.1);padding:6px 18px;border-radius:50px;font-weight:600;font-size:1rem;color:#00C853;">📈 ${rate}%</span>
                <span style="background:rgba(255,214,0,0.1);padding:6px 18px;border-radius:50px;font-weight:600;font-size:1rem;color:#FFD600;">⭐ ${points}</span>
            </div>

            ${bestHabit && bestHabit.streak > 0 ? `
            <hr style="border-color:rgba(108,99,255,0.12);margin:6px 0;width:75%;" />
            <div style="font-size:1rem;color:#A0A0C0;">
                🏆 <strong style="color:#fff;font-size:1.1rem;">${bestHabit.icon} ${bestHabit.name}</strong>
                <span style="color:#FFD600;font-size:0.9rem;">(${bestHabit.streak} يوم)</span>
            </div>` : ''}

            <hr style="border-color:rgba(108,99,255,0.12);margin:8px 0;width:75%;" />

            <!-- الرسالة -->
            <div style="font-size:1.2rem;color:#fff;font-weight:500;margin:2px 0;">
                💪 أنا بحسن من نفسي يوم عن يوم!
            </div>

            <!-- الهاشتاج -->
            <div style="font-size:0.85rem;color:#6C63FF;margin-top:6px;font-weight:600;letter-spacing:0.5px;">
                #Mahdawi_Challenge
            </div>
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

    // 👇 العنصر يتمركز في النص
    preview.style.display = 'flex';
    preview.style.justifyContent = 'center';
    preview.style.alignItems = 'center';
    preview.style.background = 'transparent';
    preview.style.padding = '0';
    preview.style.margin = '0 auto';
    preview.style.width = '500px';
    preview.style.height = '320px';
    preview.style.maxWidth = '100%';

    // 👇 نحط المحتوى
    preview.innerHTML = generateShareHTML();

    // 👇 نأخذ الصورة
    html2canvas(preview, {
        backgroundColor: null,
        scale: 2.5,
        useCORS: true,
        logging: false,
        width: 500,
        height: 320,
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
        showToast('📸 تم تحميل الصورة!', 'success');
    })
    .catch(err => {
        console.error('Error generating image:', err);
        showToast('⚠️ حدث خطأ في إنشاء الصورة، حاول مرة أخرى', 'error');
    });
}

// ================================================================
//  🔔 TOAST
// ================================================================

function showToast(message, type = 'info') {
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