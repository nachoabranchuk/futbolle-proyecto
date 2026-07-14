'use strict';

var SEARCH_DEBOUNCE_MS = 300;
var searchDebounceTimerId = null;

function handleAutocompleteSelect(player) {
  searchInput.value = '';
  hideAutocompleteResults();
  registerAttempt(player);
}

function handleSearchResultsSuccess(players) {
  renderAutocompleteResults(players, handleAutocompleteSelect);
}

function handleSearchResultsError(error) {
  hideAutocompleteResults();
}

function runPlayerSearch() {
  var query = searchInput.value.trim();
  if (query.length < 2) {
    hideAutocompleteResults();
    return;
  }
  fetchSearchPlayers(query, 8, handleSearchResultsSuccess, handleSearchResultsError);
}

function handleSearchInputChange() {
  if (searchDebounceTimerId !== null) {
    window.clearTimeout(searchDebounceTimerId);
  }
  searchDebounceTimerId = window.setTimeout(runPlayerSearch, SEARCH_DEBOUNCE_MS);
}

function handleDocumentClick(clickEvent) {
  var isClickInsideWrapper = searchInput.contains(clickEvent.target) || autocompleteList.contains(clickEvent.target);
  if (isClickInsideWrapper === false) {
    hideAutocompleteResults();
  }
}

function validateStartName(nameValue) {
  var trimmedName = nameValue.trim();
  if (trimmedName.length < 3) {
    return 'El nombre debe tener al menos 3 letras.';
  }
  return '';
}

function handleStartBeginClick() {
  var nameValue = startNameInput.value;
  var validationMessage = validateStartName(nameValue);
  if (validationMessage !== '') {
    startNameError.textContent = validationMessage;
    return;
  }
  startNameError.textContent = '';
  hideModal(startModalOverlay);
  difficultySelect.value = startDifficultySelect.value;
  startNewGame(nameValue.trim(), startDifficultySelect.value);
}

function handleRestartClick() {
  restartGame();
}

function handleHistoryClick() {
  openHistoryModal();
}

function handleHistorySortChange() {
  var records = loadHistoryRecords();
  var sortedRecords = sortHistoryRecords(records, historySortSelect.value);
  renderHistoryTable(sortedRecords);
}

function handleThemeToggleClick() {
  toggleTheme();
}

function handleResultModalCloseClick() {
  hideModal(resultModalOverlay);
}

function handleResultModalRestartClick() {
  hideModal(resultModalOverlay);
  restartGame();
}

function handleErrorModalCloseClick() {
  hideModal(errorModalOverlay);
}

function handleHistoryModalCloseClick() {
  hideModal(historyModalOverlay);
}

function initializeApplication() {
  loadStoredTheme();
  searchInput.addEventListener('input', handleSearchInputChange);
  document.addEventListener('click', handleDocumentClick);
  startBeginBtn.addEventListener('click', handleStartBeginClick);
  restartBtn.addEventListener('click', handleRestartClick);
  historyBtn.addEventListener('click', handleHistoryClick);
  historySortSelect.addEventListener('change', handleHistorySortChange);
  themeToggleBtn.addEventListener('click', handleThemeToggleClick);
  resultModalCloseBtn.addEventListener('click', handleResultModalCloseClick);
  resultModalRestartBtn.addEventListener('click', handleResultModalRestartClick);
  errorModalCloseBtn.addEventListener('click', handleErrorModalCloseClick);
  historyModalCloseBtn.addEventListener('click', handleHistoryModalCloseClick);
}

document.addEventListener('DOMContentLoaded', initializeApplication);
