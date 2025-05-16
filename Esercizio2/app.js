let timerInterval;
let startTime;
let running = false;
let laps = [];

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const resetButton = document.getElementById('resetButton');
const lapButton = document.getElementById('lapButton');
const lapsList = document.getElementById('laps-list');

function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10); // Visualizza le decine di millisecondi

    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    const mss = String(ms).padStart(2, '0');

    return `${mm}:${ss}:${mss}`;
}

function updateTimer() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    timerDisplay.textContent = formatTime(elapsedTime);
}

startButton.addEventListener('click', () => {
    if (!running) {
        startTime = Date.now() - (startTime ? (Date.now() - startTime) : 0);
        timerInterval = setInterval(updateTimer, 10); // Aggiorna ogni 10 millisecondi per mostrare i centesimi
        running = true;
        startButton.disabled = true;
        stopButton.disabled = false;
        lapButton.disabled = false;
    }
});

stopButton.addEventListener('click', () => {
    if (running) {
        clearInterval(timerInterval);
        running = false;
        startButton.disabled = false;
        stopButton.disabled = true;
        lapButton.disabled = true;
    }
});

resetButton.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerDisplay.textContent = '00:00:00';
    startTime = null;
    running = false;
    laps = [];
    lapsList.innerHTML = '';
    startButton.disabled = false;
    stopButton.disabled = true;
    lapButton.disabled = true;
});

lapButton.addEventListener('click', () => {
    if (running) {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;
        laps.push(formatTime(elapsedTime));
        const listItem = document.createElement('li');
        listItem.textContent = formatTime(elapsedTime);
        lapsList.appendChild(listItem);
    }
});