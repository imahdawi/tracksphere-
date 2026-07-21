// ====== CHART ======
let chartInstance = null;
let currentFilter = 'weekly';
let currentOffset = 0;
let chartInitialized = false;

// ====== INIT CHART ======
function initChart() {
    console.log('📊 initChart called, chartInitialized:', chartInitialized);
    
    // منع التكرار
    if (chartInitialized) {
        console.log('📊 Chart already initialized, skipping...');
        return;
    }
    
    const ctx = document.getElementById('weekly-chart');
    if (!ctx) {
        console.error('📊 Canvas element not found!');
        return;
    }
    
    const data = getChartData();
    
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'العادات المنجزة',
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
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y} عادة مكتملة`;
                        },
                        title: function(context) {
                            if (currentFilter === 'weekly') {
                                return context[0].label;
                            } else {
                                const day = context[0].label.split(' ')[0];
                                return `اليوم ${day}`;
                            }
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { 
                        color: getTextColor(),
                        stepSize: 1,
                        font: { size: 11 }
                    },
                    grid: {
                        color: 'rgba(108, 99, 255, 0.05)'
                    }
                },
                x: {
                    ticks: { 
                        color: getTextColor(),
                        font: { size: 11 },
                        maxRotation: 0
                    },
                    grid: {
                        display: false
                    }
                }
            },
            animation: {
                duration: 500,
                easing: 'easeInOutQuart'
            }
        }
    });
    
    chartInitialized = true;
    updateChartInfo(data.range);
    updateNavButtons();
    console.log('📊 Chart initialized successfully!');
}

// ====== GET CHART DATA ======
function getChartData() {
    if (currentFilter === 'weekly') {
        return getWeekData(currentOffset);
    } else {
        return getMonthData(currentOffset);
    }
}

// ====== GET WEEK DATA ======
function getWeekData(offset = 0) {
    const days = [];
    const today = new Date();
    const currentDay = today.getDay();
    
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - currentDay + (offset * 7));
    
    const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const weekRange = getWeekRange(startDate);
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dateStr = date.toDateString();
        
        let count = 0;
        habits.forEach(habit => {
            if (habit.history.includes(dateStr)) count++;
        });
        
        const isToday = dateStr === today.toDateString();
        days.push({
            label: dayNames[i],
            date: dateStr,
            count: count,
            isToday: isToday,
            fullDate: date
        });
    }
    
    return {
        labels: days.map(d => d.isToday ? `${d.label} (اليوم)` : d.label),
        values: days.map(d => d.count),
        range: weekRange,
        days: days
    };
}

// ====== GET MONTH DATA ======
function getMonthData(offset = 0) {
    const today = new Date();
    const targetMonth = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    const year = targetMonth.getFullYear();
    const month = targetMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthName = targetMonth.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' });
    
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateStr = date.toDateString();
        
        let count = 0;
        habits.forEach(habit => {
            if (habit.history.includes(dateStr)) count++;
        });
        
        const isToday = dateStr === today.toDateString();
        const dayName = date.toLocaleDateString('ar-EG', { weekday: 'short' });
        
        days.push({
            label: day,
            date: dateStr,
            count: count,
            isToday: isToday,
            dayName: dayName,
            fullDate: date
        });
    }
    
    let labels = [];
    let values = [];
    
    if (daysInMonth > 20) {
        for (let i = 0; i < days.length; i += 3) {
            const group = days.slice(i, i + 3);
            const total = group.reduce((sum, d) => sum + d.count, 0);
            const label = `${group[0].label}-${group[group.length-1].label} (${group[0].dayName})`;
            labels.push(label);
            values.push(total);
        }
    } else {
        labels = days.map(d => `${d.label} (${d.dayName})`);
        values = days.map(d => d.count);
    }
    
    return {
        labels: labels,
        values: values,
        range: monthName,
        days: days
    };
}

// ====== GET WEEK RANGE ======
function getWeekRange(startDate) {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    const start = startDate.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' });
    const end = endDate.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', year: 'numeric' });
    
    return `${start} - ${end}`;
}

// ====== UPDATE CHART ======
function updateChart() {
    if (!chartInstance) {
        console.log('📊 Chart instance not found, calling initChart...');
        initChart();
        return;
    }
    
    const data = getChartData();
    
    chartInstance.data.labels = data.labels;
    chartInstance.data.datasets[0].data = data.values;
    chartInstance.update();
    
    updateChartInfo(data.range);
}

// ====== UPDATE CHART INFO ======
function updateChartInfo(range = null) {
    const infoEl = document.getElementById('chart-range-info');
    if (!infoEl) return;
    
    if (!range) {
        const data = getChartData();
        range = data.range;
    }
    
    const prefix = currentFilter === 'weekly' ? '📅 الأسبوع' : '📆 الشهر';
    infoEl.textContent = `${prefix}: ${range}`;
}

// ====== NAVIGATION ======
function navigateChart(direction) {
    currentOffset += direction;
    updateChart();
}

// ====== RESET TO TODAY ======
function resetChartToToday() {
    currentOffset = 0;
    updateChart();
}

// ====== SWITCH FILTER ======
function switchChartFilter(filter) {
    currentFilter = filter;
    currentOffset = 0;
    updateChart();
    
    document.querySelectorAll('.chart-filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });
    
    updateNavButtons();
}

// ====== UPDATE NAV BUTTONS ======
function updateNavButtons() {
    const todayBtn = document.querySelector('.chart-nav-today');
    if (todayBtn) {
        todayBtn.style.display = currentOffset === 0 ? 'none' : 'inline-flex';
    }
}

// ====== GET TEXT COLOR ======
function getTextColor() {
    return getComputedStyle(document.body).getPropertyValue('--text-secondary') || '#A0A0C0';
}

// ====== EXPORT CHART ======
function exportChartAsImage() {
    const canvas = document.getElementById('weekly-chart');
    if (!canvas) {
        showToast('⚠️ الرسم البياني غير موجود', 'error');
        return;
    }
    const link = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    link.download = `tracksphere_chart_${date}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('📸 تم تصدير الرسم البياني', 'success');
}

// ====== RESET CHART STATE (للـ Refresh) ======
function resetChartState() {
    chartInitialized = false;
    chartInstance = null;
}

console.log('📊 Charts module loaded');