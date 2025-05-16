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


/**
 * Formatta un tempo in millisecondi in una stringa "mm:ss:ms".
 * @param {number} milliseconds - Il tempo in millisecondi da formattare.
 * @returns {string} Una stringa che rappresenta il tempo formattato (es. "01:30:25").
 */

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

/**
 * Aggiorna la visualizzazione del timer con il tempo trascorso dall'avvio.
 * Utilizza la variabile globale `startTime` per calcolare il tempo trascorso.
 */

function updateTimer() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    timerDisplay.textContent = formatTime(elapsedTime);
}

/**
 * Aggiunge un listener per l'evento 'click' al pulsante di avvio.
 * Avvia il cronometro se non è già in esecuzione, impostando un intervallo per aggiornare il timer ogni 10 millisecondi.
 * Abilita/disabilita i pulsanti appropriati.
 */

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

/**
 * Aggiunge un listener per l'evento 'click' al pulsante di stop.
 * Ferma il cronometro se è in esecuzione, cancellando l'intervallo del timer.
 * Abilita/disabilita i pulsanti appropriati.
 */

stopButton.addEventListener('click', () => {
    if (running) {
        clearInterval(timerInterval);
        running = false;
        startButton.disabled = false;
        stopButton.disabled = true;
        lapButton.disabled = true;
    }
});

/**
 * Aggiunge un listener per l'evento 'click' al pulsante di reset.
 * Ferma il cronometro, resetta la visualizzazione del timer, la variabile `startTime`, lo stato `running` e la lista dei lap.
 * Abilita/disabilita i pulsanti allo stato iniziale.
 */

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

/**
 * Aggiunge un listener per l'evento 'click' al pulsante di lap.
 * Se il cronometro è in esecuzione, registra il tempo corrente come un lap, lo aggiunge all'array `laps` e lo visualizza nella lista dei lap.
 */

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