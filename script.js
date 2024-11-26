// 行きのバスの出発時刻（分単位）
const weekdayOutboundDepartures = [424, 453, 483, 524, 554, 568, 604, 623, 644, 663, 679, 695, 711, 730, 750, 770, 784, 804, 824, 844, 864, 874, 877, 890, 915, 936, 951, 970, 975, 980, 984, 988, 996, 1011, 1025, 1035, 1045, 1063, 1075, 1079, 1083, 1088, 1094, 1114, 1130, 1150, 1180, 1210, 1235, 1280, 1309, 1339];
const weekendOutboundDepartures = [479, 525, 545, 585, 615, 645, 675, 705, 735, 765, 795, 825, 855, 885, 915, 945, 975, 1005, 1035, 1095];

// 固定の所要時間（分単位）
const weekdayOutboundDuration = 27;
const weekendOutboundDuration = 27;

// 到着時刻を計算する関数
function calculateArrivalTimes(departures, duration) {
    return departures.map(departure => ({
        departure, // 出発時刻
        arrival: departure + duration // 到着時刻
    }));
}

// 到着時刻を計算したリストを作成
const weekdayOutboundBuses = calculateArrivalTimes(weekdayOutboundDepartures, weekdayOutboundDuration);
const weekendOutboundBuses = calculateArrivalTimes(weekendOutboundDepartures, weekendOutboundDuration);

// 同様に帰りの時刻表を設定（例）
const weekdayInboundDepartures = [845, 860, 880, 905, 920, 935, 950, 965, 980, 995, 1010, 1025, 1040, 1055, 1070, 1085, 1100, 1115, 1130, 1145, 1160, 1175, 1190];
const weekendInboundDepartures = [490, 530, 560];
const weekdayInboundDuration = 15;
const weekendInboundDuration = 20;

const weekdayInboundBuses = calculateArrivalTimes(weekdayInboundDepartures, weekdayInboundDuration);
const weekendInboundBuses = calculateArrivalTimes(weekendInboundDepartures, weekendInboundDuration);

function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

function updateSchedule() {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const dayOfWeek = now.getDay();

    // 現在の時刻と曜日を表示
    document.getElementById("current-time").textContent = `今の時刻は ${formatTime(currentMinutes)} だよ`;
    document.getElementById("day-of-week").textContent = `今日は ${["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"][dayOfWeek]}！！`;

    // 時刻表を選択
    const outboundSchedule = (dayOfWeek === 0 || dayOfWeek === 6) ? weekendOutboundBuses : weekdayOutboundBuses;
    const inboundSchedule = (dayOfWeek === 0 || dayOfWeek === 6) ? weekendInboundBuses : weekdayInboundBuses;

    // 次のバスを取得
    const nextOutboundBuses = outboundSchedule.filter(bus => bus.departure >= currentMinutes).slice(0, 3);
    const nextInboundBuses = inboundSchedule.filter(bus => bus.departure >= currentMinutes).slice(0, 3);

    // 行きのバスリストを更新
    const outboundList = document.getElementById("outbound-bus-list");
    outboundList.innerHTML = "";
    nextOutboundBuses.forEach(bus => {
        const listItem = document.createElement("li");
        listItem.textContent = `${formatTime(bus.departure)}　→　${formatTime(bus.arrival)}`;
        outboundList.appendChild(listItem);
    });

    // 帰りのバスリストを更新
    const inboundList = document.getElementById("inbound-bus-list");
    inboundList.innerHTML = "";
    nextInboundBuses.forEach(bus => {
        const listItem = document.createElement("li");
        listItem.textContent = `${formatTime(bus.departure)}　→　${formatTime(bus.arrival)}`;
        inboundList.appendChild(listItem);
    });
}

// ページが読み込まれたときに実行
window.onload = updateSchedule;

// 時刻を毎分更新
setInterval(updateSchedule, 60000);

