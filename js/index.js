const dayFormat = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/;
const timeFormat = /([0-1][0-9]|2[0-3]):([0-5][0-9])/;
let targetTimestamp = 0;
let time = ``;

let playsound = false;
let ticking = true;

let volume = 0.1;

const ticking_common = [
  new Audio("audio/ticking_common_01.wav"),
  new Audio("audio/ticking_common_02.wav"),
  new Audio("audio/ticking_common_03.wav"),
  new Audio("audio/ticking_common_04.wav"),
  new Audio("audio/ticking_common_05.wav"),
  new Audio("audio/ticking_common_06.wav"),
  new Audio("audio/ticking_common_07.wav"),
];

function init() {
  if (localStorage.getItem("targetTimestamp"))
    targetTimestamp = parseInt(localStorage.getItem("targetTimestamp"));
  else {
    let day = "";
    while (!dayFormat.test(day)) {
      day = prompt("날짜를 입력해주세요 (YYYY-MM-DD)");
      if (!day)
        return;
    }
    let time = "";
    while (!timeFormat.test(time)) {
      time = prompt("시간을 입력하세요 (HH:mm) 24h")
      if (!day)
        return;
    }

    targetTimestamp = moment(`${day} ${time}`, `YYYY-MM-DD HH:mm`).valueOf();
    localStorage.setItem("targetTimestamp", targetTimestamp);
  }
  console.log(targetTimestamp);

  ticking_common.forEach(audio => {
    audio.load();
    audio.loop = false;
    audio.volume = volume;
  })

  $(".time").on("click", () => {
    playsound = !playsound;
  })

  run()
}

function run() {
  const countdownInterval = setInterval(() => {
    const currentTime = moment().valueOf();
    const diff = moment.duration(targetTimestamp - currentTime);

    time = `${diff.hours().toString().padStart(2, "0")}:${diff.minutes().toString().padStart(2, "0")}:${diff.seconds().toString().padStart(2, "0")}`;
    $(".time").text(time);
    if (diff % 1000 < 150 && diff % 1000 > 50) {
      if (playsound && ticking) {
       const target = ticking_common[parseInt(diff / 1000) % 7];
       if (diff / 1000 < 10) {
         volume += 0.1;
         if (!(volume > 1))
          target.volume = volume;
        }
        target.play();
        ticking = false;
      }
    }else
      ticking = true;

    if (diff < 1000) {
      localStorage.clear()
      clearInterval(countdownInterval);
      return;
    }
  }, 50);
}

// function mainTimeCountDown()

