// 数据存储
let travelHistory = []; // 包含完整出入境记录
let currentTrip = null; // 当前有效行程（可能未填写离境日期）

// 主处理函数
function handleSubmission() {
    const entryInput = document.getElementById('currentEntry').value;
    const exitInput = document.getElementById('plannedExit').value;

    // 输入验证
    if (!entryInput) {
        alert("请输入本次入境日期");
        return;
    }

    // 更新当前行程（每次提交都强制更新）
    currentTrip = {
        entry: entryInput,
        exit: exitInput || null,
        isCurrent: true,
        timestamp: new Date().getTime() // 添加时间戳用于排序
    };

    // 处理完整行程
    if (exitInput) {
        if (new Date(exitInput) < new Date(entryInput)) {
            alert("离境日期不能早于入境日期");
            return;
        }

        // 移除非历史标记
        const newHistory = {
            entry: entryInput,
            exit: exitInput,
            isHistorical: true
        };

        // 移除可能存在的未完成记录
        travelHistory = travelHistory.filter(t => !t.isCurrent);
        travelHistory.push(newHistory);
        
        // 按入境日期排序
        travelHistory.sort((a, b) => new Date(a.entry) - new Date(b.entry));
    }

    updateDisplay();
    calculateDates();
    clearInputs();
}

// 计算剩余天数
function calculateRemainingDays() {
    if (!currentTrip) return 180;
    
    const currentYear = new Date(currentTrip.entry).getFullYear();
    let usedDays = 0;

    // 计算历史使用天数（仅统计完整行程）
    travelHistory.filter(t => t.isHistorical).forEach(trip => {
        const entry = new Date(trip.entry);
        const exit = new Date(trip.exit);
        
        if (entry.getFullYear() === currentYear) {
            const yearStart = new Date(currentYear, 0, 1);
            const yearEnd = new Date(currentYear, 11, 31);
            
            const start = entry < yearStart ? yearStart : entry;
            const end = exit > yearEnd ? yearEnd : exit;
            
            if (start <= end) {
                usedDays += calculateStayDuration(start, end);
            }
        }
    });

    // 计算当前行程潜在天数
    let potentialDays = 0;
    if (currentTrip.exit) {
        potentialDays = calculateStayDuration(
            new Date(currentTrip.entry),
            new Date(currentTrip.exit)
        );
    }

    return Math.max(180 - (usedDays + potentialDays), 0);
}

// 计算停留天数（包含首尾）
function calculateStayDuration(startDate, endDate) {
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / 86400000) + 1;
}

// 日期计算核心
function calculateDates() {
    if (!currentTrip) return;
    
    const remainingDays = calculateRemainingDays();
    const entryDate = new Date(currentTrip.entry);
    
    // 智能计算逻辑
    const maxDays = Math.min(90, remainingDays);
    const recDays = Math.min(70, remainingDays);
    
    const maxExit = new Date(entryDate);
    maxExit.setDate(entryDate.getDate() + maxDays - 1);
    
    const recExit = new Date(entryDate);
    recExit.setDate(entryDate.getDate() + recDays - 1);

    // 更新显示
    document.getElementById('displayEntry').textContent = currentTrip.entry;
    document.getElementById('recommendedDate').textContent = formatDate(recExit);
    document.getElementById('maxDate').textContent = formatDate(maxExit);
    document.getElementById('remainingDays').textContent = `${remainingDays} 天`;
}

// 更新历史表格
function updateDisplay() {
    const tbody = document.querySelector('#tripTable tbody');
    
    // 合并显示数据（历史记录 + 当前有效行程）
    const displayData = [...travelHistory];
    if (currentTrip?.isCurrent) {
        displayData.push(currentTrip);
    }

    tbody.innerHTML = displayData
        .sort((a, b) => new Date(a.entry) - new Date(b.entry))
        .map((trip, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${trip.entry}</td>
                <td>${trip.exit || '进行中'}</td>
                <td>${trip.exit ? 
                    calculateStayDuration(new Date(trip.entry), new Date(trip.exit)) + ' 天' : 
                    '--'}</td>
            </tr>
        `).join('');
}

// 工具函数
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
