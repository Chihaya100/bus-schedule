// バスの時刻表（分単位）
const weekdayBuses = [424, 453, 483, 524, 554, 568, 604, 623, 644, 663, 679, 695, 711, 730, 750, 770, 784, 804,824, 844, 864, 874, 877, 890, 915, 936, 951, 970, 975, 980, 984, 988, 996, 1011, 1025, 1035, 1045, 1063, 1075, 1079,  ]; // 平日: 8:00, 9:00, ...
const weekendBuses = [540, 600, 660, 720]; // 休日: 9:00, 10:00, ...

// 時刻をフォーマットする関数
function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

// 曜日を文字列に変換する関数
function getDayOfWeekString(dayIndex) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[dayIndex];
}

// メイン処理
function updateSchedule() {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const dayOfWeek = now.getDay();

    // 現在の時刻と曜日を表示
    document.getElementById("current-time").textContent = `Current time: ${formatTime(currentMinutes)}`;
    document.getElementById("day-of-week").textContent = `Day of the week: ${getDayOfWeekString(dayOfWeek)}`;

    // 時刻表を選択
    const busSchedule = (dayOfWeek === 0 || dayOfWeek === 6) ? weekendBuses : weekdayBuses;

    // 次の2つのバスを取得
    const nextBuses = busSchedule.filter(busTime => busTime >= currentMinutes).slice(0, 3);

    // バスリストを更新
    const busList = document.getElementById("bus-list");
    busList.innerHTML = ""; // 既存のリストをクリア
    nextBuses.forEach(busTime => {
        const listItem = document.createElement("li");
        listItem.textContent = formatTime(busTime);
        busList.appendChild(listItem);
    });
}

// ページが読み込まれたときに実行
window.onload = updateSchedule;

// 時刻を毎分更新
setInterval(updateSchedule, 60000);
