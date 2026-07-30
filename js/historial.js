'use strict';

var CLAVE_ALMACENAMIENTO_HISTORIAL = 'futbolleHistorial';

function cargarRegistrosHistorial() {
  var valorGuardado = window.localStorage.getItem(CLAVE_ALMACENAMIENTO_HISTORIAL);
  if (valorGuardado === null) {
    return [];
  }
  return JSON.parse(valorGuardado);
}

function guardarResultadoPartida(registro) {
  var registros = cargarRegistrosHistorial();
  registros.push(registro);
  window.localStorage.setItem(CLAVE_ALMACENAMIENTO_HISTORIAL, JSON.stringify(registros));
}

function compararRegistrosPorFecha(registroA, registroB) {
  if (registroA.marcaTiempo < registroB.marcaTiempo) {
    return 1;
  }
  if (registroA.marcaTiempo > registroB.marcaTiempo) {
    return -1;
  }
  return 0;
}

function compararRegistrosPorIntentos(registroA, registroB) {
  return registroA.intentos - registroB.intentos;
}

function ordenarRegistrosHistorial(registros, ordenarPor) {
  var registrosOrdenados = registros.slice();
  if (ordenarPor === 'intentos') {
    registrosOrdenados.sort(compararRegistrosPorIntentos);
  } else {
    registrosOrdenados.sort(compararRegistrosPorFecha);
  }
  return registrosOrdenados;
}

function crearFilaHistorial(registro) {
  var elementoFila = document.createElement('tr');
  var celdaNombre = document.createElement('td');
  var celdaResultado = document.createElement('td');
  var celdaIntentos = document.createElement('td');
  var celdaPuntaje = document.createElement('td');
  var celdaFecha = document.createElement('td');
  var celdaDuracion = document.createElement('td');
  celdaNombre.textContent = registro.nombreJugador;
  celdaResultado.textContent = registro.resultado === 'ganado' ? 'Ganó' : 'Perdió';
  celdaIntentos.textContent = String(registro.intentos);
  celdaPuntaje.textContent = String(registro.puntaje);
  celdaFecha.textContent = registro.etiquetaFecha;
  celdaDuracion.textContent = formatearTiempo(registro.duracionSegundos);
  elementoFila.appendChild(celdaNombre);
  elementoFila.appendChild(celdaResultado);
  elementoFila.appendChild(celdaIntentos);
  elementoFila.appendChild(celdaPuntaje);
  elementoFila.appendChild(celdaFecha);
  elementoFila.appendChild(celdaDuracion);
  return elementoFila;
}

function renderizarTablaHistorial(registros) {
  var indiceRegistro = 0;
  var elementoFila = null;
  var celdaVacia = null;
  vaciarElemento(cuerpoTablaHistorial);
  if (registros.length === 0) {
    elementoFila = document.createElement('tr');
    celdaVacia = document.createElement('td');
    celdaVacia.textContent = 'Todavía no jugaste ninguna partida.';
    celdaVacia.setAttribute('colspan', '6');
    elementoFila.appendChild(celdaVacia);
    cuerpoTablaHistorial.appendChild(elementoFila);
    return;
  }
  for (indiceRegistro = 0; indiceRegistro < registros.length; indiceRegistro = indiceRegistro + 1) {
    elementoFila = crearFilaHistorial(registros[indiceRegistro]);
    cuerpoTablaHistorial.appendChild(elementoFila);
  }
}

function abrirModalHistorial() {
  var registros = cargarRegistrosHistorial();
  var registrosOrdenados = ordenarRegistrosHistorial(registros, selectorOrdenHistorial.value);
  renderizarTablaHistorial(registrosOrdenados);
  mostrarModal(fondoModalHistorial);
}
