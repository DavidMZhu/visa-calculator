let trips = [];

function addTrip() {
    const entry = document.getElementById('entryDate').value;
    const exit = document.getElementById('exitDate').value;
    
    if (!entry || !exit) {
        alert("请填写完整日期");
        return;
    }

    trips.push({ entry, exit });
    calculate();
}

function calculate() {
    // 获取本次入境日期（这里需要根据你的实际输入调整）
    const currentEntry = document.getElementById('entryDate').value;
    
    // 计算单次停留
    const maxExit = calculateMaxStay(currentEntry);
    
    // 计算年度剩余天数（示例使用当前输入作为历史记录）
    const remaining = calculateAnnualUsage(trips, currentEntry);
    
    // 更新显示
    document.getElementById('maxDate').textContent = maxExit;
    document.getElementById('remainingDays').textContent = remaining;
}

// 核心算法实现
function calculateMaxStay(entryDate) {
    const date = new Date(entryDate);
    date.setDate(date.getDate() + 89); // 包含出入境当天
    return formatDate(date);
}

function calculateAnnualUsage(history, currentEntry) {
    const currentYear = new Date(currentEntry).getFullYear();
    let usedDays = 0;

    // 添加本次行程（临时计算用）
    const tempHistory = [...history, {
        entry: currentEntry,
        exit: document.getElementById('exitDate').value
    }];

    tempHistory.forEach(trip => {
        const entry = new Date(trip.entry);
        const exit = new Date(trip.exit);
        
        // 计算在当前年的有效停留
        const yearStart = new Date(currentYear, 0, 1);
        const yearEnd = new Date(currentYear, 11, 31);
        
        const start = entry < yearStart ? yearStart : entry;
        const end = exit > yearEnd ? yearEnd : exit;
        
        if(start <= end) {
            const diff = end.getTime() - start.getTime();
            usedDays += Math.ceil(diff / (86400000)) + 1; // +1包含首日
        }
    });

    return 180 - usedDays;
}

// 日期格式化辅助函数
function formatDate(date) {
    return date.toISOString().split('T')[0];
}
