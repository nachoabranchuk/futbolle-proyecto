'use strict';

var HISTORY_STORAGE_KEY = 'futbolleHistory';

function loadHistoryRecords() {
  var storedValue = window.localStorage.getItem(HISTORY_STORAGE_KEY);
  if (storedValue === null) {
    return [];
  }
  return JSON.parse(storedValue);
}

function saveGameResult(record) {
  var records = loadHistoryRecords();
  records.push(record);
  window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(records));
}

function compareRecordsByDate(recordA, recordB) {
  if (recordA.timestamp < recordB.timestamp) {
    return 1;
  }
  if (recordA.timestamp > recordB.timestamp) {
    return -1;
  }
  return 0;
}

function compareRecordsByAttempts(recordA, recordB) {
  return recordA.attempts - recordB.attempts;
}

function sortHistoryRecords(records, sortBy) {
  var sortedRecords = records.slice();
  if (sortBy === 'intentos') {
    sortedRecords.sort(compareRecordsByAttempts);
  } else {
    sortedRecords.sort(compareRecordsByDate);
  }
  return sortedRecords;
}

function createHistoryRow(record) {
  var rowElement = document.createElement('tr');
  var nameCell = document.createElement('td');
  var resultCell = document.createElement('td');
  var attemptsCell = document.createElement('td');
  var scoreCell = document.createElement('td');
  var dateCell = document.createElement('td');
  var durationCell = document.createElement('td');
  nameCell.textContent = record.playerName;
  resultCell.textContent = record.result === 'ganado' ? 'Ganó' : 'Perdió';
  attemptsCell.textContent = String(record.attempts);
  scoreCell.textContent = String(record.score);
  dateCell.textContent = record.dateLabel;
  durationCell.textContent = formatTime(record.durationSeconds);
  rowElement.appendChild(nameCell);
  rowElement.appendChild(resultCell);
  rowElement.appendChild(attemptsCell);
  rowElement.appendChild(scoreCell);
  rowElement.appendChild(dateCell);
  rowElement.appendChild(durationCell);
  return rowElement;
}

function renderHistoryTable(records) {
  var recordIndex = 0;
  var rowElement = null;
  clearElementChildren(historyTableBody);
  if (records.length === 0) {
    rowElement = document.createElement('tr');
    var emptyCell = document.createElement('td');
    emptyCell.textContent = 'Todavía no jugaste ninguna partida.';
    emptyCell.setAttribute('colspan', '6');
    rowElement.appendChild(emptyCell);
    historyTableBody.appendChild(rowElement);
    return;
  }
  for (recordIndex = 0; recordIndex < records.length; recordIndex = recordIndex + 1) {
    rowElement = createHistoryRow(records[recordIndex]);
    historyTableBody.appendChild(rowElement);
  }
}

function openHistoryModal() {
  var records = loadHistoryRecords();
  var sortedRecords = sortHistoryRecords(records, historySortSelect.value);
  renderHistoryTable(sortedRecords);
  showModal(historyModalOverlay);
}
