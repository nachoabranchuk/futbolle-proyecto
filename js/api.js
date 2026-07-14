'use strict';

var API_BASE_URL = 'https://futbolle-daw-uai-2026.onrender.com';
var API_RANDOM_URL = API_BASE_URL + '/api/players/random';
var API_SEARCH_URL = API_BASE_URL + '/api/players/search';

function parseJsonResponse(response) {
  if (response.ok !== true) {
    throw new Error('La respuesta del servidor no fue exitosa (' + response.status + ').');
  }
  return response.json();
}

function fetchRandomPlayer(onSuccess, onError) {
  var handlePlayerData = function handlePlayerData(playerData) {
    onSuccess(playerData);
  };
  var handleFetchError = function handleFetchError(error) {
    onError(error);
  };
  fetch(API_RANDOM_URL)
    .then(parseJsonResponse)
    .then(handlePlayerData)
    .catch(handleFetchError);
}

function buildSearchUrl(query, limit) {
  var encodedQuery = encodeURIComponent(query);
  return API_SEARCH_URL + '?q=' + encodedQuery + '&limit=' + limit;
}

function fetchSearchPlayers(query, limit, onSuccess, onError) {
  var searchUrl = buildSearchUrl(query, limit);
  var handlePlayersData = function handlePlayersData(playersData) {
    onSuccess(playersData);
  };
  var handleFetchError = function handleFetchError(error) {
    onError(error);
  };
  fetch(searchUrl)
    .then(parseJsonResponse)
    .then(handlePlayersData)
    .catch(handleFetchError);
}
