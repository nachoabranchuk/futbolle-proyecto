'use strict';

var THEME_STORAGE_KEY = 'futbolleTheme';
var themeToggleBtn = document.getElementById('theme-toggle-btn');
var difficultySelect = document.getElementById('difficulty-select');
var attemptsCounterEl = document.getElementById('attempts-counter');
var attemptsLeftInlineEl = document.getElementById('attempts-left-inline');
var timerDisplayEl = document.getElementById('timer-display');
var restartBtn = document.getElementById('restart-btn');
var historyBtn = document.getElementById('history-btn');
var hintPhotoSection = document.getElementById('hint-photo-section');
var hintPhotoImg = document.getElementById('hint-photo');
var extraHintsPanel = document.getElementById('extra-hints-panel');
var extraHintAge = document.getElementById('extra-hint-age');
var extraHintOverall = document.getElementById('extra-hint-overall');
var extraHintHeight = document.getElementById('extra-hint-height');
var searchInput = document.getElementById('player-search-input');
var autocompleteList = document.getElementById('autocomplete-list');
var attemptsBoardBody = document.getElementById('attempts-board-body');
var startModalOverlay = document.getElementById('start-modal-overlay');
var startNameInput = document.getElementById('start-name-input');
var startNameError = document.getElementById('start-name-error');
var startDifficultySelect = document.getElementById('start-difficulty-select');
var startBeginBtn = document.getElementById('start-begin-btn');
var resultModalOverlay = document.getElementById('result-modal-overlay');
var resultModalTitle = document.getElementById('result-modal-title');
var resultModalMessage = document.getElementById('result-modal-message');
var resultSecretPlayer = document.getElementById('result-secret-player');
var resultPlayerPhoto = document.getElementById('result-player-photo');
var resultPlayerName = document.getElementById('result-player-name');
var resultModalCloseBtn = document.getElementById('result-modal-close-btn');
var resultModalRestartBtn = document.getElementById('result-modal-restart-btn');
var errorModalOverlay = document.getElementById('error-modal-overlay');
var errorModalMessage = document.getElementById('error-modal-message');
var errorModalCloseBtn = document.getElementById('error-modal-close-btn');
var historyModalOverlay = document.getElementById('history-modal-overlay');
var historySortSelect = document.getElementById('history-sort-select');
var historyTableBody = document.getElementById('history-table-body');
var historyModalCloseBtn = document.getElementById('history-modal-close-btn');
var githubLink = document.getElementById('github-link');
var audioContextRef = null;

function showModal(overlayElement) {
  overlayElement.classList.remove('hidden');
}

function hideModal(overlayElement) {
  overlayElement.classList.add('hidden');
}

function showErrorModal(message) {
  errorModalMessage.textContent = message;
  showModal(errorModalOverlay);
}

function formatTime(totalSeconds) {
  var minutes = Math.floor(totalSeconds / 60);
  var seconds = totalSeconds % 60;
  var minutesText = minutes < 10 ? '0' + minutes : String(minutes);
  var secondsText = seconds < 10 ? '0' + seconds : String(seconds);
  return minutesText + ':' + secondsText;
}

function updateTimerDisplay(totalSeconds) {
  timerDisplayEl.textContent = formatTime(totalSeconds);
}

function updateAttemptsDisplay(attemptsRemaining) {
  attemptsCounterEl.textContent = String(attemptsRemaining);
  attemptsLeftInlineEl.textContent = String(attemptsRemaining);
}

function clearElementChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function createComparisonCellContent(comparison) {
  if (comparison === 'match') {
    return 'cell-match';
  }
  if (comparison === 'higher') {
    return 'cell-higher';
  }
  if (comparison === 'lower') {
    return 'cell-lower';
  }
  return 'cell-mismatch';
}

function appendComparisonCell(rowElement, displayText, comparison) {
  var cellElement = document.createElement('td');
  cellElement.textContent = displayText;
  cellElement.classList.add(createComparisonCellContent(comparison));
  rowElement.appendChild(cellElement);
}

function renderAttemptRow(attemptResult) {
  var rowElement = document.createElement('tr');
  var nameCell = document.createElement('td');
  nameCell.textContent = attemptResult.name;
  nameCell.classList.add('attempt-player-cell');
  rowElement.appendChild(nameCell);
  appendComparisonCell(rowElement, attemptResult.nationality, attemptResult.nationalityMatch);
  appendComparisonCell(rowElement, attemptResult.club, attemptResult.clubMatch);
  appendComparisonCell(rowElement, attemptResult.position, attemptResult.positionMatch);
  appendComparisonCell(rowElement, String(attemptResult.age), attemptResult.ageComparison);
  appendComparisonCell(rowElement, String(attemptResult.overall), attemptResult.overallComparison);
  appendComparisonCell(rowElement, attemptResult.heightCm + ' cm', attemptResult.heightComparison);
  attemptsBoardBody.insertBefore(rowElement, attemptsBoardBody.firstChild);
}

function clearAttemptsBoard() {
  clearElementChildren(attemptsBoardBody);
}

function createAutocompleteItem(player, onSelect) {
  var itemElement = document.createElement('li');
  var flagImg = document.createElement('img');
  var nameSpan = document.createElement('span');
  var handleClick = function handleClick() {
    onSelect(player);
  };
  flagImg.src = player.flag;
  flagImg.alt = player.nationality;
  flagImg.className = 'autocomplete-flag';
  nameSpan.textContent = player.name + ' (' + player.club + ')';
  itemElement.className = 'autocomplete-item';
  itemElement.appendChild(flagImg);
  itemElement.appendChild(nameSpan);
  itemElement.addEventListener('click', handleClick);
  return itemElement;
}

function renderAutocompleteResults(players, onSelect) {
  var itemIndex = 0;
  var currentPlayer = null;
  var itemElement = null;
  clearElementChildren(autocompleteList);
  if (players.length === 0) {
    autocompleteList.classList.add('hidden');
    return;
  }
  for (itemIndex = 0; itemIndex < players.length; itemIndex = itemIndex + 1) {
    currentPlayer = players[itemIndex];
    itemElement = createAutocompleteItem(currentPlayer, onSelect);
    autocompleteList.appendChild(itemElement);
  }
  autocompleteList.classList.remove('hidden');
}

function hideAutocompleteResults() {
  autocompleteList.classList.add('hidden');
  clearElementChildren(autocompleteList);
}

function updateHintPhotoBlur(attemptsUsed) {
  var blurStep = attemptsUsed;
  if (blurStep > 8) {
    blurStep = 8;
  }
  hintPhotoImg.className = 'hint-photo blur-step-' + blurStep;
}

function showHintPhotoSection(photoUrl) {
  hintPhotoImg.src = photoUrl;
  hintPhotoImg.className = 'hint-photo blur-step-0';
  hintPhotoSection.classList.remove('hidden');
}

function hideHintPhotoSection() {
  hintPhotoSection.classList.add('hidden');
}

function showExtraHintsPanel() {
  extraHintAge.textContent = 'Edad: ?';
  extraHintOverall.textContent = 'Overall: ?';
  extraHintHeight.textContent = 'Altura: ?';
  extraHintsPanel.classList.remove('hidden');
}

function hideExtraHintsPanel() {
  extraHintsPanel.classList.add('hidden');
}

function updateExtraHints(attemptsUsed, secretPlayer) {
  if (attemptsUsed >= 2) {
    extraHintAge.textContent = 'Edad: ' + secretPlayer.age;
  }
  if (attemptsUsed >= 4) {
    extraHintOverall.textContent = 'Overall: ' + secretPlayer.overall;
  }
  if (attemptsUsed >= 6) {
    extraHintHeight.textContent = 'Altura: ' + secretPlayer.heightCm + ' cm';
  }
}

function getAudioContext() {
  if (audioContextRef === null) {
    audioContextRef = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContextRef;
}

function playTone(frequency, durationMs) {
  var context = getAudioContext();
  var oscillator = context.createOscillator();
  var gainNode = context.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  gainNode.gain.value = 0.08;
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + durationMs / 1000);
}

function playMatchSound() {
  playTone(660, 150);
}

function playWinSound() {
  playTone(523, 150);
  window.setTimeout(function playSecondNote() {
    playTone(784, 250);
  }, 160);
}

function playLoseSound() {
  playTone(220, 400);
}

function applyTheme(themeName) {
  if (themeName === 'light') {
    document.body.classList.add('theme-light');
    themeToggleBtn.textContent = '☀️';
  } else {
    document.body.classList.remove('theme-light');
    themeToggleBtn.textContent = '🌙';
  }
}

function toggleTheme() {
  var isLight = document.body.classList.contains('theme-light');
  var newTheme = isLight ? 'dark' : 'light';
  applyTheme(newTheme);
  window.localStorage.setItem(THEME_STORAGE_KEY, newTheme);
}

function loadStoredTheme() {
  var storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme !== null) {
    applyTheme(storedTheme);
  }
}
