let trips = [];

function addTrip() {
    const entry = document.getElementById('entryDate').value;
    const exit = document.getElementById('exitDate').value;
    
    // 输入验证
    if (!entry || !exit) {
        alert("请填写完整日期");
        return;
    }
    
    const entryDate = new Date(entry);
    const exitDate = new Date(exit);
    
    if (exitDate < entryDate) {
        alert("离境日期不能早于入境日期");
        return;
    }

    // 添加行程记录
    trips.push({ 
        entry: entry,
        exit: exit
    });
    
    // 清空输入框
    document.getElementById('entryDate').value = '';
    document.getElementById('exitDate').value = '';
    
    updateHistoryList();
    calculate();
}

function updateHistoryList() {
    const list = document.getElementById('tripList');
    list.innerHTML = trips.map((trip, index) => 
        `<li>#${index + 1} ${trip.entry} 至 ${trip.exit}</li>`
    ).join('');
}

function calculate() {
    const currentEntry = trips.length > 0 ? trips[trips.length - 1].entry : null;
    
    if (!currentEntry) {
        document.getElementById('maxDate').textContent = '-';
        document.getElementById('remainingDays').textContent = '-';
        return;
    }

    // 计算最晚离境日
    const maxExitDate = calculateMaxStay(currentEntry);
    
    // 计算剩余天数
    const remainingDays = calculateAnnualUsage(trips, currentEntry);
    
    // 更新显示
    document.getElementById('maxDate').textContent = maxExitDate;
    document.getElementById('remainingDays').textContent = remainingDays > 0 ? 
        `${remainingDays} 天` : 
        '<span style="color:red">已超限！</span>';
}

// 核心计算函数
function calculateMaxStay(entryDate) {
    const date = new Date(entryDate);
    date.setDate(date.getDate() + 89);
    return formatDate(date);
}

function calculateAnnualUsage(history, currentEntry) {
    const currentYear = new Date(currentEntry).getFullYear();
    let usedDays = 0;

    history.forEach(trip => {
        const entry = new Date(trip.entry);
        const exit = new Date(trip.exit);
        
        // 计算在当前年的有效停留
        const yearStart = new Date(currentYear, 0, 1);
        const yearEnd = new Date(currentYear, 11, 31);
        
        const start = entry < yearStart ? yearStart : entry;
        const end = exit > yearEnd ? yearEnd : exit;
        
        if (start <= end) {
            const timeDiff = end.getTime() - start.getTime();
            const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
            usedDays += days;
        }
    });

    const remaining = 180 - usedDays;
    return remaining >= 0 ? remaining : 0;
}

// 辅助函数：格式化日期为YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 初始化时清空输入
document.getElementById('entryDate').value = '';
document.getElementById('exitDate').value = '';
