// ====== ACHIEVEMENTS ======
const ACHIEVEMENTS_CONFIG = [
    { id: 'first_habit', name: '🚀 البداية', desc: 'أضفت أول عادة', condition: () => habits.length >= 1 },
    { id: 'seven_streak', name: '🔥 7 أيام', desc: 'حافظت على عادة 7 أيام متتالية', condition: () => habits.some(h => h.streak >= 7) },
    { id: 'thirty_streak', name: '🔥 30 يوم', desc: 'حافظت على عادة 30 يوم متتالية', condition: () => habits.some(h => h.streak >= 30) },
    { id: 'five_habits', name: '📋 5 عادات', desc: 'أضفت 5 عادات مختلفة', condition: () => habits.length >= 5 },
    { id: 'perfect_day', name: '💯 يوم مثالي', desc: 'أنهيت كل عاداتك في يوم واحد', condition: () => {
        const today = new Date().toDateString();
        return habits.every(h => h.history.includes(today));
    }},
    { id: 'points_master', name: '🏆 500 نقطة', desc: 'حصلت على 500 نقطة', condition: () => points >= 500 },
];

function updateAchievements() {
    const unlocked = ACHIEVEMENTS_CONFIG.filter(a => a.condition());
    const unlockedIds = unlocked.map(a => a.id);
    
    // حفظ الإنجازات
    achievements = unlockedIds;
    
    // عرضها
    const container = document.getElementById('achievements-list');
    container.innerHTML = ACHIEVEMENTS_CONFIG.map(a => `
        <div class="achievement-item ${unlockedIds.includes(a.id) ? 'unlocked' : ''}">
            <i class="fas fa-${unlockedIds.includes(a.id) ? 'star' : 'lock'}"></i>
            <span>${a.name}</span>
            <small style="color:var(--text-secondary);font-size:0.7rem;">${a.desc}</small>
        </div>
    `).join('');
}