// ====== HABITS CORE FUNCTIONS ======

// تصدير الدوال للاستخدام في app.js
window.habitsModule = {
    addHabit,
    toggleHabit,
    deleteHabit,
    getHabitsByCategory,
    getTodayHabits,
    getWeeklyStats,
    getMonthlyStats,
    exportData,
    importData,
    resetAllData
};

// ====== ADD HABIT ======
function addHabit(name, category) {
    if (!name || name.trim() === '') {
        showToast('⚠️ من فضلك اكتب اسم العادة', 'error');
        return null;
    }

    // منع التكرار
    if (habits.some(h => h.name.toLowerCase() === name.trim().toLowerCase())) {
        showToast('⚠️ هذه العادة موجودة بالفعل', 'warning');
        return null;
    }

    const newHabit = {
        id: Date.now() + Math.random() * 1000,
        name: name.trim(),
        category: category || 'أخرى',
        icon: getCategoryIcon(category),
        completed: false,
        streak: 0,
        bestStreak: 0,
        history: [],
        createdAt: new Date().toISOString(),
        color: getCategoryColor(category)
    };

    habits.push(newHabit);
    saveData();
    renderHabits();
    updateStats();
    updateAchievements();
    updateChart();
    
    showToast(`✅ تم إضافة "${newHabit.name}" بنجاح`, 'success');
    return newHabit;
}

// ====== TOGGLE HABIT ======
function toggleHabit(id) {
    const habit = habits.find(h => h.id === id);
    if (!habit) {
        showToast('⚠️ العادة غير موجودة', 'error');
        return;
    }

    const today = new Date().toDateString();
    const todayIndex = habit.history.indexOf(today);

    // إذا كانت مسجلة اليوم، نلغي التسجيل
    if (todayIndex !== -1) {
        habit.history.splice(todayIndex, 1);
        habit.completed = habit.history.some(d => d === today);
        showToast(`↩️ تم إلغاء تسجيل "${habit.name}"`, 'info');
    } else {
        // تسجيل العادة
        habit.history.push(today);
        habit.completed = true;
        
        // حساب السلسلة (Streak)
        calculateStreak(habit);
        
        // إضافة نقاط
        let earnedPoints = 10;
        if (habit.streak >= 7) earnedPoints += 20;
        if (habit.streak >= 30) earnedPoints += 50;
        if (habit.streak >= 100) earnedPoints += 100;
        
        points += earnedPoints;
        
        showToast(`✅ تم تسجيل "${habit.name}" +${earnedPoints} نقطة`, 'success');
    }

    saveData();
    renderHabits();
    updateStats();
    updateAchievements();
    updateChart();
}

// ====== DELETE HABIT ======
function deleteHabit(id) {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;
    
    if (!confirm(`هل أنت متأكد من حذف عادة "${habit.name}"؟`)) return;
    
    habits = habits.filter(h => h.id !== id);
    saveData();
    renderHabits();
    updateStats();
    updateAchievements();
    updateChart();
    
    showToast(`🗑️ تم حذف "${habit.name}"`, 'info');
}

// ====== CALCULATE STREAK ======
function calculateStreak(habit) {
    if (habit.history.length === 0) {
        habit.streak = 0;
        return;
    }

    let streak = 0;
    let currentDate = new Date();
    
    // نبدأ من اليوم ونرجع للوراء
    for (let i = 0; i < habit.history.length; i++) {
        const dateStr = new Date(currentDate).toDateString();
        if (habit.history.includes(dateStr)) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }
    }
    
    habit.streak = streak;
    if (streak > habit.bestStreak) {
        habit.bestStreak = streak;
    }
}

// ====== GET HABITS BY CATEGORY ======
function getHabitsByCategory(category) {
    return habits.filter(h => h.category === category);
}

// ====== GET TODAY'S HABITS ======
function getTodayHabits() {
    const today = new Date().toDateString();
    return habits.map(h => ({
        ...h,
        doneToday: h.history.includes(today)
    }));
}

// ====== GET WEEKLY STATS ======
function getWeeklyStats() {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();
        
        let completed = 0;
        habits.forEach(habit => {
            if (habit.history.includes(dateStr)) completed++;
        });
        
        days.push({
            date: dateStr,
            day: date.toLocaleDateString('ar-EG', { weekday: 'short' }),
            completed: completed,
            total: habits.length
        });
    }
    return days;
}

// ====== GET MONTHLY STATS ======
function getMonthlyStats() {
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const stats = [];
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateStr = date.toDateString();
        
        let completed = 0;
        habits.forEach(habit => {
            if (habit.history.includes(dateStr)) completed++;
        });
        
        stats.push({
            day: day,
            date: dateStr,
            completed: completed,
            total: habits.length
        });
    }
    return stats;
}

// ====== EXPORT DATA ======
function exportData() {
    const data = {
        habits: habits,
        points: points,
        achievements: achievements,
        exportedAt: new Date().toISOString(),
        version: '1.0'
    };
    
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `tracksphere_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('📦 تم تصدير البيانات بنجاح', 'success');
}

// ====== IMPORT DATA ======
function importData(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (!data.habits || !Array.isArray(data.habits)) {
                showToast('⚠️ ملف غير صالح', 'error');
                return;
            }
            
            if (!confirm('⚠️ سيتم استبدال جميع البيانات الحالية. هل أنت متأكد؟')) return;
            
            habits = data.habits || [];
            points = data.points || 0;
            achievements = data.achievements || [];
            
            saveData();
            renderHabits();
            updateStats();
            updateAchievements();
            updateChart();
            
            showToast('✅ تم استيراد البيانات بنجاح', 'success');
        } catch (error) {
            showToast('⚠️ خطأ في قراءة الملف', 'error');
            console.error(error);
        }
    };
    reader.readAsText(file);
}

// ====== RESET ALL DATA ======
function resetAllData() {
    if (!confirm('⚠️ هذا سيحذف جميع البيانات نهائياً! هل أنت متأكد؟')) return;
    if (!confirm('⚠️ هل أنت متأكد مرة أخرى؟')) return;
    
    habits = [];
    points = 0;
    achievements = [];
    localStorage.removeItem('tracksphere_data');
    
    renderHabits();
    updateStats();
    updateAchievements();
    updateChart();
    
    showToast('🗑️ تم حذف جميع البيانات', 'info');
}

// ====== HELPER: CATEGORY ICON ======
function getCategoryIcon(category) {
    const icons = {
        'صحية': '💪',
        'تعليمية': '📚',
        'روحية': '🕌',
        'رياضية': '⚽',
        'أخرى': '✨'
    };
    return icons[category] || '✨';
}

// ====== HELPER: CATEGORY COLOR ======
function getCategoryColor(category) {
    const colors = {
        'صحية': '#00C853',
        'تعليمية': '#2979FF',
        'روحية': '#FF6D00',
        'رياضية': '#FF1744',
        'أخرى': '#6C63FF'
    };
    return colors[category] || '#6C63FF';
}

// ====== TOAST NOTIFICATION ======
function showToast(message, type = 'info') {
    // إزالة أي toast قديم
    const oldToast = document.querySelector('.toast-notification');
    if (oldToast) oldToast.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = message;
    
    const colors = {
        success: '#00C853',
        error: '#FF1744',
        warning: '#FFD600',
        info: '#2979FF'
    };
    
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--card);
        backdrop-filter: blur(10px);
        border: 2px solid ${colors[type] || '#6C63FF'};
        color: var(--text);
        padding: 14px 28px;
        border-radius: 12px;
        font-size: 1rem;
        z-index: 9999;
        box-shadow: 0 8px 30px rgba(0,0,0,0.4);
        animation: slideUp 0.4s ease;
        max-width: 90%;
        text-align: center;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(-20px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// إضافة الـ Toast style
const toastStyle = document.createElement('style');
toastStyle.textContent = `
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
`;
document.head.appendChild(toastStyle);