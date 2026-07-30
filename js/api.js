'use strict';

var URL_BASE_API = 'https://futbolle-daw-uai-2026.onrender.com';
var URL_JUGADOR_ALEATORIO = URL_BASE_API + '/api/players/random';
var URL_BUSQUEDA_JUGADORES = URL_BASE_API + '/api/players/search';

function analizarRespuestaJson(respuesta) {
  if (respuesta.ok !== true) {
    throw new Error('La respuesta del servidor no fue exitosa (' + respuesta.status + ').');
  }
  return respuesta.json();
}

function obtenerJugadorAleatorio(alExito, alError) {
  var manejarDatosJugador = function manejarDatosJugador(datosJugador) {
    alExito(datosJugador);
  };
  var manejarErrorPeticion = function manejarErrorPeticion(error) {
    alError(error);
  };
  fetch(URL_JUGADOR_ALEATORIO)
    .then(analizarRespuestaJson)
    .then(manejarDatosJugador)
    .catch(manejarErrorPeticion);
}

function construirUrlBusqueda(consulta, limite) {
  var consultaCodificada = encodeURIComponent(consulta);
  return URL_BUSQUEDA_JUGADORES + '?q=' + consultaCodificada + '&limit=' + limite;
}

function buscarJugadores(consulta, limite, alExito, alError) {
  var urlBusqueda = construirUrlBusqueda(consulta, limite);
  var manejarDatosJugadores = function manejarDatosJugadores(datosJugadores) {
    alExito(datosJugadores);
  };
  var manejarErrorPeticion = function manejarErrorPeticion(error) {
    alError(error);
  };
  fetch(urlBusqueda)
    .then(analizarRespuestaJson)
    .then(manejarDatosJugadores)
    .catch(manejarErrorPeticion);
}
