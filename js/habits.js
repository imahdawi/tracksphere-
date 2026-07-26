// ====== HABITS CORE FUNCTIONS ======

// ====== ADD HABIT ======
function addHabit(name, category) {
    if (!name || name.trim() === '') {
        showToast('⚠️ من فضلك اكتب اسم العادة', 'error');
        return null;
    }

    if (habits.some(function(h) { return h.name.toLowerCase() === name.trim().toLowerCase(); })) {
        showToast('⚠️ هذه العادة موجودة بالفعل', 'warning');
        return null;
    }

    var newHabit = {
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
    
    showToast('✅ تم إضافة "' + newHabit.name + '" بنجاح', 'success');
    return newHabit;
}

// ====== TOGGLE HABIT ======
function toggleHabit(id) {
    var habit = habits.find(function(h) { return h.id === id; });
    if (!habit) {
        showToast('⚠️ العادة غير موجودة', 'error');
        return;
    }

    var today = new Date().toDateString();
    var todayIndex = habit.history.indexOf(today);

    if (todayIndex !== -1) {
        habit.history.splice(todayIndex, 1);
        habit.completed = habit.history.some(function(d) { return d === today; });
        showToast('↩️ تم إلغاء تسجيل "' + habit.name + '"', 'info');
    } else {
        habit.history.push(today);
        habit.completed = true;
        calculateStreak(habit);
        
        var earnedPoints = 10;
        if (habit.streak >= 7) earnedPoints += 20;
        if (habit.streak >= 30) earnedPoints += 50;
        if (habit.streak >= 100) earnedPoints += 100;
        
        points += earnedPoints;
        
        showToast('✅ تم تسجيل "' + habit.name + '" +' + earnedPoints + ' نقطة', 'success');
    }

    saveData();
    renderHabits();
    updateStats();
    updateAchievements();
    updateChart();
}

// ====== DELETE HABIT ======
function deleteHabit(id) {
    var habit = habits.find(function(h) { return h.id === id; });
    if (!habit) return;
    
    if (!confirm('هل أنت متأكد من حذف عادة "' + habit.name + '"؟')) return;
    
    habits = habits.filter(function(h) { return h.id !== id; });
    saveData();
    renderHabits();
    updateStats();
    updateAchievements();
    updateChart();
    
    showToast('🗑️ تم حذف "' + habit.name + '"', 'info');
}

// ====== CALCULATE STREAK ======
function calculateStreak(habit) {
    if (habit.history.length === 0) {
        habit.streak = 0;
        return;
    }

    var streak = 0;
    var currentDate = new Date();
    
    for (var i = 0; i < habit.history.length; i++) {
        var dateStr = new Date(currentDate).toDateString();
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
    return habits.filter(function(h) { return h.category === category; });
}

// ====== GET TODAY'S HABITS ======
function getTodayHabits() {
    var today = new Date().toDateString();
    return habits.map(function(h) {
        return {
            ...h,
            doneToday: h.history.includes(today)
        };
    });
}

// ====== GET WEEKLY STATS ======
function getWeeklyStats() {
    var days = [];
    var today = new Date();
    
    for (var i = 6; i >= 0; i--) {
        var date = new Date(today);
        date.setDate(date.getDate() - i);
        var dateStr = date.toDateString();
        
        var completed = 0;
        habits.forEach(function(habit) {
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
    var month = new Date().getMonth();
    var year = new Date().getFullYear();
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    
    var stats = [];
    for (var day = 1; day <= daysInMonth; day++) {
        var date = new Date(year, month, day);
        var dateStr = date.toDateString();
        
        var completed = 0;
        habits.forEach(function(habit) {
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
    var data = {
        habits: habits,
        points: points,
        achievements: achievements,
        exportedAt: new Date().toISOString(),
        version: '1.0'
    };
    
    var json = JSON.stringify(data, null, 2);
    var blob = new Blob([json], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    
    var a = document.createElement('a');
    a.href = url;
    a.download = 'tracksphere_backup_' + new Date().toISOString().split('T')[0] + '.json';
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('📦 تم تصدير البيانات بنجاح', 'success');
}

// ====== IMPORT DATA ======
function importData(file) {
    var reader = new FileReader();
    reader.onload = function(e) {
        try {
            var data = JSON.parse(e.target.result);
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
    var icons = {
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
    var colors = {
        'صحية': '#00C853',
        'تعليمية': '#2979FF',
        'روحية': '#FF6D00',
        'رياضية': '#FF1744',
        'أخرى': '#6C63FF'
    };
    return colors[category] || '#6C63FF';
}

console.log('📋 Habits module loaded!');