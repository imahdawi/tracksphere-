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

// ====== حساب النقاط ======
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

// ====== TOGGLE ======
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

// ====== DELETE ======
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

// ====== RENDER ======
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

// ====== STATS ======
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

// ====== DATE ======
function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    todayDateEl.textContent = now.toLocaleDateString('ar-EG', options);
}

// ====== THEME ======
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

// ====== TOAST ======
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