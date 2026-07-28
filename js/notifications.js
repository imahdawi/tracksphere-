// ================================================================
//  🔔 NOTIFICATIONS MODULE
// ================================================================

// ====== طلب الإذن ======
function requestNotificationPermission() {
    if (!('Notification' in window)) {
        console.log('🔔 هذا المتصفح لا يدعم الإشعارات');
        return;
    }

    if (Notification.permission === 'granted') {
        console.log('🔔 الإشعارات مصرح بها');
        return;
    }

    if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(function(permission) {
            if (permission === 'granted') {
                console.log('🔔 تم السماح بالإشعارات');
                showToast('✅ تم تفعيل الإشعارات!', 'success');
            } else {
                console.log('🔔 تم رفض الإشعارات');
            }
        });
    }
}

// ====== إرسال إشعار ======
function sendNotification(title, body, icon) {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    try {
        var notification = new Notification(title, {
            body: body,
            icon: icon || '/assets/icon-192.png',
            vibrate: [200, 100, 200],
            requireInteraction: true
        });

        notification.onclick = function() {
            window.focus();
            notification.close();
        };

        setTimeout(function() {
            notification.close();
        }, 10000);

        console.log('🔔 إشعار مرسل:', title);
    } catch (e) {
        console.error('🔔 خطأ في الإشعار:', e);
    }
}

// ====== إشعار الصباح ======
function sendMorningNotification() {
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

    var message = '';
    if (total === 0) {
        message = '🌅 صباح الخير! أضف عادة جديدة اليوم وابدأ رحلتك!';
    } else if (completedToday === total) {
        message = '🎉 مبروك! أنهيت كل عاداتك اليوم! استمر بهذا الزخم!';
    } else {
        var remaining = total - completedToday;
        message = '💪 صباح النشاط! لديك ' + remaining + ' عادة متبقية اليوم. ابدأ الآن!';
    }

    sendNotification('🌅 TrackSphere - صباح الخير!', message);
}

// ====== إشعار المساء ======
function sendEveningNotification() {
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
    var message = '';

    if (total === 0) {
        message = '🌙 مساء الخير! خصص وقتاً لإضافة عاداتك الجديدة غداً.';
    } else if (rate === 100) {
        message = '🌟 يوم مثالي! أنت رائع! استمر في تحقيق أهدافك!';
    } else if (rate >= 50) {
        message = '💪 أداء جيد اليوم! أنت في الطريق الصحيح!';
    } else {
        message = '🌙 يوم غد فرصة جديدة! حاول تحسين أدائك غداً.';
    }

    sendNotification('🌙 TrackSphere - مساء الخير!', message);
}

// ====== إشعار كسر السلسلة ======
function checkStreakNotification() {
    var today = new Date().toDateString();
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var yesterdayStr = yesterday.toDateString();

    for (var i = 0; i < habits.length; i++) {
        var habit = habits[i];
        var didToday = habit.history.indexOf(today) !== -1;
        var didYesterday = habit.history.indexOf(yesterdayStr) !== -1;

        // لو كان عنده سلسلة وأمس اشتغل لكن النهاردة لأ
        if (habit.streak > 0 && !didToday && didYesterday) {
            sendNotification(
                '⚠️ تنبيه: ' + habit.name,
                'سلسلتك لـ "' + habit.name + '" انقطعت بعد ' + habit.streak + ' يوم! ابدأ من جديد اليوم 💪'
            );
            return;
        }
    }
}

// ====== إشعار إنجاز جديد ======
function sendAchievementNotification(achievementName) {
    sendNotification('🏆 إنجاز جديد!', 'لقد حققت: ' + achievementName + ' 🎉');
}

// ====== جدولة الإشعارات ======
function scheduleNotifications() {
    // الصباح: 9 صباحاً
    var morningTime = new Date();
    morningTime.setHours(9, 0, 0, 0);

    // المساء: 9 مساءً
    var eveningTime = new Date();
    eveningTime.setHours(21, 0, 0, 0);

    // حساب الفرق
    var now = new Date();
    var morningDiff = morningTime - now;
    var eveningDiff = eveningTime - now;

    if (morningDiff < 0) {
        morningDiff += 86400000; // 24 ساعة
    }
    if (eveningDiff < 0) {
        eveningDiff += 86400000;
    }

    // جدولة إشعار الصباح
    setTimeout(function() {
        sendMorningNotification();
        // كرر كل 24 ساعة
        setInterval(sendMorningNotification, 86400000);
    }, morningDiff);

    // جدولة إشعار المساء
    setTimeout(function() {
        sendEveningNotification();
        setInterval(sendEveningNotification, 86400000);
    }, eveningDiff);

    // فحص السلسلة كل ساعة
    setInterval(checkStreakNotification, 3600000);

    console.log('🔔 تم جدولة الإشعارات');
}

// ====== تفعيل الإشعارات ======
function enableNotifications() {
    requestNotificationPermission();

    if (Notification.permission === 'granted') {
        scheduleNotifications();
        showToast('🔔 تم تفعيل الإشعارات اليومية!', 'success');
        localStorage.setItem('notifications_enabled', 'true');
    } else {
        showToast('⚠️ يرجى السماح بالإشعارات من إعدادات المتصفح', 'warning');
    }
}

// ====== تعطيل الإشعارات ======
function disableNotifications() {
    localStorage.setItem('notifications_enabled', 'false');
    showToast('🔕 تم تعطيل الإشعارات', 'info');
}

// ====== التحقق من حالة الإشعارات ======
function isNotificationsEnabled() {
    return localStorage.getItem('notifications_enabled') === 'true';
}

// ====== التهيئة ======
document.addEventListener('DOMContentLoaded', function() {
    if (isNotificationsEnabled()) {
        requestNotificationPermission();
        if (Notification.permission === 'granted') {
            scheduleNotifications();
        }
    }
});

console.log('🔔 Notifications module loaded!');