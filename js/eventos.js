'use strict';

var RETRASO_BUSQUEDA_MS = 300;
var idTemporizadorBusqueda = null;

function manejarSeleccionAutocompletado(jugador) {
  entradaBusqueda.value = '';
  ocultarAutocompletado();
  registrarIntento(jugador);
}

function manejarExitoBusqueda(jugadores) {
  renderizarResultadosAutocompletado(jugadores, manejarSeleccionAutocompletado);
}

function manejarErrorBusqueda(error) {
  ocultarAutocompletado();
}

function ejecutarBusquedaJugador() {
  var consulta = entradaBusqueda.value.trim();
  if (consulta.length < 2) {
    ocultarAutocompletado();
    return;
  }
  buscarJugadores(consulta, 8, manejarExitoBusqueda, manejarErrorBusqueda);
}

function manejarCambioEntradaBusqueda() {
  if (idTemporizadorBusqueda !== null) {
    window.clearTimeout(idTemporizadorBusqueda);
  }
  idTemporizadorBusqueda = window.setTimeout(ejecutarBusquedaJugador, RETRASO_BUSQUEDA_MS);
}

function manejarClicDocumento(eventoClic) {
  var clicDentroDelContenedor = entradaBusqueda.contains(eventoClic.target) || listaAutocompletado.contains(eventoClic.target);
  if (clicDentroDelContenedor === false) {
    ocultarAutocompletado();
  }
}

function validarNombreInicio(valorNombre) {
  var nombreLimpio = valorNombre.trim();
  if (nombreLimpio.length < 3) {
    return 'El nombre debe tener al menos 3 letras.';
  }
  return '';
}

function manejarClicComenzar() {
  var valorNombre = entradaNombreInicio.value;
  var mensajeValidacion = validarNombreInicio(valorNombre);
  if (mensajeValidacion !== '') {
    errorNombreInicio.textContent = mensajeValidacion;
    return;
  }
  errorNombreInicio.textContent = '';
  ocultarModal(fondoModalInicio);
  selectorDificultad.value = selectorDificultadInicio.value;
  iniciarNuevaPartida(valorNombre.trim(), selectorDificultadInicio.value);
}

function manejarClicReiniciar() {
  reiniciarPartida();
}

function manejarClicHistorial() {
  abrirModalHistorial();
}

function manejarCambioOrdenHistorial() {
  var registros = cargarRegistrosHistorial();
  var registrosOrdenados = ordenarRegistrosHistorial(registros, selectorOrdenHistorial.value);
  renderizarTablaHistorial(registrosOrdenados);
}

function manejarClicCambiarTema() {
  cambiarTema();
}

function manejarClicCerrarResultado() {
  ocultarModal(fondoModalResultado);
}

function manejarClicReiniciarDesdeResultado() {
  ocultarModal(fondoModalResultado);
  reiniciarPartida();
}

function manejarClicCerrarError() {
  ocultarModal(fondoModalError);
}

function manejarClicCerrarHistorial() {
  ocultarModal(fondoModalHistorial);
}

function inicializarAplicacion() {
  cargarTemaGuardado();
  entradaBusqueda.addEventListener('input', manejarCambioEntradaBusqueda);
  document.addEventListener('click', manejarClicDocumento);
  botonComenzar.addEventListener('click', manejarClicComenzar);
  botonReiniciar.addEventListener('click', manejarClicReiniciar);
  botonHistorial.addEventListener('click', manejarClicHistorial);
  selectorOrdenHistorial.addEventListener('change', manejarCambioOrdenHistorial);
  botonCambiarTema.addEventListener('click', manejarClicCambiarTema);
  botonCerrarResultado.addEventListener('click', manejarClicCerrarResultado);
  botonReiniciarResultado.addEventListener('click', manejarClicReiniciarDesdeResultado);
  botonCerrarError.addEventListener('click', manejarClicCerrarError);
  botonCerrarHistorial.addEventListener('click', manejarClicCerrarHistorial);
}

document.addEventListener('DOMContentLoaded', inicializarAplicacion);
