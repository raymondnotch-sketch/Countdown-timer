const STROKE_LENGTH = 2 * Math.PI * 45;

const displayEl = document.getElementById('display');
const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');
const setBtn = document.getElementById('set-btn');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const progressRingCircle = document.querySelector('.progress-ring__circle');
const progressRingBar = document.querySelector('.progress-ring__bar');
const card = document.querySelector('.card');  progressRingBar.style.strokeDasharray = `${STROKE_LENGTH} ${STROKE_LENGTH}`;
progressRingBar.style.strokeDashoffset = '0';
const progressRingBackgroundRadius = 45;
const STROKE_LENGTH_CIRCLE = 2 * Math.PI * progressRingBackgroundRadius;

let totalSeconds = 0;
let displayedSeconds = 0;
let remaining = 0;
let timerId = null;
let paused = false;
let alarmTone = null;

function setDigits(value) {
  const padded = String(value).slice(-2);
  displayedSeconds = value;
  const content = displayEl.querySelector('.display-content');
  if (content) {
    content.textContent = padded;
  } else {
    displayEl.textContent = padded;
  }
}

function formatTime(totalSecs) {
  const hours = Math.floor(totalSecs / 3600);
  const minutes = Math.floor((totalSecs % 3600) / 60);
  const seconds = totalSecs % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateDisplayFromRemaining() {
  const formatted = formatTime(remaining);
  const content = displayEl.querySelector('.display-content');
  if (content) {
    content.textContent = formatted;
  } else {
    displayEl.textContent = formatted;
  }
}

function updateDisplayText(text) {
  const content = displayEl.querySelector('.display-content');
  if (content) {
    content.textContent = text;
  } else {
    displayEl.textContent = text;
  }
}

function updateProgressRing() {
  if (totalSeconds <= 0) {
    progressRingBar.style.strokeDashoffset = STROKE_LENGTH_CIRCLE;
    return;
  }
  const offset = STROKE_LENGTH_CIRCLE - (remaining / totalSeconds) * STROKE_LENGTH_CIRCLE;
  progressRingBar.style.strokeDashoffset = offset;
}

function setInputsFromSeconds(secs) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  hoursInput.value = h;
  minutesInput.value = m;
  secondsInput.value = s;
}

function clampInputs() {
  let h = parseInt(hoursInput.value, 10);
  let m = parseInt(minutesInput.value, 10);
  let s = parseInt(secondsInput.value, 10);

  if (Number.isNaN(h)) h = 0;
  if (Number.isNaN(m)) m = 0;
  if (Number.isNaN(s)) s = 0;

  if (h < 0) h = 0;
  if (m < 0) m = 0;
  if (s < 0) s = 0;

  if (h > 99) h = 99;
  if (m > 59) m = 59;
  if (s > 59) s = 59;

  hoursInput.value = h;
  minutesInput.value = m;
  secondsInput.value = s;
}

function readInputs() {
  return (
    (parseInt(hoursInput.value, 10) || 0) * 3600 +
    (parseInt(minutesInput.value, 10) || 0) * 60 +
    (parseInt(secondsInput.value, 10) || 0)
  );
}

function stopTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
  paused = false;
}

function playAlarmBeep() {
  if (!('AudioContext' in window)) {
    return;
  }

  if (alarmTone === null) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.35, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.2, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
    gain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(660, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.3);
    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 0.5);
    alarmTone = { ctx, osc, gain, scheduledUntil: now + 0.5 };
  }
}

function alarmPulse() {
  if (card.classList.contains('pulse')) {
    return;
  }
  card.classList.remove('pulse');
  void card.offsetWidth;
  card.classList.add('pulse');
  setTimeout(() => {
    card.classList.remove('pulse');
  }, 700);
}

function reachedZero() {
  stopTimer();
  remaining = 0;
  updateDisplayFromRemaining();
  updateProgressRing();
  playAlarmBeep();
  alarmPulse();
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

function tick() {
  if (remaining > 0) {
    remaining -= 1;
    updateDisplayFromRemaining();
    updateProgressRing();
    if (remaining === 0) {
      reachedZero();
    }
  } else {
    reachedZero();
  }
}

function startTimer() {
  if (timerId !== null) {
    return;
  }

  if (remaining <= 0) {
    totalSeconds = readInputs();
    if (totalSeconds <= 0) {
      return;
    }
    remaining = totalSeconds;
  }

  clampInputs();
  stopTimer();
  paused = false;
  timerId = setInterval(tick, 1000);
  updateProgressRing();
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  setBtn.disabled = true;
}

function pauseTimer() {
  if (timerId === null) {
    return;
  }
  clearInterval(timerId);
  timerId = null;
  paused = true;
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

function resetTimer() {
  stopTimer();
  remaining = totalSeconds > 0 ? totalSeconds : 0;
  if (remaining > 0) {
    updateDisplayFromRemaining();
    updateProgressRing();
  } else {
    updateDisplayText('00:00:00');
    updateProgressRing();
  }
  startBtn.disabled = remaining > 0;
  pauseBtn.disabled = true;
  setBtn.disabled = false;
}

function loadTimerFromInputs() {
  stopTimer();
  totalSeconds = readInputs();
  clampInputs();
  if (totalSeconds <= 0) {
    totalSeconds = 0;
    remaining = 0;
    updateDisplayText('00:00:00');
    updateProgressRing();
    startBtn.disabled = true;
    pauseBtn.disabled = true;
    setBtn.disabled = false;
    return;
  }
  remaining = totalSeconds;
  updateDisplayFromRemaining();
  updateProgressRing();
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  setBtn.disabled = false;
}

hoursInput.addEventListener('input', resetTimer);
minutesInput.addEventListener('input', resetTimer);
secondsInput.addEventListener('input', resetTimer);

hoursInput.addEventListener('focus', () => hoursInput.select());
minutesInput.addEventListener('focus', () => minutesInput.select());
secondsInput.addEventListener('focus', () => secondsInput.select());

setBtn.addEventListener('click', loadTimerFromInputs);

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

setInputsFromSeconds(0);
updateDisplayText('00:00:00');
updateProgressRing();
pauseBtn.disabled = true;
startBtn.disabled = true;
