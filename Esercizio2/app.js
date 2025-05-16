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