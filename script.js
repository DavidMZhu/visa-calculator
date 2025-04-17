let trips = [];

function addTrip() {
    const entry = document.getElementById('entryDate').value;
    const exit = document.getElementById('exitDate').value;
    
    // 必须填写入境日期
    if (!entry) {
        alert("请至少填写入境日期");
        return;
    }

    // 如果有填写离境日期
    if (exit) {
        const entryDate = new Date(entry);
        const exitDate = new Date(exit);
        
        if (exitDate < entryDate) {
            alert("离境日期不能早于入境日期");
            return;
        }

        trips.push({ entry, exit });
        updateHistoryList();
    }

    calculate(entry);
    clearInputs();
}

function updateHistoryList() {
    const list = document.getElementById('tripList');
    list.innerHTML = trips.map((trip, index) => 
        `<li>#${index + 1} ${trip.entry} 至 ${trip.exit}</li>`
    ).join('');
}

function calculate(currentEntry) {
    // 计算建议和最晚日期
    const recommendedDate = calculateRecommendedStay(currentEntry);
    const maxExitDate = calculateMaxStay(currentEntry);
    
    // 更新基础信息
    document.getElementById('recommendedDate').textContent = recommendedDate;
    document.getElementById('maxDate').textContent = maxExitDate;
    
    // 仅当有历史记录时计算剩余天数
    if (trips.length > 0) {
        const remainingDays = calculateAnnualUsage(trips, currentEntry);
        document.getElementById('remainingDays').textContent = 
            remainingDays > 0 ? `${remainingDays} 天` : '<span style="color:red">已超限！</span>';
    } else {
        document.getElementById('remainingDays').textContent = "请添加历史行程";
    }
}

// 新增建议日期计算
function calculateRecommendedStay(entryDate) {
    const date = new Date(entryDate);
    date.setDate(date.getDate() + 69);
    return formatDate(date);
}

function calculateMaxStay(entryDate) {
    const date = new Date(entryDate);
    date.setDate(date.getDate() + 89);
    return formatDate(date);
}

// 保持原有calculateAnnualUsage函数不变
function calculateAnnualUsage(history, currentEntry) {
    // ... 保持原有实现不变 ...
}

function formatDate(date) {
    // ... 保持原有实现不变 ...
}

function clearInputs() {
    document.getElementById('entryDate').value = '';
    document.getElementById('exitDate').value = '';
}

// 初始化
clearInputs();
