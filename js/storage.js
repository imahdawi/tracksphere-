// ====== LOCAL STORAGE ======
function saveData() {
    const data = {
        habits: habits,
        // 👇 مش بنحفظ النقاط عشان تتحسب من العادات
        // points: points,
        achievements: achievements,
        savedAt: new Date().toISOString()
    };
    localStorage.setItem('tracksphere_data', JSON.stringify(data));
}

function loadData() {
    const raw = localStorage.getItem('tracksphere_data');
    if (raw) {
        try {
            const data = JSON.parse(raw);
            habits = data.habits || [];
            // 👇 النقاط تتحسب من العادات
            points = calculatePointsFromHabits();
            achievements = data.achievements || [];
        } catch (e) {
            console.error('Error loading data:', e);
        }
    }
}