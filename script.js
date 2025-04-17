let travelHistory = [];
let currentTrip = null;

function handleSubmission() {
    const entryInput = document.getElementById('currentEntry').value;
    const exitInput = document.getElementById('plannedExit').value;

    if (!entryInput) {
        alert("请输入本次入境日期");
        return;
    }

    // 保存当前行程
    currentTrip = {
        entry: entryInput,
        exit: exitInput || null
    };

    // 保存完整行程到历史
    if (exitInput) {
        if (new Date(exitInput) < new Date(entryInput)) {
            alert("离境日期不能早于入境日期");
            return;
        }
        travelHistory.push({ entry: entryInput, exit: exitInput });
        travelHistory.sort((a, b) => new Date(a.entry) - new Date(b.entry));
    }

    updateDisplay();
    calculateDates();
    clearInputs();
}

function calculateDates() {
    const entryDate = new Date(currentTrip.entry);
    const remainingDays = calculateRemainingDays(entryDate);
    
    // 计算理论最晚离境日
    const maxDaysAvailable = Math.min(90, remainingDays);
    const maxExitDate = new Date(entryDate);
    maxExitDate.setDate(entryDate.getDate() + maxDaysAvailable - 1);
    
    // 计算建议离境日
    const recommendedDays = Math.min(70, remainingDays);
    const recommendedDate = new Date(entryDate);
    recommendedDate.setDate(entryDate.getDate() + recommendedDays - 1);

    document.getElementById('recommendedDate').textContent = formatDate(recommendedDate);
    document.getElementById('maxDate').textContent = formatDate(maxExitDate);
    document.getElementById('remainingDays').textContent = `${remainingDays} 天`;
}

function calculateRemainingDays(currentEntry) {
    const currentYear = new Date(currentEntry).getFullYear();
    let usedDays = 0;

    // 计算历史使用天数
    travelHistory.forEach(trip => {
        const entry = new Date(trip.entry);
        const exit = new Date(trip.exit);
        
        // 仅计算同一年份
        if (entry.getFullYear() === currentYear) {
            const start = entry < new Date(currentYear, 0, 1) ? new Date(currentYear, 0, 1) : entry;
            const end = exit > new Date(currentYear, 11, 31) ? new Date(currentYear, 11, 31) : exit;
            
            if (start <= end) {
                const diff = end.getTime() - start.getTime();
                usedDays += Math.ceil(diff / 86400000) + 1;
            }
        }
    });

    // 计算当前行程可能增加的天数
    const potentialDays = currentTrip.exit ? 
        calculateStayDuration(new Date(currentTrip.entry), new Date(currentTrip.exit)) : 0;

    return Math.max(180 - (usedDays + potentialDays), 0);
}

function calculateStayDuration(startDate, endDate) {
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / 86400000) + 1;
}

function updateDisplay() {
    // 显示当前入境日期
    document.getElementById('displayEntry').textContent = currentTrip.entry;
    
    // 更新历史表格
    const tbody = document.querySelector('#tripTable tbody');
    tbody.innerHTML = travelHistory.map((trip, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${trip.entry}</td>
            <td>${trip.exit}</td>
            <td>${calculateStayDuration(new Date(trip.entry), new Date(trip.exit))} 天</td>
        </tr>
    `).join('');
}

function formatDate(date) {
    return date.toLocaleDateString('zh-CN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
    }).replace(/\//g, '-');
}

function clearInputs() {
    document.getElementById('currentEntry').value = '';
    document.getElementById('plannedExit').value = '';
}

// 初始化
clearInputs();
