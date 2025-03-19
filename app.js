const state = {
    moods: [],
    currentDate: new Date()
};

const elements = {
    moodButtons: document.querySelectorAll('.mood-btn'),
    moodHistory: document.getElementById('moodHistory')
};

const formatDateTime = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const loadMoods = () => {
    const storedMoods = localStorage.getItem('simpleMoodData');
    if (storedMoods) {
        state.moods = JSON.parse(storedMoods);
        renderMoodHistory();
    }
};

const saveMoods = () => {
    localStorage.setItem('simpleMoodData', JSON.stringify(state.moods));
};

const addMoodEntry = (emoji, label) => {
    const timestamp = new Date();
    const entry = {
        emoji: emoji,
        label: label,
        timestamp: timestamp.toISOString()
    };

    state.moods.unshift(entry);
    saveMoods();
    renderMoodHistory();
};

const renderMoodHistory = () => {
    elements.moodHistory.innerHTML = '';

    state.moods.forEach(entry => {
        const entryElement = document.createElement('div');
        entryElement.className = 'mood-entry';

        const date = new Date(entry.timestamp);
        const formattedDateTime = formatDateTime(date);

        entryElement.innerHTML = `
                    <div class="emoji">${entry.emoji}</div>
                    <div class="label">${entry.label}</div>
                    <div class="timestamp">${formattedDateTime}</div>
                `;

        elements.moodHistory.appendChild(entryElement);
    });

    if (state.moods.length === 0) {
        elements.moodHistory.innerHTML = '<p>No mood entries yet. Select a mood to begin tracking.</p>';
    }
};

const handleMoodClick = (e) => {
    const button = e.target.closest('.mood-btn');
    if (!button) return;

    const emoji = button.dataset.mood;
    const label = button.dataset.label;

    addMoodEntry(emoji, label);
};

const initialize = () => {
    loadMoods();

    elements.moodButtons.forEach(button => {
        button.addEventListener('click', handleMoodClick);
    });
};

document.addEventListener('DOMContentLoaded', initialize);