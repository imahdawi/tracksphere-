// ================================================================
//  🚀 APP MODULE
// ================================================================

// ====== STATE ======
var habits = [];
var points = 0;
var achievements = [];

// ====== DOM REFS ======
var habitsList = document.getElementById('habits-list');
var habitInput = document.getElementById('habit-input');
var habitCategory = document.getElementById('habit-category');
var addBtn = document.getElementById('add-btn');
var totalHabitsEl = document.getElementById('total-habits');
var totalStreakEl = document.getElementById('total-streak');
var completionRateEl = document.getElementById('completion-rate');
var totalPointsEl = document.getElementById('total-points');

// ================================================================
//  🛠️ CALCULATE POINTS
// ================================================================

function calculatePointsFromHabits() {
    var total = 0;
    for (var i = 0; i < habits.length; i++) {
        var h = habits[i];
        total += h.history.length * 10;
        if (h.history.length >= 1) total += 5;
        if (h.history.length >= 7) total += 15;
        if (h.history.length >= 30) total += 30;
        if (h.streak >= 7) total += 20;
        if (h.streak >= 30) total += 50;
        if (h.streak >= 100) total += 100;
    }
    return total;
}

// ================================================================
//  🌐 THEME
// ================================================================

function loadTheme() {
    var theme = localStorage.getItem('theme');
    if (theme === 'light') {
        document.body.classList.add('light');
    } else {
        document.body.classList.remove('light');
    }
}

// ================================================================
//  🚀 INIT
// ================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 App initializing...');

    loadTheme();
    loadData();

    if (typeof updateUILanguage === 'function') {
        updateUILanguage();
    }

    renderHabits();
    updateStats();
    updateAchievements();
    updateDate();

    setTimeout(function() {
        if (typeof initChart === 'function') {
            initChart();
        }
    }, 300);

    console.log('🚀 App initialized!');
});

// ================================================================
//  ➕ ADD HABIT - ⭐ إصلاح التصنيفات
// ================================================================

addBtn.addEventListener('click', function() {
    var name = habitInput.value.trim();
    var categoryKey = habitCategory.value; // دي بقى "healthy" مش "صحية"

    console.log('📝 Adding habit:', name, 'category:', categoryKey);

    if (!name) {
        showToast('toast_error_empty_name', 'error');
        return;
    }

    // منع التكرار
    for (var i = 0; i < habits.length; i++) {
        if (habits[i].name.toLowerCase() === name.toLowerCase()) {
            showToast('toast_error_exists', 'warning');
            return;
        }
    }

    // التحقق من صحة التصنيف
    if (!isValidCategory(categoryKey)) {
        console.warn('⚠️ Invalid category:', categoryKey, 'defaulting to other');
        categoryKey = 'other';
    }

    var newHabit = {
        id: Date.now() + Math.random() * 1000,
        name: name,
        category: categoryKey, // ✅ "healthy" مش "صحية"
        icon: getCategoryIcon(categoryKey),
        completed: false,
        streak: 0,
        bestStreak: 0,
        history: [],
        createdAt: new Date().toISOString()
    };

    habits.push(newHabit);
    habitInput.value = '';

    saveData();
    renderHabits();
    updateStats();
    updateAchievements();

    if (typeof updateChart === 'function') {
        updateChart();
    }

    showToast('toast_success_added', 'success', name);
});

// ================================================================
//  🔄 TOGGLE HABIT
// ================================================================

function toggleHabit(id) {
    var habit = null;
    for (var i = 0; i < habits.length; i++) {
        if (habits[i].id === id) {
            habit = habits[i];
            break;
        }
    }

    if (!habit) {
        showToast('⚠️ العادة غير موجودة', 'error');
        return;
    }

    var today = new Date().toDateString();
    var found = false;
    for (var i = 0; i < habit.history.length; i++) {
        if (habit.history[i] === today) {
            found = true;
            break;
        }
    }

    if (found) {
        var newHistory = [];
        for (var i = 0; i < habit.history.length; i++) {
            if (habit.history[i] !== today) {
                newHistory.push(habit.history[i]);
            }
        }
        habit.history = newHistory;
        habit.completed = false;
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

    if (typeof updateChart === 'function') {
        updateChart();
    }
}

// ================================================================
//  🔥 CALCULATE STREAK
// ================================================================

function calculateStreak(habit) {
    if (habit.history.length === 0) {
        habit.streak = 0;
        return;
    }

    var streak = 0;
    var currentDate = new Date();

    for (var i = 0; i < habit.history.length; i++) {
        var dateStr = currentDate.toDateString();
        var found = false;
        for (var j = 0; j < habit.history.length; j++) {
            if (habit.history[j] === dateStr) {
                found = true;
                break;
            }
        }
        if (found) {
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

// ================================================================
//  🗑️ DELETE HABIT
// ================================================================

function deleteHabit(id) {
    var habit = null;
    for (var i = 0; i < habits.length; i++) {
        if (habits[i].id === id) {
            habit = habits[i];
            break;
        }
    }

    if (!habit) return;

    if (!confirm('🗑️ هل أنت متأكد من حذف عادة "' + habit.name + '"؟')) return;

    var newHabits = [];
    for (var i = 0; i < habits.length; i++) {
        if (habits[i].id !== id) {
            newHabits.push(habits[i]);
        }
    }
    habits = newHabits;

    saveData();
    renderHabits();
    updateStats();
    updateAchievements();

    if (typeof updateChart === 'function') {
        updateChart();
    }

    showToast('toast_info_deleted', 'info', habit.name);
}

// ================================================================
//  📋 RENDER HABITS
// ================================================================

function renderHabits() {
    if (!habitsList) return;

    if (habits.length === 0) {
        habitsList.innerHTML = '<div class="empty-state"><i class="fas fa-plus-circle"></i><p data-i18n="habits_empty">لا توجد عادات بعد! أضف عادة جديدة 👆</p></div>';
        return;
    }

    var dayText = t('habits_day');
    var html = '';

    for (var i = 0; i < habits.length; i++) {
        var habit = habits[i];
        var today = new Date().toDateString();
        var isDoneToday = false;

        for (var j = 0; j < habit.history.length; j++) {
            if (habit.history[j] === today) {
                isDoneToday = true;
                break;
            }
        }

        var categoryText = getCategoryTranslation(habit.category);
        var icon = getCategoryIcon(habit.category);

        html += `
        <div class="habit-item ${isDoneToday ? 'completed' : ''}">
            <div class="habit-info">
                <span class="habit-icon">${icon}</span>
                <div>
                    <span class="habit-name">${habit.name}</span>
                    <span class="habit-category">${categoryText}</span>
                </div>
            </div>
            <div class="habit-streak"><i class="fas fa-fire"></i> ${habit.streak || 0} ${dayText}</div>
            <div class="habit-actions">
                <button class="btn-check" onclick="toggleHabit(${habit.id})" ${isDoneToday ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : ''}><i class="fas fa-check"></i></button>
                <button class="btn-delete" onclick="deleteHabit(${habit.id})"><i class="fas fa-trash"></i></button>
            </div>
        </div>`;
    }

    habitsList.innerHTML = html;
}

// ================================================================
//  📊 UPDATE STATS
// ================================================================

function updateStats() {
    var total = habits.length;

    var today = new Date().toDateString();
    var completedToday = 0;
    for (var i = 0; i < habits.length; i++) {
        for (var j = 0; j < habits[i].history.length; j++) {
            if (habits[i].history[j] === today) {
                completedToday++;
                break;
            }
        }
    }

    var rate = total === 0 ? 0 : Math.round((completedToday / total) * 100);

    var maxStreak = 0;
    for (var i = 0; i < habits.length; i++) {
        if ((habits[i].streak || 0) > maxStreak) {
            maxStreak = habits[i].streak || 0;
        }
    }

    points = calculatePointsFromHabits();

    if (totalHabitsEl) totalHabitsEl.textContent = total;
    if (totalStreakEl) totalStreakEl.textContent = maxStreak;
    if (completionRateEl) completionRateEl.textContent = rate + '%';
    if (totalPointsEl) totalPointsEl.textContent = points;

    saveData();
}

// ================================================================
//  📅 UPDATE DATE
// ================================================================

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

// ================================================================
//  🗑️ RESET
// ================================================================

document.getElementById('reset-btn').addEventListener('click', function() {
    if (confirm('⚠️ هل أنت متأكد من حذف جميع البيانات؟')) {
        if (confirm('⚠️ هل أنت متأكد مرة أخرى؟')) {
            localStorage.removeItem('tracksphere_data');
            habits = [];
            points = 0;
            achievements = [];
            renderHabits();
            updateStats();
            updateAchievements();
            if (typeof updateChart === 'function') updateChart();
            showToast('🗑️ تم حذف جميع البيانات بنجاح', 'success');
        }
    }
});

// ================================================================
//  🌐 THEME TOGGLE
// ================================================================

function toggleThemeFromSettings() {
    document.body.classList.toggle('light');
    var isLight = document.body.classList.contains('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    if (typeof openSettingsModal === 'function') {
        openSettingsModal();
    }
}

// ================================================================
//  📤 SHARE PROGRESS
// ================================================================

function generateShareImage() {
    // ✅ 1. تحقق من وجود المكتبة
    if (typeof html2canvas === 'undefined') {
        showToast('⏳ جاري تحميل المكتبة...', 'info');
        var script = document.createElement('script');
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

    var preview = document.getElementById('share-preview');
    if (!preview) {
        showToast('⚠️ عنصر المعاينة غير موجود', 'error');
        return;
    }

    // ✅ 2. ظهور رسالة التحميل (بدل المعاينة الكبيرة)
    var loadingHTML = `
        <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background: var(--card);
            border-radius: 12px;
            border: 1px solid var(--border);
            min-height: 120px;
        ">
            <div style="
                width: 40px;
                height: 40px;
                border: 4px solid var(--border);
                border-top: 4px solid #6C63FF;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
            "></div>
            <p style="
                margin-top: 12px;
                color: var(--text-secondary);
                font-size: 0.9rem;
                font-family: 'Cairo', sans-serif;
            ">
                ⏳ جاري تحميل الصورة...
            </p>
        </div>
    `;

    // ✅ 3. عرض رسالة التحميل
    preview.style.display = 'flex';
    preview.innerHTML = loadingHTML;

    // ✅ 4. بناء الصورة الفعلية (في الخلفية)
    var total = habits.length;
    var today = new Date().toDateString();
    var completedToday = 0;

    for (var i = 0; i < habits.length; i++) {
        for (var j = 0; j < habits[i].history.length; j++) {
            if (habits[i].history[j] === today) {
                completedToday++;
                break;
            }
        }
    }

    var rate = total === 0 ? 0 : Math.round((completedToday / total) * 100);

    var maxStreak = 0;
    for (var i = 0; i < habits.length; i++) {
        if ((habits[i].streak || 0) > maxStreak) {
            maxStreak = habits[i].streak || 0;
        }
    }

    var todayStr = new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    var bestHabit = null;
    for (var i = 0; i < habits.length; i++) {
        if (bestHabit === null || (habits[i].streak || 0) > (bestHabit.streak || 0)) {
            bestHabit = habits[i];
        }
    }

    // ✅ 5. الـ HTML الخاص بالصورة (زي ما هو)
    var html = '';
    if (currentLang === 'ar') {
        html = `
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
                    🏆 أكثر عادة: <strong style="color:#fff;">${getCategoryIcon(bestHabit.category)} ${bestHabit.name}</strong>
                    <span style="color:#FFD600;font-size:0.9rem;">(${bestHabit.streak} يوم)</span>
                </div>` : ''}
                <hr style="border-color:rgba(108,99,255,0.15);margin:10px 0;" />
                <div style="font-size:1.2rem;color:#fff;font-weight:500;margin:6px 0;">💪 أنا بحسن من نفسي يوم عن يوم!</div>
                <div style="font-size:0.8rem;color:#6C63FF;margin-top:8px;">#Mahdawi_Challenge</div>
            </div>
        `;
    } else {
        html = `
            <div style="text-align:center;padding:24px 20px;background:linear-gradient(135deg, #0A0A1A 0%, #1A1A3E 100%);border-radius:20px;border:2px solid #6C63FF;width:500px;margin:0 auto;font-family:'Cairo',sans-serif;box-sizing:border-box;">
                <div style="display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:6px;">
                    <span style="font-size:2.4rem;">🚀</span>
                    <span style="font-size:2rem;font-weight:800;color:#6C63FF;">TrackSphere</span>
                </div>
                <div style="color:#A0A0C0;font-size:1rem;margin-bottom:10px;">${todayStr}</div>
                <hr style="border-color:rgba(108,99,255,0.15);margin:8px 0;" />
                <div style="display:flex;justify-content:center;gap:20px;flex-wrap:wrap;margin:10px 0;">
                    <span style="background:rgba(108,99,255,0.12);padding:6px 18px;border-radius:50px;font-weight:600;font-size:1.1rem;">🔥 ${maxStreak} days</span>
                    <span style="background:rgba(0,200,83,0.12);padding:6px 18px;border-radius:50px;font-weight:600;font-size:1.1rem;color:#00C853;">📈 ${rate}%</span>
                    <span style="background:rgba(255,214,0,0.12);padding:6px 18px;border-radius:50px;font-weight:600;font-size:1.1rem;color:#FFD600;">⭐ ${points}</span>
                </div>
                ${bestHabit && bestHabit.streak > 0 ? `
                <hr style="border-color:rgba(108,99,255,0.15);margin:8px 0;" />
                <div style="font-size:1rem;color:#A0A0C0;">
                    🏆 Best habit: <strong style="color:#fff;">${getCategoryIcon(bestHabit.category)} ${bestHabit.name}</strong>
                    <span style="color:#FFD600;font-size:0.9rem;">(${bestHabit.streak} days)</span>
                </div>` : ''}
                <hr style="border-color:rgba(108,99,255,0.15);margin:10px 0;" />
                <div style="font-size:1.2rem;color:#fff;font-weight:500;margin:6px 0;">💪 I'm improving myself every day!</div>
                <div style="font-size:0.8rem;color:#6C63FF;margin-top:8px;">#Mahdawi_Challenge</div>
            </div>
        `;
    }

    // ✅ 6. إنشاء الصورة من الـ HTML (في الخلفية)
    var tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.innerHTML = html;
    document.body.appendChild(tempDiv);

    html2canvas(tempDiv, {
        backgroundColor: null,
        scale: 2.5,
        useCORS: true,
        logging: false,
        width: 500
    }).then(function(canvas) {
        // ✅ 7. تحميل الصورة
        var link = document.createElement('a');
        link.download = 'tracksphere_' + new Date().toISOString().split('T')[0] + '.png';
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // ✅ 8. إزالة العنصر المؤقت
        document.body.removeChild(tempDiv);

        // ✅ 9. إخفاء المعاينة بعد 3 ثواني
        setTimeout(function() {
            preview.style.display = 'none';
            preview.innerHTML = '';
            showToast('✅ تم تحميل الصورة بنجاح!', 'success');
        }, 3000);

    }).catch(function(err) {
        console.error('Share error:', err);
        document.body.removeChild(tempDiv);
        preview.style.display = 'none';
        preview.innerHTML = '';
        showToast('toast_share_error', 'error');
    });
}

function shareProgress(platform) {
    if (platform === 'whatsapp') {
        var text = generateShareText();
        var url = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(text);
        window.open(url, '_blank');
    } else {
        generateShareImage();
    }
}

function generateShareImage() {
    if (typeof html2canvas === 'undefined') {
        showToast('⏳ جاري تحميل المكتبة...', 'info');
        var script = document.createElement('script');
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

    var preview = document.getElementById('share-preview');
    if (!preview) {
        showToast('⚠️ عنصر المعاينة غير موجود', 'error');
        return;
    }

    var total = habits.length;
    var today = new Date().toDateString();
    var completedToday = 0;

    for (var i = 0; i < habits.length; i++) {
        for (var j = 0; j < habits[i].history.length; j++) {
            if (habits[i].history[j] === today) {
                completedToday++;
                break;
            }
        }
    }

    var rate = total === 0 ? 0 : Math.round((completedToday / total) * 100);

    var maxStreak = 0;
    for (var i = 0; i < habits.length; i++) {
        if ((habits[i].streak || 0) > maxStreak) {
            maxStreak = habits[i].streak || 0;
        }
    }

    var todayStr = new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    var bestHabit = null;
    for (var i = 0; i < habits.length; i++) {
        if (bestHabit === null || (habits[i].streak || 0) > (bestHabit.streak || 0)) {
            bestHabit = habits[i];
        }
    }

    var html = '';
    if (currentLang === 'ar') {
        html = `
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
                    🏆 أكثر عادة: <strong style="color:#fff;">${getCategoryIcon(bestHabit.category)} ${bestHabit.name}</strong>
                    <span style="color:#FFD600;font-size:0.9rem;">(${bestHabit.streak} يوم)</span>
                </div>` : ''}
                <hr style="border-color:rgba(108,99,255,0.15);margin:10px 0;" />
                <div style="font-size:1.2rem;color:#fff;font-weight:500;margin:6px 0;">💪 أنا بحسن من نفسي يوم عن يوم!</div>
                <div style="font-size:0.8rem;color:#6C63FF;margin-top:8px;">#Mahdawi_Challenge</div>
            </div>
        `;
    } else {
        html = `
            <div style="text-align:center;padding:24px 20px;background:linear-gradient(135deg, #0A0A1A 0%, #1A1A3E 100%);border-radius:20px;border:2px solid #6C63FF;width:500px;margin:0 auto;font-family:'Cairo',sans-serif;box-sizing:border-box;">
                <div style="display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:6px;">
                    <span style="font-size:2.4rem;">🚀</span>
                    <span style="font-size:2rem;font-weight:800;color:#6C63FF;">TrackSphere</span>
                </div>
                <div style="color:#A0A0C0;font-size:1rem;margin-bottom:10px;">${todayStr}</div>
                <hr style="border-color:rgba(108,99,255,0.15);margin:8px 0;" />
                <div style="display:flex;justify-content:center;gap:20px;flex-wrap:wrap;margin:10px 0;">
                    <span style="background:rgba(108,99,255,0.12);padding:6px 18px;border-radius:50px;font-weight:600;font-size:1.1rem;">🔥 ${maxStreak} days</span>
                    <span style="background:rgba(0,200,83,0.12);padding:6px 18px;border-radius:50px;font-weight:600;font-size:1.1rem;color:#00C853;">📈 ${rate}%</span>
                    <span style="background:rgba(255,214,0,0.12);padding:6px 18px;border-radius:50px;font-weight:600;font-size:1.1rem;color:#FFD600;">⭐ ${points}</span>
                </div>
                ${bestHabit && bestHabit.streak > 0 ? `
                <hr style="border-color:rgba(108,99,255,0.15);margin:8px 0;" />
                <div style="font-size:1rem;color:#A0A0C0;">
                    🏆 Best habit: <strong style="color:#fff;">${getCategoryIcon(bestHabit.category)} ${bestHabit.name}</strong>
                    <span style="color:#FFD600;font-size:0.9rem;">(${bestHabit.streak} days)</span>
                </div>` : ''}
                <hr style="border-color:rgba(108,99,255,0.15);margin:10px 0;" />
                <div style="font-size:1.2rem;color:#fff;font-weight:500;margin:6px 0;">💪 I'm improving myself every day!</div>
                <div style="font-size:0.8rem;color:#6C63FF;margin-top:8px;">#Mahdawi_Challenge</div>
            </div>
        `;
    }

    preview.style.display = 'flex';
    preview.style.justifyContent = 'center';
    preview.style.alignItems = 'center';
    preview.style.background = 'transparent';
    preview.style.padding = '0';
    preview.style.margin = '0 auto';
    preview.style.width = '500px';
    preview.style.maxWidth = '100%';
    preview.innerHTML = html;

    html2canvas(preview, {
        backgroundColor: null,
        scale: 2.5,
        useCORS: true,
        logging: false,
        width: 500
    }).then(function(canvas) {
        var link = document.createElement('a');
        link.download = 'tracksphere_' + new Date().toISOString().split('T')[0] + '.png';
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('toast_share_image', 'success');
    }).catch(function(err) {
        console.error('Share error:', err);
        showToast('toast_share_error', 'error');
    });
}

// ================================================================
//  🚀 SPLASH SCREEN
// ================================================================

var splashScreen = document.getElementById('splash-screen');
var splashStart = document.getElementById('splash-start');
var splashSettings = document.getElementById('splash-settings');
var splashInfo = document.getElementById('splash-info');
var splashAbout = document.getElementById('splash-about');
var splashModal = document.getElementById('splash-modal');
var splashModalBody = document.getElementById('splash-modal-body');

function hideSplash() {
    if (splashScreen) {
        splashScreen.classList.add('hidden');
    }
}

function openSplashModal(content) {
    if (splashModalBody) {
        splashModalBody.innerHTML = content;
    }
    if (splashModal) {
        splashModal.style.display = 'flex';
    }
}

function closeSplashModal() {
    if (splashModal) {
        splashModal.style.display = 'none';
    }
}

if (splashStart) {
    splashStart.addEventListener('click', hideSplash);
}

if (splashSettings) {
    splashSettings.addEventListener('click', openSettingsModal);
}

function openSettingsModal() {
    var isLight = document.body.classList.contains('light');
    var themeText = isLight ? t('settings_theme_light') : t('settings_theme_dark');
    var themeIcon = isLight ? '☀️' : '🌙';

    openSplashModal('\
        <h2 style="text-align:center;font-size:1.6rem;margin-bottom:20px;color:#6C63FF;">\
            ⚙️ ' + t('settings_title') + '\
        </h2>\
        <div class="settings-group">\
            <div class="settings-label">\
                <i class="fas fa-globe"></i>\
                <span>' + t('settings_language') + '</span>\
            </div>\
            <div class="settings-options">\
                <button onclick="setLanguage(\'ar\')" class="settings-option-btn ' + (currentLang === 'ar' ? 'active' : '') + '">\
                    ' + t('settings_language_ar') + '\
                </button>\
                <button onclick="setLanguage(\'en\')" class="settings-option-btn ' + (currentLang === 'en' ? 'active' : '') + '">\
                    ' + t('settings_language_en') + '\
                </button>\
            </div>\
        </div>\
        <div class="settings-group">\
            <div class="settings-label">\
                <i class="fas fa-moon"></i>\
                <span>' + t('settings_theme') + '</span>\
            </div>\
            <div class="settings-options">\
                <button onclick="toggleThemeFromSettings()" class="settings-option-btn" style="flex:1;justify-content:center;gap:8px;">\
                    <span>' + themeIcon + '</span>\
                    <span>' + themeText + '</span>\
                    <span style="font-size:0.8rem;color:var(--text-secondary);">(تبديل)</span>\
                </button>\
            </div>\
        </div>\
        <div class="settings-group" style="border-bottom:none;margin-bottom:0;padding-bottom:0;">\
            <div class="settings-label" style="justify-content:center;gap:6px;">\
                <i class="fas fa-tag"></i>\
                <span style="font-size:0.9rem;color:var(--text-secondary);">' + t('settings_version') + ' ' + t('version') + '</span>\
            </div>\
        </div>\
    ');
}

if (splashInfo) {
    splashInfo.addEventListener('click', function() {
        openSplashModal('\
            <h2>' + t('info_title') + '</h2>\
            <p>' + t('info_desc') + '</p>\
            <div class="modal-section">\
                <h4>' + t('info_features') + '</h4>\
                <p>' + t('info_features_list') + '</p>\
            </div>\
            <div class="modal-section">\
                <h4>' + t('settings_version') + '</h4>\
                <p>' + t('version') + '</p>\
            </div>\
        ');
    });
}

if (splashAbout) {
    splashAbout.addEventListener('click', function() {
        openSplashModal('\
            <h2>' + t('about_title') + '</h2>\
            <p><strong>' + t('about_name') + '</strong></p>\
            <div class="modal-section">\
                <h4>🚀 عني</h4>\
                <p>' + t('about_desc') + '</p>\
            </div>\
            <div class="modal-section">\
                <h4>' + t('about_follow') + '</h4>\
                <p>\
                    🐙 <a href="https://github.com/imahdawi" target="_blank" style="color:#6C63FF;">GitHub</a><br>\
                    🎵 <a href="https://tiktok.com/@imahdawi" target="_blank" style="color:#6C63FF;">TikTok</a><br>\
                    📧 <a href="mailto:mahdi.business.new@gmail.com" style="color:#6C63FF;">mahdi.business.new@gmail.com</a>\
                </p>\
            </div>\
            <div class="modal-section">\
                <h4>📦 الإصدار</h4>\
                <p>' + t('version') + '</p>\
            </div>\
        ');
    });
}

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

var headerSettingsBtn = document.getElementById('header-settings');
if (headerSettingsBtn) {
    headerSettingsBtn.addEventListener('click', function() {
        openSettingsModal();
    });
}

// ================================================================
//  🔔 TOAST
// ================================================================

function showToast(messageKey, type, name) {
    if (type === undefined) type = 'info';

    var message = t(messageKey);
    if (name) {
        message = message.replace('{name}', name);
    }

    var oldToast = document.querySelector('.toast-notification');
    if (oldToast) oldToast.remove();

    var toast = document.createElement('div');
    toast.className = 'toast-notification toast-' + type;
    toast.textContent = message;

    var colors = {
        success: '#00C853',
        error: '#FF1744',
        warning: '#FFD600',
        info: '#2979FF'
    };

    toast.style.cssText = '\
        position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);\
        background: var(--card); backdrop-filter: blur(10px);\
        border: 2px solid ' + (colors[type] || '#6C63FF') + '; color: var(--text);\
        padding: 14px 28px; border-radius: 12px; font-size: 1rem;\
        z-index: 9999; box-shadow: 0 8px 30px rgba(0,0,0,0.4);\
        animation: slideUp 0.4s ease; max-width: 90%; text-align: center;\
        font-family: \'Cairo\', sans-serif;\
    ';

    document.body.appendChild(toast);

    setTimeout(function() {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(-20px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(function() { toast.remove(); }, 300);
    }, 3000);
}

// ================================================================
//  📱 SERVICE WORKER - PWA
// ================================================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('📱 Service Worker registered successfully:', registration);
            })
            .catch(function(error) {
                console.log('📱 Service Worker registration failed:', error);
            });
    });
}

console.log('🚀 App module loaded!');