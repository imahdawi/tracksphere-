// ================================================================
//  📊 CHART MODULE - النسخة النهائية
// ================================================================

var chartInstance = null;
var currentFilter = 'weekly';
var currentOffset = 0;
var chartInitialized = false;

// ================================================================
//  🛠️ SAFE TRANSLATION
// ================================================================

function safeTranslate(key) {
    try {
        if (typeof t === 'function') {
            return t(key);
        }
    } catch (e) {}

    var fallbacks = {
        'chart_completed': 'Completed',
        'chart_week': 'Week',
        'day_sunday': 'Sunday',
        'day_monday': 'Monday',
        'day_tuesday': 'Tuesday',
        'day_wednesday': 'Wednesday',
        'day_thursday': 'Thursday',
        'day_friday': 'Friday',
        'day_saturday': 'Saturday',
        'day_today': '(Today)',
        'month_january': 'January',
        'month_february': 'February',
        'month_march': 'March',
        'month_april': 'April',
        'month_may': 'May',
        'month_june': 'June',
        'month_july': 'July',
        'month_august': 'August',
        'month_september': 'September',
        'month_october': 'October',
        'month_november': 'November',
        'month_december': 'December'
    };
    return fallbacks[key] || key;
}

// ================================================================
//  📅 GET DAY NAMES
// ================================================================

function getDayNames() {
    return [
        safeTranslate('day_sunday'),
        safeTranslate('day_monday'),
        safeTranslate('day_tuesday'),
        safeTranslate('day_wednesday'),
        safeTranslate('day_thursday'),
        safeTranslate('day_friday'),
        safeTranslate('day_saturday')
    ];
}

// ================================================================
//  📅 GET MONTH NAMES
// ================================================================

function getMonthNames() {
    return [
        safeTranslate('month_january'),
        safeTranslate('month_february'),
        safeTranslate('month_march'),
        safeTranslate('month_april'),
        safeTranslate('month_may'),
        safeTranslate('month_june'),
        safeTranslate('month_july'),
        safeTranslate('month_august'),
        safeTranslate('month_september'),
        safeTranslate('month_october'),
        safeTranslate('month_november'),
        safeTranslate('month_december')
    ];
}

// ================================================================
//  🎨 GET TEXT COLOR
// ================================================================

function getTextColor() {
    try {
        var color = getComputedStyle(document.body).getPropertyValue('--text-secondary');
        return color.trim() || '#A0A0C0';
    } catch (e) {
        return '#A0A0C0';
    }
}

// ================================================================
//  📊 INIT CHART - ⭐ الإصلاح النهائي
// ================================================================

function initChart() {
    var canvas = document.getElementById('weekly-chart');
    if (!canvas) {
        console.error('📊 Canvas not found!');
        setTimeout(function() {
            if (!chartInitialized) {
                console.log('📊 Retrying initChart...');
                initChart();
            }
        }, 500);
        return;
    }

    // ⭐ مهم: إذا كان chartInstance موجود، امسحه أولاً
    if (chartInstance) {
        try {
            chartInstance.destroy();
        } catch (e) {
            console.warn('📊 Could not destroy chart:', e);
        }
        chartInstance = null;
        chartInitialized = false;
    }

    try {
        var data = getChartData();

        chartInstance = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: safeTranslate('chart_completed'),
                    data: data.values,
                    backgroundColor: 'rgba(108, 99, 255, 0.6)',
                    borderColor: '#6C63FF',
                    borderWidth: 2,
                    borderRadius: 8,
                    hoverBackgroundColor: 'rgba(108, 99, 255, 0.8)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        labels: {
                            color: getTextColor(),
                            font: { size: 12 }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: getTextColor(),
                            stepSize: 1
                        },
                        grid: {
                            color: 'rgba(108, 99, 255, 0.05)'
                        }
                    },
                    x: {
                        ticks: {
                            color: getTextColor(),
                            maxRotation: 45
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });

        chartInitialized = true;
        updateChartInfo(data.range);
        updateNavButtons();
        console.log('📊 Chart initialized successfully!');
    } catch (error) {
        console.error('📊 Init error:', error);
        chartInstance = null;
        chartInitialized = false;
        setTimeout(function() {
            initChart();
        }, 500);
    }
}

// ================================================================
//  📊 GET CHART DATA
// ================================================================

function getChartData() {
    if (currentFilter === 'weekly') {
        return getWeekData(currentOffset);
    } else {
        return getMonthData(currentOffset);
    }
}

// ================================================================
//  📅 GET WEEK DATA
// ================================================================

function getWeekData(offset) {
    if (offset === undefined) offset = 0;

    var today = new Date();
    var currentDay = today.getDay();

    var startDate = new Date(today);
    startDate.setDate(today.getDate() - currentDay + (offset * 7));

    var endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    var dayNames = getDayNames();
    var todayLabel = safeTranslate('day_today');
    var days = [];

    for (var i = 0; i < 7; i++) {
        var date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        var dateStr = date.toDateString();

        var count = 0;
        if (habits && Array.isArray(habits)) {
            for (var j = 0; j < habits.length; j++) {
                if (habits[j].history && habits[j].history.indexOf(dateStr) !== -1) {
                    count++;
                }
            }
        }

        var isToday = dateStr === today.toDateString();
        var label = isToday ? dayNames[i] + ' ' + todayLabel : dayNames[i];

        days.push({
            label: label,
            date: dateStr,
            count: count,
            isToday: isToday
        });
    }

    var monthNames = getMonthNames();
    var startMonth = monthNames[startDate.getMonth()];
    var endMonth = monthNames[endDate.getMonth()];
    var weekLabel = safeTranslate('chart_week');

    var range = weekLabel + ': ' + startDate.getDate() + ' ' + startMonth + ' - ' + endDate.getDate() + ' ' + endMonth + ' ' + endDate.getFullYear();

    return {
        labels: days.map(function(d) { return d.label; }),
        values: days.map(function(d) { return d.count; }),
        range: range
    };
}

// ================================================================
//  📅 GET MONTH DATA
// ================================================================

function getMonthData(offset) {
    if (offset === undefined) offset = 0;

    var today = new Date();
    var targetMonth = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    var year = targetMonth.getFullYear();
    var month = targetMonth.getMonth();
    var daysInMonth = new Date(year, month + 1, 0).getDate();

    var monthNames = getMonthNames();
    var monthName = monthNames[month];
    var monthLabel = monthName + ' ' + year;

    var dayNames = getDayNames();
    var todayLabel = safeTranslate('day_today');
    var days = [];

    for (var day = 1; day <= daysInMonth; day++) {
        var date = new Date(year, month, day);
        var dateStr = date.toDateString();

        var count = 0;
        if (habits && Array.isArray(habits)) {
            for (var j = 0; j < habits.length; j++) {
                if (habits[j].history && habits[j].history.indexOf(dateStr) !== -1) {
                    count++;
                }
            }
        }

        var isToday = dateStr === today.toDateString();
        var dayName = dayNames[date.getDay()];

        days.push({
            label: isToday ? day + ' ' + todayLabel : day,
            date: dateStr,
            count: count,
            isToday: isToday,
            dayName: dayName
        });
    }

    var labels = [];
    var values = [];
    var groupSize = daysInMonth > 25 ? 3 : 1;

    if (groupSize > 1) {
        for (var i = 0; i < days.length; i += groupSize) {
            var group = days.slice(i, Math.min(i + groupSize, days.length));
            var total = 0;
            for (var k = 0; k < group.length; k++) {
                total += group[k].count;
            }
            var first = group[0];
            var last = group[group.length - 1];

            var label = String(first.label);
            if (group.length > 1 && first.label !== last.label) {
                label = first.label + '-' + last.label;
            }
            if (first.dayName) {
                label = label + ' (' + first.dayName.substring(0, 3) + ')';
            }
            labels.push(label);
            values.push(total);
        }
    } else {
        for (var i = 0; i < days.length; i++) {
            labels.push(days[i].label + ' (' + days[i].dayName.substring(0, 3) + ')');
            values.push(days[i].count);
        }
    }

    return {
        labels: labels,
        values: values,
        range: monthLabel
    };
}

// ================================================================
//  🔄 UPDATE CHART
// ================================================================

function updateChart() {
    if (!chartInstance) {
        console.log('📊 No chart instance, initializing...');
        initChart();
        return;
    }

    try {
        var data = getChartData();
        chartInstance.data.labels = data.labels;
        chartInstance.data.datasets[0].data = data.values;
        chartInstance.update();
        updateChartInfo(data.range);
        updateNavButtons();
        console.log('📊 Chart updated!');
    } catch (error) {
        console.error('📊 Update error:', error);
        chartInstance = null;
        initChart();
    }
}

// ================================================================
//  📝 UPDATE CHART INFO
// ================================================================

function updateChartInfo(range) {
    var el = document.getElementById('chart-range-info');
    if (el && range) {
        el.textContent = range;
    }
}

// ================================================================
//  ⬅️➡️ NAVIGATE CHART
// ================================================================

function navigateChart(direction) {
    console.log('📊 Navigate:', direction, 'currentOffset:', currentOffset);
    currentOffset += direction;
    updateChart();
}

// ================================================================
//  🔄 RESET TO TODAY
// ================================================================

function resetChartToToday() {
    console.log('📊 Reset to today');
    currentOffset = 0;
    updateChart();
}

// ================================================================
//  🔄 SWITCH FILTER
// ================================================================

function switchChartFilter(filter) {
    console.log('📊 Switch filter to:', filter);

    currentFilter = filter;
    currentOffset = 0;

    var btns = document.querySelectorAll('.chart-filter-btn');
    for (var i = 0; i < btns.length; i++) {
        btns[i].classList.remove('active');
        if (btns[i].dataset.filter === filter) {
            btns[i].classList.add('active');
        }
    }

    if (!chartInstance) {
        initChart();
        return;
    }

    updateChart();
}

// ================================================================
//  🔘 UPDATE NAV BUTTONS
// ================================================================

function updateNavButtons() {
    var todayBtn = document.querySelector('.chart-nav-today');
    if (todayBtn) {
        todayBtn.style.display = currentOffset === 0 ? 'none' : 'inline-flex';
    }
}

// ================================================================
//  💾 EXPORT CHART
// ================================================================

function exportChartAsImage() {
    var canvas = document.getElementById('weekly-chart');
    if (!canvas) {
        if (typeof showToast === 'function') {
            showToast('⚠️ الرسم البياني غير موجود', 'error');
        }
        return;
    }

    try {
        var link = document.createElement('a');
        var date = new Date().toISOString().split('T')[0];
        link.download = 'tracksphere_chart_' + date + '.png';
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        if (typeof showToast === 'function') {
            showToast('📸 تم تصدير الرسم البياني', 'success');
        }
    } catch (e) {
        console.error('📊 Export error:', e);
        if (typeof showToast === 'function') {
            showToast('⚠️ حدث خطأ في التصدير', 'error');
        }
    }
}

// ================================================================
//  🔄 RESET CHART STATE
// ================================================================

function resetChartState() {
    if (chartInstance) {
        try {
            chartInstance.destroy();
        } catch (e) {}
        chartInstance = null;
    }
    chartInitialized = false;
    console.log('📊 Chart state reset');
}

// ================================================================
//  🌐 EXPOSE GLOBALS
// ================================================================

window.initChart = initChart;
window.updateChart = updateChart;
window.navigateChart = navigateChart;
window.resetChartToToday = resetChartToToday;
window.switchChartFilter = switchChartFilter;
window.exportChartAsImage = exportChartAsImage;
window.resetChartState = resetChartState;

console.log('📊 Charts module loaded!');