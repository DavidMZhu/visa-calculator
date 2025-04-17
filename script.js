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
    // 这里暂时留空，后续添加核心算法
    document.getElementById('maxDate').textContent = "开发中";
    document.getElementById('remainingDays').textContent = "开发中";
}
