// 数据存储
let historyRecords = [];  // 历史出入境记录
let currentEntry = null;  // 当前入境日期

// 添加历史记录
function addHistory() {
    const entry = document.getElementById('historyEntry').value;
    const exit = document.getElementById('historyExit').value;

    if (!entry || !exit) {
        alert("请填写完整历史日期");
        return;
    }

    if (new Date(exit) < new Date(entry)) {
        alert("离境日期不能早于入境日期");
        return;
    }

    historyRecords.push({ entry, exit });
    historyRecords.sort((a, b) => new Date(a.entry) - new Date(b.entry));
    
    updateDisplay();
    calculateResults();
    clearHistoryInput();
}

// 设置当前状态
function setCurrent() {
    const newEntry = document.getElementById('currentEntry').value;
    
    if (!newEntry) {
        alert("请输入本次入境日期");
        return;
    }

    // 保留原有当前状态（需要显式修改）
    if (!currentEntry) {
        currentEntry = newEntry;
    }
    
    updateDisplay();
    calculateResults();
}

// 核心计算逻辑
function calculateResults() {
    const currentYear = new Date().getFullYear();
    let usedDays = 0;

    // 计算历史使用天数
    historyRecords.forEach(record => {
        const entry = new Date(record.entry);
        const exit = new Date(record.exit);
        
        if (entry.getFullYear() === currentYear) {
            const start = entry < new Date(currentYear, 0, 1) ? 
                new Date(currentYear, 0, 1) : entry;
            const end = exit > new Date(currentYear, 11, 31) ? 
                new Date(currentYear, 11, 31) : exit;
            
            if (start <= end) {
                usedDays += calculateStayDuration(start, end);
            }
        }
    });

    // 计算剩余天数
    const remainingDays = Math.max(180 - usedDays, 0);
    
    // 更新显示
    if (currentEntry) {
        // 在境内状态
        document.getElementById('inCountryResult').style.display = 'block';
        document.getElementById('outCountryResult').style.display = 'none';
        
        const entryDate = new Date(currentEntry);
        const maxDays = Math.min(90, remainingDays);
        const recDays = Math.min(70, remainingDays);

        const maxExit = new Date(entryDate);
        maxExit.setDate(entryDate.getDate() + maxDays - 1);
        
        const recExit = new Date(entryDate);
        recExit.setDate(entryDate.getDate() + recDays - 1);

        document.getElementById('currentEntryDisplay').textContent = currentEntry;
        document.getElementById('recommendedDate').textContent = formatDate(recExit);
        document.getElementById('maxDate').textContent = formatDate(maxExit);
    } else {
        // 在境外状态
        document.getElementById('inCountryResult').style.display = 'none';
        document.getElementById('outCountryResult').style.display = 'block';
        document.getElementById('remainingDays').textContent = remainingDays;
    }
}

// 辅助函数
function calculateStayDuration(startDate, endDate) {
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / 86400000) + 1;
}

function formatDate(date) {
    return date.toLocaleDateString('zh-CN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
    }).replace(/\//g, '-');
}

function updateDisplay() {
    const tbody = document.querySelector('#tripTable tbody');
    tbody.innerHTML = historyRecords.map(record => `
        <tr>
            <td>历史记录</td>
            <td>${record.entry}</td>
            <td>${record.exit}</td>
            <td>${calculateStayDuration(new Date(record.entry), new Date(record.exit))}天</td>
        </tr>
    `).join('');

    if (currentEntry) {
        tbody.innerHTML += `
            <tr class="current">
                <td>当前状态</td>
                <td>${currentEntry}</td>
                <td>进行中</td>
                <td>-</td>
            </tr>
        `;
    }
}

function clearHistoryInput() {
    document.getElementById('historyEntry').value = '';
    document.getElementById('historyExit').value = '';
}

// 初始化
document.getElementById('currentEntry').value = '';
clearHistoryInput();
