// ====== ACHIEVEMENTS ======
var ACHIEVEMENTS_CONFIG = [
    {
        id: 'first_habit',
        name: { ar: '🚀 البداية', en: '🚀 First Step' },
        desc: { ar: 'أضفت أول عادة', en: 'Added your first habit' },
        condition: function() { return habits.length >= 1; }
    },
    {
        id: 'seven_streak',
        name: { ar: '🔥 7 أيام', en: '🔥 7 Days' },
        desc: { ar: 'حافظت على عادة 7 أيام متتالية', en: 'Maintained a 7-day streak' },
        condition: function() { return habits.some(function(h) { return h.streak >= 7; }); }
    },
    {
        id: 'thirty_streak',
        name: { ar: '⭐ 30 يوم', en: '⭐ 30 Days' },
        desc: { ar: 'حافظت على عادة 30 يوم متتالية', en: 'Maintained a 30-day streak' },
        condition: function() { return habits.some(function(h) { return h.streak >= 30; }); }
    },
    {
        id: 'five_habits',
        name: { ar: '📋 5 عادات', en: '📋 5 Habits' },
        desc: { ar: 'أضفت 5 عادات مختلفة', en: 'Added 5 different habits' },
        condition: function() { return habits.length >= 5; }
    },
    {
        id: 'perfect_day',
        name: { ar: '💯 يوم مثالي', en: '💯 Perfect Day' },
        desc: { ar: 'أنهيت كل عاداتك في يوم واحد', en: 'Completed all habits in one day' },
        condition: function() {
            var today = new Date().toDateString();
            return habits.length > 0 && habits.every(function(h) { return h.history.includes(today); });
        }
    },
    {
        id: 'points_master',
        name: { ar: '🏆 500 نقطة', en: '🏆 500 Points' },
        desc: { ar: 'حصلت على 500 نقطة', en: 'Reached 500 points' },
        condition: function() { return points >= 500; }
    }
];

// ====== UPDATE ACHIEVEMENTS ======
function updateAchievements() {
    var unlocked = ACHIEVEMENTS_CONFIG.filter(function(a) { return a.condition(); });
    var unlockedIds = unlocked.map(function(a) { return a.id; });

    // تحقق من الإنجازات الجديدة
    var newAchievements = unlockedIds.filter(function(id) {
        return !achievements.includes(id);
    });

    // أضف الإنجازات الجديدة
    newAchievements.forEach(function(id) {
        var ach = ACHIEVEMENTS_CONFIG.find(function(a) { return a.id === id; });
        if (ach) {
            var name = ach.name[currentLang] || ach.name.ar;
            showToast('toast_achievement', 'success', name);
        }
    });

    achievements = unlockedIds;

    var container = document.getElementById('achievements-list');
    if (!container) return;

    container.innerHTML = ACHIEVEMENTS_CONFIG.map(function(a) {
        var isUnlocked = unlockedIds.includes(a.id);
        var name = a.name[currentLang] || a.name.ar;
        var desc = a.desc[currentLang] || a.desc.ar;
        return '\
        <div class="achievement-item ' + (isUnlocked ? 'unlocked' : '') + '">\
            <i class="fas fa-' + (isUnlocked ? 'star' : 'lock') + '"></i>\
            <span>' + name + '</span>\
            <small>' + desc + '</small>\
        </div>';
    }).join('');
}

console.log('🏆 Gamification module loaded!');