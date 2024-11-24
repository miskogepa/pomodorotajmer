// Timer and mode variables
let intervalId; // Replace timer with intervalId
let isRunning = false;
let pomodoroDuration = 25 * 60;
let shortBreakDuration = 5 * 60;
let longBreakDuration = 15 * 60;
let longBreakInterval = 4;
let currentDuration = pomodoroDuration;
let currentMode = 'pomodoro'; // Track the current mode
let pomodoroCount = 0;
let autoStartBreaks = true;
let autoStartPomodoros = false;
let autoStartLongBreaks = false;
let endSound = 'sound1.mp3';
let lastTimestamp = null;

// DOM elements
const startBtn = document.querySelector('.start-btn');
const resetBtn = document.querySelector('.reset-btn');
const settingsBtn = document.querySelector('.settings-btn');
const closeSettingsBtn = document.querySelector('.close-settings-btn');
const pomodoroBtn = document.querySelector('.pomodoro-btn');
const shortBreakBtn = document.querySelector('.short-break-btn');
const longBreakBtn = document.querySelector('.long-break-btn');
const minutesDisplay = document.querySelector('.minutes');
const secondsDisplay = document.querySelector('.seconds');
const settingsMenu = document.querySelector('.settings-menu');
const settingsMenuOverlay = document.querySelector('.settings-menu-overlay');
const pomodoroInput = document.getElementById('pomodoro-duration');
const shortBreakInput = document.getElementById('short-break-duration');
const longBreakInput = document.getElementById('long-break-duration');
const longBreakIntervalInput = document.getElementById('long-break-interval');
const autoStartBreaksInput = document.getElementById('auto-start-breaks');
const autoStartPomodorosInput = document.getElementById('auto-start-pomodoros');
const autoStartLongBreaksInput = document.getElementById('auto-start-long-breaks');
const endSoundSelect = document.getElementById('end-sound');

// Function to update the timer display
function updateDisplay(duration) {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  const minutesStr = minutes.toString();
  const secondsStr = seconds < 10 ? '0' + seconds : seconds.toString();
  minutesDisplay.innerHTML = minutesStr.split('').map(digit => `<span class="digit">${digit}</span>`).join('');
  secondsDisplay.innerHTML = `<span class="digit">${secondsStr[0]}</span><span class="digit">${secondsStr[1]}</span>`;
  updateActiveModeButton();
}

// Function to start or pause the timer
function startTimer() {
  if (isRunning) {
    clearInterval(intervalId);
    startBtn.textContent = 'Start';
  } else {
    lastTimestamp = Date.now();
    intervalId = setInterval(updateTimer, 1000);
    startBtn.textContent = 'Pause';
  }
  isRunning = !isRunning;
}

// Function to update the timer
function updateTimer() {
  const now = Date.now();
  const elapsed = Math.floor((now - lastTimestamp) / 1000);
  if (elapsed >= 1) {
    currentDuration -= elapsed;
    updateDisplay(currentDuration);
    lastTimestamp = now;
  }
  if (currentDuration <= 0) {
    clearInterval(intervalId);
    isRunning = false;
    startBtn.textContent = 'Start';
    handleTimerEnd();
  }
}

// Function to handle the end of the timer
function handleTimerEnd() {
  playEndSound();
  if (currentMode === 'pomodoro') {
    pomodoroCount++;
    if (pomodoroCount % longBreakInterval === 0) {
      currentMode = 'longBreak';
      currentDuration = longBreakDuration;
    } else {
      currentMode = 'shortBreak';
      currentDuration = shortBreakDuration;
    }
  } else {
    currentMode = 'pomodoro';
    currentDuration = pomodoroDuration;
  }
  updateDisplay(currentDuration);
  if ((autoStartBreaks && currentMode === 'shortBreak') || (autoStartPomodoros && currentMode === 'pomodoro') || (autoStartLongBreaks && currentMode === 'longBreak')) {
    startTimer();
  }
}

// Function to play the end sound
function playEndSound() {
  const audio = new Audio(`./zvona/${endSound}`);
  audio.play().catch(error => console.error('Error playing sound:', error));
}

// Function to play the selected sound
let currentAudio;
function playSelectedSound() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  currentAudio = new Audio(`./zvona/${endSoundSelect.value}`);
  currentAudio.play().catch(error => console.error('Error playing sound:', error));
}

// Event listener for sound selection change
endSoundSelect.addEventListener('change', playSelectedSound);

// Function to update the Long Break Interval counter
function updateLongBreakIntervalCounter() {
  const counterDisplay = document.querySelector('.long-break-interval-counter');
  counterDisplay.textContent = `Long Break Interval: ${pomodoroCount % longBreakInterval} / ${longBreakInterval}`;
}

// Ensure Pomodoro button is highlighted on app start
document.addEventListener('DOMContentLoaded', () => {
  updateActiveModeButton();
  updateLongBreakIntervalCounter();
});

// Update counter when mode changes
function updateActiveModeButton() {
  document.querySelectorAll('.time-buttons button').forEach(button => {
    button.classList.remove('active');
  });
  if (currentMode === 'pomodoro') {
    pomodoroBtn.classList.add('active');
  } else if (currentMode === 'shortBreak') {
    shortBreakBtn.classList.add('active');
  } else if (currentMode === 'longBreak') {
    longBreakBtn.classList.add('active');
  }
  updateLongBreakIntervalCounter();
}

// Event listeners for buttons
startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', () => {
  clearInterval(intervalId);
  isRunning = false;
  startBtn.textContent = 'Start';
  if (currentMode === 'pomodoro') {
    currentDuration = pomodoroDuration;
  } else if (currentMode === 'shortBreak') {
    currentDuration = shortBreakDuration;
  } else if (currentMode === 'longBreak') {
    currentDuration = longBreakDuration;
  }
  updateDisplay(currentDuration);
  updateLongBreakIntervalCounter();
});

pomodoroBtn.addEventListener('click', () => {
  clearInterval(intervalId); // Stop the timer
  isRunning = false;
  startBtn.textContent = 'Start';
  currentMode = 'pomodoro';
  currentDuration = pomodoroDuration;
  updateDisplay(currentDuration);
  updateLongBreakIntervalCounter();
});
shortBreakBtn.addEventListener('click', () => {
  clearInterval(intervalId); // Stop the timer
  isRunning = false;
  startBtn.textContent = 'Start';
  currentMode = 'shortBreak';
  currentDuration = shortBreakDuration;
  updateDisplay(currentDuration);
  updateLongBreakIntervalCounter();
});
longBreakBtn.addEventListener('click', () => {
  clearInterval(intervalId); // Stop the timer
  isRunning = false;
  startBtn.textContent = 'Start';
  currentMode = 'longBreak';
  currentDuration = longBreakDuration;
  updateDisplay(currentDuration);
  updateLongBreakIntervalCounter();
});

settingsBtn.addEventListener('click', () => {
  settingsMenu.style.display = 'block';
  settingsMenuOverlay.style.display = 'block';
});

closeSettingsBtn.addEventListener('click', () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  pomodoroDuration = Math.min(parseInt(pomodoroInput.value), 999) * 60;
  shortBreakDuration = Math.min(parseInt(shortBreakInput.value), 999) * 60;
  longBreakDuration = Math.min(parseInt(longBreakInput.value), 999) * 60;
  longBreakInterval = parseInt(longBreakIntervalInput.value);
  autoStartBreaks = autoStartBreaksInput.checked;
  autoStartPomodoros = autoStartPomodorosInput.checked;
  autoStartLongBreaks = autoStartLongBreaksInput.checked;
  endSound = endSoundSelect.value;
  settingsMenu.style.display = 'none';
  settingsMenuOverlay.style.display = 'none';
  if (currentMode === 'pomodoro') {
    currentDuration = pomodoroDuration;
  } else if (currentMode === 'shortBreak') {
    currentDuration = shortBreakDuration;
  } else if (currentMode === 'longBreak') {
    currentDuration = longBreakDuration;
  }
  updateDisplay(currentDuration);
});

// Ensure input values do not exceed 999 and do not add leading zeros
pomodoroInput.addEventListener('input', () => {
  if (pomodoroInput.value > 999) pomodoroInput.value = 999;
});
shortBreakInput.addEventListener('input', () => {
  if (shortBreakInput.value > 999) shortBreakInput.value = 999;
});
longBreakInput.addEventListener('input', () => {
  if (longBreakInput.value > 999) longBreakInput.value = 999;
});

// Task manager functionality
const taskInput = document.querySelector('.task-input');
const taskList = document.querySelector('.task-list');
const addTaskBtn = document.querySelector('.add-task-btn');

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText !== '') {
    const li = document.createElement('li');
    li.innerHTML = `${taskText} <button class="delete-task-btn">Delete</button>`;
    li.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-task-btn')) {
        li.remove();
      } else {
        li.classList.toggle('completed');
      }
    });
    taskList.appendChild(li);
    taskInput.value = '';
  }
}