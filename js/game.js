'use strict';

var MAX_ATTEMPTS = 8;
var SCORE_BASE_BY_DIFFICULTY = { facil: 60, medio: 80, dificil: 100 };
var gameState = {
  secretPlayer: null,
  attemptsUsed: 0,
  guessedIds: [],
  difficulty: 'medio',
  playerName: '',
  timerIntervalId: null,
  elapsedSeconds: 0,
  timerStarted: false,
  gameOver: false
};

function compareAttribute(guessValue, secretValue) {
  if (guessValue === secretValue) {
    return 'match';
  }
  return 'mismatch';
}

function compareNumericAttribute(guessValue, secretValue) {
  if (guessValue === secretValue) {
    return 'match';
  }
  if (secretValue > guessValue) {
    return 'higher';
  }
  return 'lower';
}

function buildAttemptResult(guessedPlayer) {
  var secretPlayer = gameState.secretPlayer;
  var attemptResult = {
    id: guessedPlayer.id,
    name: guessedPlayer.name,
    nationality: guessedPlayer.nationality,
    nationalityMatch: compareAttribute(guessedPlayer.nationality, secretPlayer.nationality),
    club: guessedPlayer.club,
    clubMatch: compareAttribute(guessedPlayer.club, secretPlayer.club),
    position: guessedPlayer.position,
    positionMatch: compareAttribute(guessedPlayer.position, secretPlayer.position),
    age: guessedPlayer.age,
    ageComparison: compareNumericAttribute(guessedPlayer.age, secretPlayer.age),
    overall: guessedPlayer.overall,
    overallComparison: compareNumericAttribute(guessedPlayer.overall, secretPlayer.overall),
    heightCm: guessedPlayer.heightCm,
    heightComparison: compareNumericAttribute(guessedPlayer.heightCm, secretPlayer.heightCm)
  };
  return attemptResult;
}

function computeScore(difficulty, attemptsUsed, elapsedSeconds) {
  var baseScore = SCORE_BASE_BY_DIFFICULTY[difficulty];
  var attemptsPenalty = (attemptsUsed - 1) * 10;
  var timeBonus = 0;
  var finalScore = 0;
  if (elapsedSeconds < 60) {
    timeBonus = 20;
  } else if (elapsedSeconds < 120) {
    timeBonus = 10;
  }
  finalScore = baseScore - attemptsPenalty + timeBonus;
  if (finalScore < 10) {
    finalScore = 10;
  }
  return finalScore;
}

function formatDateLabel(dateObject) {
  var day = dateObject.getDate() < 10 ? '0' + dateObject.getDate() : String(dateObject.getDate());
  var month = dateObject.getMonth() + 1 < 10 ? '0' + (dateObject.getMonth() + 1) : String(dateObject.getMonth() + 1);
  var year = dateObject.getFullYear();
  var hours = dateObject.getHours() < 10 ? '0' + dateObject.getHours() : String(dateObject.getHours());
  var minutes = dateObject.getMinutes() < 10 ? '0' + dateObject.getMinutes() : String(dateObject.getMinutes());
  return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes;
}

function finishGame(result, score) {
  var nowDate = new Date();
  var record = {
    playerName: gameState.playerName,
    result: result,
    attempts: gameState.attemptsUsed,
    score: score,
    timestamp: nowDate.getTime(),
    dateLabel: formatDateLabel(nowDate),
    durationSeconds: gameState.elapsedSeconds
  };
  gameState.gameOver = true;
  stopTimer();
  saveGameResult(record);
}

function handleWin() {
  var score = computeScore(gameState.difficulty, gameState.attemptsUsed, gameState.elapsedSeconds);
  finishGame('ganado', score);
  playWinSound();
  resultModalTitle.textContent = '¡Ganaste!';
  resultModalMessage.textContent = 'Adivinaste a ' + gameState.secretPlayer.name + ' en ' + gameState.attemptsUsed + ' intento(s). Puntaje: ' + score + '.';
  resultSecretPlayer.classList.add('hidden');
  showModal(resultModalOverlay);
}

function handleLose() {
  finishGame('perdido', 0);
  playLoseSound();
  resultModalTitle.textContent = 'Perdiste';
  resultModalMessage.textContent = 'Se agotaron los intentos. El jugador secreto era:';
  resultPlayerPhoto.src = gameState.secretPlayer.photo;
  resultPlayerName.textContent = gameState.secretPlayer.name;
  resultSecretPlayer.classList.remove('hidden');
  showModal(resultModalOverlay);
}

function tickTimer() {
  gameState.elapsedSeconds = gameState.elapsedSeconds + 1;
  updateTimerDisplay(gameState.elapsedSeconds);
}

function startTimer() {
  if (gameState.timerStarted === true) {
    return;
  }
  gameState.timerStarted = true;
  gameState.timerIntervalId = window.setInterval(tickTimer, 1000);
}

function stopTimer() {
  if (gameState.timerIntervalId !== null) {
    window.clearInterval(gameState.timerIntervalId);
    gameState.timerIntervalId = null;
  }
}

function updateDifficultyHints() {
  if (gameState.difficulty === 'facil') {
    showHintPhotoSection(gameState.secretPlayer.photo);
    hideExtraHintsPanel();
  } else if (gameState.difficulty === 'medio') {
    hideHintPhotoSection();
    showExtraHintsPanel();
  } else {
    hideHintPhotoSection();
    hideExtraHintsPanel();
  }
}

function registerAttempt(guessedPlayer) {
  var attemptResult = null;
  var attemptsRemaining = 0;
  if (gameState.gameOver === true) {
    return;
  }
  if (gameState.guessedIds.indexOf(guessedPlayer.id) !== -1) {
    showErrorModal('Ya usaste ese nombre en esta partida. Probá con otro jugador.');
    return;
  }
  startTimer();
  gameState.attemptsUsed = gameState.attemptsUsed + 1;
  gameState.guessedIds.push(guessedPlayer.id);
  attemptResult = buildAttemptResult(guessedPlayer);
  renderAttemptRow(attemptResult);
  attemptsRemaining = MAX_ATTEMPTS - gameState.attemptsUsed;
  updateAttemptsDisplay(attemptsRemaining);
  if (gameState.difficulty === 'facil') {
    updateHintPhotoBlur(gameState.attemptsUsed);
  } else if (gameState.difficulty === 'medio') {
    updateExtraHints(gameState.attemptsUsed, gameState.secretPlayer);
  }
  if (guessedPlayer.id === gameState.secretPlayer.id) {
    handleWin();
    return;
  }
  playMatchSound();
  if (gameState.attemptsUsed >= MAX_ATTEMPTS) {
    handleLose();
  }
}

function resetBoardUi() {
  clearAttemptsBoard();
  updateAttemptsDisplay(MAX_ATTEMPTS);
  updateTimerDisplay(0);
  hideAutocompleteResults();
  searchInput.value = '';
}

function beginGameWithSecretPlayer(secretPlayer) {
  gameState.secretPlayer = secretPlayer;
  gameState.attemptsUsed = 0;
  gameState.guessedIds = [];
  gameState.elapsedSeconds = 0;
  gameState.timerStarted = false;
  gameState.gameOver = false;
  resetBoardUi();
  updateDifficultyHints();
}

function handleLoadPlayerError(error) {
  showErrorModal('No se pudo obtener un jugador secreto. Verificá tu conexión e intentá nuevamente.');
}

function loadSecretPlayerAndBegin() {
  fetchRandomPlayer(beginGameWithSecretPlayer, handleLoadPlayerError);
}

function startNewGame(playerName, difficulty) {
  gameState.playerName = playerName;
  gameState.difficulty = difficulty;
  stopTimer();
  loadSecretPlayerAndBegin();
}

function restartGame() {
  gameState.difficulty = difficultySelect.value;
  stopTimer();
  loadSecretPlayerAndBegin();
}
