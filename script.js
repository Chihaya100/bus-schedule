// 固定の所要時間（分単位）
const OUTBOUND_DURATION = 27;
const INBOUND_DURATION = 27;
const TONDA_OUTBOUND_DURATION = 23;
const TONDA_INBOUND_DURATION = 23;

// 曜日判定用の関数
function isWeekend(dayOfWeek) {
    return dayOfWeek === 0 || dayOfWeek === 6;
}

// バスの時刻表（JR高槻路線：帰り）
const outboundSchedules = {
    weekday: [424, 453, 483, 524, 554, 568, 604, 623, 644, 663, 679, 695, 711, 730, 750, 770, 784, 804, 824, 844, 864, 874, 877, 890, 915, 936, 951, 970, 975, 980, 984, 988, 996, 1011, 1025, 1035, 1045, 1063, 1075, 1079, 1083, 1088, 1094, 1114, 1130, 1150, 1180, 1210, 1235, 1280, 1309, 1339],
    weekend: [479, 525, 545, 585, 615, 645, 675, 705, 735, 765, 795, 825, 855, 885, 915, 945, 975, 1005, 1035, 1095],
};

// バスの時刻表（JR高槻路線：行き）
const inboundSchedules = {
    weekday: [395, 453, 475, 485, 491, 497, 503, 510, 515, 535, 555, 575, 590, 594, 598, 602, 606, 610, 615, 635, 655, 675, 695, 710, 725, 735, 740, 750, 755, 770, 790, 805, 820, 845, 860, 880, 905, 920, 935, 950, 965, 980, 995, 1010, 1025, 1040, 1055, 1070, 1085, 1100, 1115, 1130, 1145, 1160, 1175, 1190, 1215, 1245, 1275, 1307, 1370],
    weekend: [485, 513, 530, 550, 580, 610, 640, 670, 700, 730, 760, 790, 820, 850, 880, 910, 940, 970, 1000, 1030],
};

// 富田路線の時刻表
const tondaSchedules = {
    outbound: {
        weekday: [380, 388, 423, 448, 500, 505, 511, 516, 575, 595, 610, 615, 670, 710, 750, 782, 840, 855, 885, 910, 958, 1005, 1038, 1058, 1085, 1120, 1145, 1175, 1245, 1310],
        weekend: [383, 425, 490, 545, 595, 655, 708, 775, 810, 840, 910, 981, 1050, 1110, 1139, 1190],
    },
    inbound: {
        weekday: [395, 464, 490, 525, 570, 585, 603, 640, 663, 700, 759, 820, 847, 881, 886, 920, 951, 975, 1005, 1051, 1069, 1081, 1095, 1130, 1176, 1216, 1290, 1351],
        weekend: [419, 424, 528, 567, 637, 697, 749, 817, 886, 951, 1005, 1069, 1111, 1180],
    },
};

// 到着時刻を計算する関数
function calculateArrivalTimes(departures, duration) {
    return departures.map(departure => ({
        departure, // 出発時刻
        arrival: departure + duration, // 到着時刻
        isDirect: departure === 970 || departure === 1075, // 直通便の判定
    }));
}

// 時刻フォーマット関数
function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

// 時刻表更新関数
function updateSchedule() {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const dayOfWeek = now.getDay();
    const isWeekendDay = isWeekend(dayOfWeek);

    // 現在の時刻と曜日を表示
    document.getElementById("update-message").textContent = "ヘッダーを更新";
    document.getElementById("current-time").textContent = `現在時刻: ${formatTime(currentMinutes)}`;
    document.getElementById("day-of-week").textContent = ` ${["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"][dayOfWeek]}`;

    // 既存路線の時刻表
    const outboundSchedule = isWeekendDay ? outboundSchedules.weekend : outboundSchedules.weekday;
    const inboundSchedule = isWeekendDay ? inboundSchedules.weekend : inboundSchedules.weekday;

    // 富田線の時刻表
    const tondaOutboundSchedule = isWeekendDay
        ? tondaSchedules.outbound.weekend
        : tondaSchedules.outbound.weekday;
    const tondaInboundSchedule = isWeekendDay
        ? tondaSchedules.inbound.weekend
        : tondaSchedules.inbound.weekday;

    // 次のバスを計算
    const nextOutboundBuses = calculateArrivalTimes(outboundSchedule, OUTBOUND_DURATION).filter(bus => bus.departure >= currentMinutes);
    const nextInboundBuses = calculateArrivalTimes(inboundSchedule, INBOUND_DURATION).filter(bus => bus.departure >= currentMinutes);
    const nexttondaOutboundBuses = calculateArrivalTimes(tondaOutboundSchedule, TONDA_OUTBOUND_DURATION).filter(bus => bus.departure >= currentMinutes);
    const nexttondaInboundBuses = calculateArrivalTimes(tondaInboundSchedule, TONDA_INBOUND_DURATION).filter(bus => bus.departure >= currentMinutes);

    // 最初の3つだけ表示
    updateBusList("outbound-bus-list", nextOutboundBuses.slice(0, 3), nextOutboundBuses);
    updateBusList("inbound-bus-list", nextInboundBuses.slice(0, 3), nextInboundBuses);
    updateBusList("tonda-outbound-bus-list", nexttondaOutboundBuses.slice(0, 3), nexttondaOutboundBuses);
    updateBusList("tonda-inbound-bus-list", nexttondaInboundBuses.slice(0, 3), nexttondaInboundBuses);
}

// バスリスト更新ヘルパー
function updateBusList(elementId, busesToShow, allBuses) {
    const listElement = document.getElementById(elementId);
    listElement.innerHTML = ""; // 初期化

    // 最初の3つだけ表示
    busesToShow.forEach(bus => {
        const listItem = document.createElement("li");
        listItem.textContent = `${formatTime(bus.departure)} → ${formatTime(bus.arrival)}${bus.isDirect ? ' ★直通★' : ''}`;
        listElement.appendChild(listItem);
    });

    // ヘッダーをクリックした時の処理
    const headerElement = document.querySelector(`.bus-header[data-target="${elementId}"]`);
    headerElement.onclick = function() {
        if (listElement.children.length === busesToShow.length) {
            // すべての時刻を表示する
            listElement.innerHTML = ""; // クリア
            allBuses.forEach(bus => {
                const listItem = document.createElement("li");
                listItem.textContent = `${formatTime(bus.departure)} → ${formatTime(bus.arrival)}${bus.isDirect ? ' ★直通★' : ''}`;
                listElement.appendChild(listItem);
            });
        } else {
            // 最初の3つだけ表示する
            listElement.innerHTML = ""; // クリア
            busesToShow.forEach(bus => {
                const listItem = document.createElement("li");
                listItem.textContent = `${formatTime(bus.departure)} → ${formatTime(bus.arrival)}${bus.isDirect ? ' ★直通★' : ''}`;
                listElement.appendChild(listItem);
            });
        }
    };
}

// ページ読み込み時と1分ごとの更新
window.onload = updateSchedule;
setInterval(updateSchedule, 60000);
