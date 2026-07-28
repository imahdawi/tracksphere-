// ================================================================
//  💾 BACKUP MODULE
// ================================================================

// ====== تصدير البيانات ======
function exportBackup() {
    try {
        var data = {
            habits: habits,
            achievements: achievements,
            points: points,
            exportedAt: new Date().toISOString(),
            version: '1.0.0',
            appName: 'TrackSphere'
        };

        var json = JSON.stringify(data, null, 2);
        var blob = new Blob([json], { type: 'application/json' });
        var url = URL.createObjectURL(blob);

        var link = document.createElement('a');
        link.href = url;
        link.download = 'tracksphere_backup_' + new Date().toISOString().split('T')[0] + '.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showToast('📦 تم تصدير البيانات بنجاح!', 'success');
        return true;
    } catch (e) {
        console.error('💾 Export error:', e);
        showToast('⚠️ فشل تصدير البيانات', 'error');
        return false;
    }
}

// ====== استيراد البيانات ======
function importBackup(file) {
    if (!file) {
        showToast('⚠️ يرجى اختيار ملف', 'warning');
        return;
    }

    var reader = new FileReader();
    reader.onload = function(e) {
        try {
            var data = JSON.parse(e.target.result);

            // التحقق من صحة الملف
            if (!data.habits || !Array.isArray(data.habits)) {
                showToast('⚠️ ملف غير صالح! تأكد من اختيار ملف النسخ الاحتياطي الصحيح.', 'error');
                return;
            }

            // تأكيد المستخدم
            if (!confirm('⚠️ سيتم استبدال جميع البيانات الحالية بالبيانات المستوردة. هل أنت متأكد؟')) {
                return;
            }

            // استيراد البيانات
            habits = data.habits || [];

            // تحويل التصنيفات القديمة
            if (typeof migrateCategoryKeys === 'function') {
                habits = migrateCategoryKeys(habits);
            }

            achievements = data.achievements || [];
            points = data.points || 0;

            // حفظ واستعادة الواجهة
            saveData();
            if (typeof renderHabits === 'function') renderHabits();
            if (typeof updateStats === 'function') updateStats();
            if (typeof updateAchievements === 'function') updateAchievements();
            if (typeof updateChart === 'function') updateChart();

            showToast('✅ تم استيراد البيانات بنجاح!', 'success');

        } catch (err) {
            console.error('💾 Import error:', err);
            showToast('⚠️ خطأ في قراءة الملف. تأكد من أنه ملف JSON صالح.', 'error');
        }
    };
    reader.readAsText(file);
}

// ====== إنشاء عنصر تحميل ملف ======
function createFileInput() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.style.display = 'none';
    input.onchange = function(e) {
        if (e.target.files && e.target.files[0]) {
            importBackup(e.target.files[0]);
        }
        document.body.removeChild(input);
    };
    document.body.appendChild(input);
    return input;
}

// ====== استيراد من زر ======
function importFromButton() {
    var input = createFileInput();
    input.click();
}

// ====== تصدير تلقائي ======
function autoBackup() {
    try {
        var data = {
            habits: habits,
            achievements: achievements,
            points: points,
            exportedAt: new Date().toISOString(),
            version: '1.0.0'
        };

        localStorage.setItem('tracksphere_auto_backup', JSON.stringify(data));
        console.log('💾 Auto backup saved');
    } catch (e) {
        console.error('💾 Auto backup failed:', e);
    }
}

// ====== استعادة تلقائية ======
function restoreAutoBackup() {
    try {
        var raw = localStorage.getItem('tracksphere_auto_backup');
        if (!raw) return false;

        var data = JSON.parse(raw);

        // التحقق من أن البيانات حديثة (أقل من 7 أيام)
        var backupDate = new Date(data.exportedAt);
        var now = new Date();
        var daysDiff = (now - backupDate) / (1000 * 60 * 60 * 24);

        if (daysDiff > 7) {
            console.log('💾 Auto backup is too old, skipping');
            return false;
        }

        // لو مفيش بيانات حالية، استخدم النسخة الاحتياطية
        if (habits.length === 0 && data.habits && data.habits.length > 0) {
            habits = data.habits || [];
            achievements = data.achievements || [];
            points = data.points || 0;

            if (typeof migrateCategoryKeys === 'function') {
                habits = migrateCategoryKeys(habits);
            }

            saveData();
            if (typeof renderHabits === 'function') renderHabits();
            if (typeof updateStats === 'function') updateStats();
            if (typeof updateAchievements === 'function') updateAchievements();
            if (typeof updateChart === 'function') updateChart();

            console.log('💾 Auto backup restored');
            return true;
        }

        return false;
    } catch (e) {
        console.error('💾 Restore auto backup failed:', e);
        return false;
    }
}

// ====== حفظ تلقائي كل 5 دقائق ======
setInterval(autoBackup, 300000);

// ====== التهيئة ======
document.addEventListener('DOMContentLoaded', function() {
    // استعادة النسخة الاحتياطية التلقائية إذا كانت البيانات فارغة
    if (habits.length === 0) {
        restoreAutoBackup();
    }
});

console.log('💾 Backup module loaded!');