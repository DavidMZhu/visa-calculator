let historyTrips = [];

function handleSubmit() {
    const entry = document.getElementById('entryDate').value;
    const exit = document.getElementById('exitDate').value;

    // 必须填写入境日期
    if (!entry) {
        alert("请填写入境日期");
        return;
    }

    // 验证日期顺序
    if (exit && new Date(exit) < new Date(entry)) {
        alert("离境日期不能早于入境日期");
        return;
    }

    // 保存完整行程记录
    if (entry && exit) {
        historyTrips.push({ entry, exit });
        updateHistoryList();
    }

    // 执行计算
    calculateDates(entry);
    updateRemainingDays(entry);
    clearInputs();
}

function updateHistoryList() {
    const list = document.getElementById('tripList');
    list.innerHTML = historyTrips.map((trip, index) => 
        `<li>#${index + 1} ${trip.entry} 至 ${trip.exit}</li>`
    ).join('');
}

function calculateDates(entryDate) {
    const recommended = new Date(entryDate);
    recommended.setDate(recommended.getDate() + 69);
    
    const deadline = new Date(entryDate);
    deadline.setDate(deadline.getDate() + 89);

    document.getElementById('recommendedDate').textContent = formatDate(recommended);
    document.getElementById('maxDate').textContent = formatDate(deadline);
}

function updateRemainingDays(currentEntry) {
    const remaining = calculateAnnualUsage(historyTrips, currentEntry);
    const displayText = remaining > 0 ? 
        `${remaining} 天 (本年已用 ${180 - remaining} 天)` : 
        '<span style="color:red">已超过180天限制！</span>';
    
    document.getElementById('remainingDays').innerHTML = displayText;
}

function calculateAnnualUsage(history, currentEntry) {
    const currentYear = new Date(currentEntry).getFullYear();
    let usedDays = 0;

    history.forEach(trip => {
        const entry = new Date(trip.entry);
        const exit = new Date(trip.exit);
        
        const yearStart = new Date(currentYear, 0, 1);
        const yearEnd = new Date(currentYear, 11, 31);
        
        const start = entry < yearStart ? yearStart : entry;
        const end = exit > yearEnd ? yearEnd : exit;
        
        if(start <= end) {
            const diff = end.getTime() - start.getTime();
            usedDays += Math.ceil(diff / 86400000) + 1;
        }
    });

    return Math.max(180 - usedDays, 0);
}

function formatDate(date) {
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).replace(/\//g, '-');
}

function clearInputs() {
    document.getElementById('entryDate').value = '';
    document.getElementById('exitDate').value = '';
}

// 初始化
clearInputs();
