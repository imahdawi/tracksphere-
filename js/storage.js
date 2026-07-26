// ================================================================
//  💾 STORAGE MODULE
// ================================================================

// ====== SAVE DATA ======
function saveData() {
    try {
        var data = {
            habits: habits,
            achievements: achievements,
            savedAt: new Date().toISOString()
        };
        localStorage.setItem('tracksphere_data', JSON.stringify(data));
    } catch (e) {
        console.error('💾 Save error:', e);
    }
}

// ====== LOAD DATA ======
function loadData() {
    try {
        var raw = localStorage.getItem('tracksphere_data');
        if (raw) {
            var data = JSON.parse(raw);
            habits = data.habits || [];

            // ✅ تحويل التصنيفات القديمة
            if (typeof migrateCategoryKeys === 'function') {
                habits = migrateCategoryKeys(habits);
            }

            achievements = data.achievements || [];
            points = calculatePointsFromHabits();

            console.log('💾 Data loaded:', habits.length, 'habits');
        } else {
            console.log('💾 No saved data found');
        }
    } catch (e) {
        console.error('💾 Load error:', e);
        habits = [];
        achievements = [];
        points = 0;
    }
}

// ====== EXPORT DATA ======
function exportData() {
    try {
        var data = {
            habits: habits,
            achievements: achievements,
            exportedAt: new Date().toISOString(),
            version: '1.0.0'
        };

        var json = JSON.stringify(data, null, 2);
        var blob = new Blob([json], { type: 'application/json' });
        var url = URL.createObjectURL(blob);

        var a = document.createElement('a');
        a.href = url;
        a.download = 'tracksphere_backup_' + new Date().toISOString().split('T')[0] + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast('📦 تم تصدير البيانات بنجاح', 'success');
    } catch (e) {
        console.error('💾 Export error:', e);
        showToast('⚠️ فشل تصدير البيانات', 'error');
    }
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

            // تحويل التصنيفات
            if (typeof migrateCategoryKeys === 'function') {
                habits = migrateCategoryKeys(habits);
            }

            achievements = data.achievements || [];
            points = calculatePointsFromHabits();

            saveData();

            if (typeof renderHabits === 'function') renderHabits();
            if (typeof updateStats === 'function') updateStats();
            if (typeof updateAchievements === 'function') updateAchievements();
            if (typeof updateChart === 'function') updateChart();

            showToast('✅ تم استيراد البيانات بنجاح', 'success');
        } catch (err) {
            console.error('💾 Import error:', err);
            showToast('⚠️ خطأ في قراءة الملف', 'error');
        }
    };
    reader.readAsText(file);
}

// ====== CLEAR ALL DATA ======
function clearAllData() {
    if (!confirm('⚠️ هذا سيحذف جميع البيانات نهائياً! هل أنت متأكد؟')) return;
    if (!confirm('⚠️ هل أنت متأكد مرة أخرى؟')) return;

    localStorage.removeItem('tracksphere_data');
    habits = [];
    achievements = [];
    points = 0;

    if (typeof renderHabits === 'function') renderHabits();
    if (typeof updateStats === 'function') updateStats();
    if (typeof updateAchievements === 'function') updateAchievements();
    if (typeof updateChart === 'function') updateChart();

    showToast('🗑️ تم حذف جميع البيانات', 'info');
}

console.log('💾 Storage module loaded!');