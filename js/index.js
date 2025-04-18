const dayFormat = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/;
const timeFormat = /([0-1][0-9]|2[0-3]):([0-5][0-9])/;
let targetTimestamp = 0;
let time = ``;
let day = ``;
let diff = -1;

let playsound = false;
let ticking = true;

let volume = 0.2;

const ticking_common = [
  new Audio("d-day/audio/ticking_common_01.wav"),
  new Audio("d-day/audio/ticking_common_02.wav"),
  new Audio("d-day/audio/ticking_common_03.wav"),
  new Audio("d-day/audio/ticking_common_04.wav"),
  new Audio("d-day/audio/ticking_common_05.wav"),
  new Audio("d-day/audio/ticking_common_06.wav"),
  new Audio("d-day/audio/ticking_common_07.wav"),
];

function init() {
  if (getQueryValue("targetTimestamp")) {
    targetTimestamp = parseInt(getQueryValue("targetTimestamp"));
    ticking_common.forEach(audio => {
      audio.load();
      audio.loop = false;
      audio.volume = volume;
    })

    $(".numbers").on("click", () => {
      playsound = !playsound;

      if (diff < 0)
        removeQuery("targetTimestamp")
    })
    run()
  }else {
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
    addQuery("targetTimestamp", targetTimestamp)
  }
}

function run() {
  const countdownInterval = setInterval(() => {
    const currentTime = moment().valueOf();
    diff = moment.duration(targetTimestamp - currentTime);

    day = `D-${diff > 0 ? parseInt(diff / 1000 / (60 * 60 * 24)) : "0"}`;
    time = `${diff.hours().toString().padStart(2, "0")}:${diff.minutes().toString().padStart(2, "0")}:${diff.seconds().toString().padStart(2, "0")}`;
    $(".numbers > .day").text(day);
    $(".numbers > .time").text(time);

    $(".clock > .s_hand").css("transform", `translate(-50%, -50%) rotate(${360 - (360 / 60 * (diff.seconds()))}deg)`);
    $(".clock > .m_hand").css("transform", `translate(-50%, -50%) rotate(${360 - (360 / 60 * (diff.minutes()))}deg)`);
    $(".clock > .h_hand").css("transform", `translate(-50%, -50%) rotate(${360 - (360 / 12 * ((diff.hours()) % 12))}deg)`);
    setTimeout(() => {$(".clock > .hand").css("transition", `none`);}, 500)


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

    if (diff < 0) {
      time = `D-day`;
      $(".day").text("");
      $(".time").text(time);
      $(".time").css("opacity", 0);
      let opacity = 1;
      const opacityInterval = setInterval(() => {
        $(".hand").css("opacity", opacity);
        $(".time").css("opacity", 1-opacity);
        opacity -= 0.1;
        if (opacity < 0) clearInterval(opacityInterval);
      }, 100)
      localStorage.clear()
      clearInterval(countdownInterval);
      return;
    }
  }, 50);
}

function d_day() {

}
