 // --- CONFIGURATION ---
const GRID_ROWS = 25;
const GRID_COLS = 25;
const GRID_SIZE = GRID_ROWS * GRID_COLS;
const TRIGGER_INTERVAL_MS = 10000; // 10 seconds per evolution
const ORANGE_CHANCE_PERCENT = 0.05; // 5% chance

// --- DOM ELEMENTS ---
const startPauseBtn = document.getElementById('start-pause-btn');
const resetBtn = document.getElementById('reset-btn');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const centisecondsEl = document.getElementById('centiseconds');
const startPauseTextEl = document.getElementById('start-pause-text');
const startIcon = document.getElementById('start-icon');
const pauseIcon = document.getElementById('pause-icon');
const gridContainer = document.getElementById('grid-container');

// --- STATE ---
let time = 0;
let isRunning = false;
let timerInterval = null;
let lastTriggerInterval = 0;
let gridElements = []; // Stores references to the 625 div elements that represent parts of world

/**
 * Formats milliseconds into MM:SS:ms string components.
 * @param {number} ms - Total milliseconds elapsed.
 */
function formatTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    
    const pad = (num) => String(num).padStart(2, '0');

    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);
    centisecondsEl.textContent = pad(centiseconds);
}

/**
 * Updates the grid colors based on 5% chance of changing color.
 */
function handleIntervalTrigger() {
    gridElements.forEach(el => {
        if (Math.random() <= ORANGE_CHANCE_PERCENT) {
            // Change to orange classes
            el.classList.remove('box-gray');
            el.classList.add('box-orange');
        }
        // If the box is already orange, it stays orange.
    });
}

/**
 * Checks if the interval has passed and triggers the grid update.
 */
function checkGridTrigger() {
    const currentInterval = Math.floor(time / TRIGGER_INTERVAL_MS);

    if (currentInterval > 0 && currentInterval > lastTriggerInterval) {
        lastTriggerInterval = currentInterval;
        handleIntervalTrigger();
    }
}

/**
 * Core function to update time, display, and check the grid trigger.
 */
function tick() {
    time += 10;
    formatTime(time);
    checkGridTrigger();
}

/**
 * Starts or pauses the timer.
 */
function handleStartStop() {
    if (isRunning) {
        // Pause
        clearInterval(timerInterval);
        timerInterval = null;
        isRunning = false;
        
        // Update button for paused
        startPauseBtn.classList.remove('btn-pause-red');
        startPauseBtn.classList.add('btn-start-green');
        startPauseTextEl.textContent = 'Start';
        pauseIcon.classList.add('hidden');
        startIcon.classList.remove('hidden');

    } else {
        // Start
        timerInterval = setInterval(tick, 10);
        isRunning = true;

        // Update button for running state
        startPauseBtn.classList.remove('btn-start-green');
        startPauseBtn.classList.add('btn-pause-red');
        startPauseTextEl.textContent = 'Pause';
        startIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
    }
}

/**
 * Resets the timer and grid
 */
function handleReset() {
    // Stop the timer if running
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    isRunning = false;
    time = 0;
    lastTriggerInterval = 0;
    
    // Reset the display
    formatTime(0);

    // Reset button to default 'Start' state
    startPauseBtn.classList.remove('btn-pause-red');
    startPauseBtn.classList.add('btn-start-green');
    startPauseTextEl.textContent = 'Start';
    pauseIcon.classList.add('hidden');
    startIcon.classList.remove('hidden');

    // Reset grid colors to gray
    gridElements.forEach(el => {
        el.classList.remove('box-orange');
        el.classList.add('box-gray');
    });
}

// --- INITIALIZATION ---

/**
 * Creates and initializes the 25x25 grid of divs.
 */
function initializeGrid() {
    for (let i = 0; i < GRID_SIZE; i++) {
        const box = document.createElement('div');
        // Use the new custom class for gray base color
        box.className = 'worldbox box-gray'; 
        gridContainer.appendChild(box);
        gridElements.push(box);
    }
}

// Add event listeners once the window is loaded
window.onload = function() {
    initializeGrid();
    startPauseBtn.addEventListener('click', handleStartStop);
    resetBtn.addEventListener('click', handleReset);
    
    // Initial render of time (00:00.00)
    formatTime(0); 
};