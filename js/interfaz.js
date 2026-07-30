'use strict';

var CLAVE_ALMACENAMIENTO_TEMA = 'futbolleTema';
var botonCambiarTema = document.getElementById('boton-cambiar-tema');
var selectorDificultad = document.getElementById('selector-dificultad');
var contadorIntentosEl = document.getElementById('contador-intentos');
var intentosRestantesTextoEl = document.getElementById('intentos-restantes-texto');
var pantallaTiempoEl = document.getElementById('pantalla-tiempo');
var botonReiniciar = document.getElementById('boton-reiniciar');
var botonHistorial = document.getElementById('boton-historial');
var seccionFotoPista = document.getElementById('seccion-foto-pista');
var imagenFotoPista = document.getElementById('imagen-foto-pista');
var panelPistasExtra = document.getElementById('panel-pistas-extra');
var pistaExtraEdad = document.getElementById('pista-extra-edad');
var pistaExtraValoracion = document.getElementById('pista-extra-valoracion');
var pistaExtraAltura = document.getElementById('pista-extra-altura');
var entradaBusqueda = document.getElementById('entrada-busqueda');
var listaAutocompletado = document.getElementById('lista-autocompletado');
var cuerpoTableroIntentos = document.getElementById('cuerpo-tablero-intentos');
var fondoModalInicio = document.getElementById('fondo-modal-inicio');
var entradaNombreInicio = document.getElementById('entrada-nombre-inicio');
var errorNombreInicio = document.getElementById('error-nombre-inicio');
var selectorDificultadInicio = document.getElementById('selector-dificultad-inicio');
var botonComenzar = document.getElementById('boton-comenzar');
var fondoModalResultado = document.getElementById('fondo-modal-resultado');
var tituloModalResultado = document.getElementById('titulo-modal-resultado');
var mensajeModalResultado = document.getElementById('mensaje-modal-resultado');
var jugadorSecretoResultado = document.getElementById('jugador-secreto-resultado');
var fotoJugadorResultado = document.getElementById('foto-jugador-resultado');
var nombreJugadorResultado = document.getElementById('nombre-jugador-resultado');
var botonCerrarResultado = document.getElementById('boton-cerrar-resultado');
var botonReiniciarResultado = document.getElementById('boton-reiniciar-resultado');
var fondoModalError = document.getElementById('fondo-modal-error');
var mensajeModalError = document.getElementById('mensaje-modal-error');
var botonCerrarError = document.getElementById('boton-cerrar-error');
var fondoModalHistorial = document.getElementById('fondo-modal-historial');
var selectorOrdenHistorial = document.getElementById('selector-orden-historial');
var cuerpoTablaHistorial = document.getElementById('cuerpo-tabla-historial');
var botonCerrarHistorial = document.getElementById('boton-cerrar-historial');
var enlaceGithub = document.getElementById('enlace-github');
var contextoAudioRef = null;
var FOTO_JUGADOR_RESPALDO = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%231d2f24"/><circle cx="50" cy="38" r="18" fill="%232a3b30"/><rect x="20" y="62" width="60" height="30" rx="15" fill="%232a3b30"/></svg>');

function manejarErrorFotoJugador(eventoError) {
  var elementoImagen = eventoError.target;
  elementoImagen.removeEventListener('error', manejarErrorFotoJugador);
  elementoImagen.src = FOTO_JUGADOR_RESPALDO;
}

function mostrarModal(elementoFondo) {
  elementoFondo.classList.remove('oculto');
}

function ocultarModal(elementoFondo) {
  elementoFondo.classList.add('oculto');
}

function mostrarModalError(mensaje) {
  mensajeModalError.textContent = mensaje;
  mostrarModal(fondoModalError);
}

function formatearTiempo(segundosTotales) {
  var minutos = Math.floor(segundosTotales / 60);
  var segundos = segundosTotales % 60;
  var textoMinutos = minutos < 10 ? '0' + minutos : String(minutos);
  var textoSegundos = segundos < 10 ? '0' + segundos : String(segundos);
  return textoMinutos + ':' + textoSegundos;
}

function actualizarPantallaTiempo(segundosTotales) {
  pantallaTiempoEl.textContent = formatearTiempo(segundosTotales);
}

function actualizarContadorIntentos(intentosRestantes) {
  contadorIntentosEl.textContent = String(intentosRestantes);
  intentosRestantesTextoEl.textContent = String(intentosRestantes);
}

function vaciarElemento(elemento) {
  while (elemento.firstChild) {
    elemento.removeChild(elemento.firstChild);
  }
}

function obtenerClaseComparacion(comparacion) {
  if (comparacion === 'coincide') {
    return 'celda-coincide';
  }
  if (comparacion === 'mayor') {
    return 'celda-mayor';
  }
  if (comparacion === 'menor') {
    return 'celda-menor';
  }
  return 'celda-no-coincide';
}

function agregarCeldaComparacion(elementoFila, textoMostrado, comparacion) {
  var elementoCelda = document.createElement('td');
  elementoCelda.textContent = textoMostrado;
  elementoCelda.classList.add(obtenerClaseComparacion(comparacion));
  elementoFila.appendChild(elementoCelda);
}

function renderizarFilaIntento(resultadoIntento) {
  var elementoFila = document.createElement('tr');
  var celdaNombre = document.createElement('td');
  celdaNombre.textContent = resultadoIntento.nombre;
  celdaNombre.classList.add('celda-jugador-intento');
  elementoFila.appendChild(celdaNombre);
  agregarCeldaComparacion(elementoFila, resultadoIntento.nacionalidad, resultadoIntento.coincidenciaNacionalidad);
  agregarCeldaComparacion(elementoFila, resultadoIntento.club, resultadoIntento.coincidenciaClub);
  agregarCeldaComparacion(elementoFila, resultadoIntento.posicion, resultadoIntento.coincidenciaPosicion);
  agregarCeldaComparacion(elementoFila, String(resultadoIntento.edad), resultadoIntento.comparacionEdad);
  agregarCeldaComparacion(elementoFila, String(resultadoIntento.valoracion), resultadoIntento.comparacionValoracion);
  agregarCeldaComparacion(elementoFila, resultadoIntento.alturaCm + ' cm', resultadoIntento.comparacionAltura);
  cuerpoTableroIntentos.insertBefore(elementoFila, cuerpoTableroIntentos.firstChild);
}

function vaciarTableroIntentos() {
  vaciarElemento(cuerpoTableroIntentos);
}

function crearItemAutocompletado(jugador, alSeleccionar) {
  var elementoItem = document.createElement('li');
  var imagenBandera = document.createElement('img');
  var textoNombre = document.createElement('span');
  var manejarClic = function manejarClic() {
    alSeleccionar(jugador);
  };
  imagenBandera.src = jugador.flag;
  imagenBandera.alt = jugador.nationality;
  imagenBandera.className = 'bandera-autocompletado';
  imagenBandera.referrerPolicy = 'no-referrer';
  imagenBandera.addEventListener('error', manejarErrorFotoJugador);
  textoNombre.textContent = jugador.name + ' (' + jugador.club + ')';
  elementoItem.className = 'item-autocompletado';
  elementoItem.appendChild(imagenBandera);
  elementoItem.appendChild(textoNombre);
  elementoItem.addEventListener('click', manejarClic);
  return elementoItem;
}

function renderizarResultadosAutocompletado(jugadores, alSeleccionar) {
  var indiceItem = 0;
  var jugadorActual = null;
  var elementoItem = null;
  vaciarElemento(listaAutocompletado);
  if (jugadores.length === 0) {
    listaAutocompletado.classList.add('oculto');
    return;
  }
  for (indiceItem = 0; indiceItem < jugadores.length; indiceItem = indiceItem + 1) {
    jugadorActual = jugadores[indiceItem];
    elementoItem = crearItemAutocompletado(jugadorActual, alSeleccionar);
    listaAutocompletado.appendChild(elementoItem);
  }
  listaAutocompletado.classList.remove('oculto');
}

function ocultarAutocompletado() {
  listaAutocompletado.classList.add('oculto');
  vaciarElemento(listaAutocompletado);
}

function actualizarDesenfoqueFoto(intentosUsados) {
  var pasoDesenfoque = intentosUsados;
  if (pasoDesenfoque > 8) {
    pasoDesenfoque = 8;
  }
  imagenFotoPista.className = 'foto-pista paso-desenfoque-' + pasoDesenfoque;
}

function mostrarFotoPista(urlFoto) {
  imagenFotoPista.referrerPolicy = 'no-referrer';
  imagenFotoPista.src = urlFoto;
  imagenFotoPista.className = 'foto-pista paso-desenfoque-0';
  seccionFotoPista.classList.remove('oculto');
}

function ocultarFotoPista() {
  seccionFotoPista.classList.add('oculto');
}

function mostrarPanelPistasExtra() {
  pistaExtraEdad.textContent = 'Edad: ?';
  pistaExtraValoracion.textContent = 'Overall: ?';
  pistaExtraAltura.textContent = 'Altura: ?';
  panelPistasExtra.classList.remove('oculto');
}

function ocultarPanelPistasExtra() {
  panelPistasExtra.classList.add('oculto');
}

function actualizarPistasExtra(intentosUsados, jugadorSecreto) {
  if (intentosUsados >= 2) {
    pistaExtraEdad.textContent = 'Edad: ' + jugadorSecreto.age;
  }
  if (intentosUsados >= 4) {
    pistaExtraValoracion.textContent = 'Overall: ' + jugadorSecreto.overall;
  }
  if (intentosUsados >= 6) {
    pistaExtraAltura.textContent = 'Altura: ' + jugadorSecreto.heightCm + ' cm';
  }
}

function obtenerContextoAudio() {
  if (contextoAudioRef === null) {
    contextoAudioRef = new (window.AudioContext || window.webkitAudioContext)();
  }
  return contextoAudioRef;
}

function reproducirTono(frecuencia, duracionMs) {
  var contexto = obtenerContextoAudio();
  var oscilador = contexto.createOscillator();
  var nodoGanancia = contexto.createGain();
  oscilador.type = 'sine';
  oscilador.frequency.value = frecuencia;
  nodoGanancia.gain.value = 0.08;
  oscilador.connect(nodoGanancia);
  nodoGanancia.connect(contexto.destination);
  oscilador.start();
  oscilador.stop(contexto.currentTime + duracionMs / 1000);
}

function reproducirSonidoAcierto() {
  reproducirTono(660, 150);
}

function reproducirSonidoVictoria() {
  reproducirTono(523, 150);
  window.setTimeout(function reproducirSegundaNota() {
    reproducirTono(784, 250);
  }, 160);
}

function reproducirSonidoDerrota() {
  reproducirTono(220, 400);
}

function aplicarTema(nombreTema) {
  if (nombreTema === 'claro') {
    document.body.classList.add('tema-claro');
    botonCambiarTema.textContent = '☀️';
  } else {
    document.body.classList.remove('tema-claro');
    botonCambiarTema.textContent = '🌙';
  }
}

function cambiarTema() {
  var esClaro = document.body.classList.contains('tema-claro');
  var nuevoTema = esClaro ? 'oscuro' : 'claro';
  aplicarTema(nuevoTema);
  window.localStorage.setItem(CLAVE_ALMACENAMIENTO_TEMA, nuevoTema);
}

function cargarTemaGuardado() {
  var temaGuardado = window.localStorage.getItem(CLAVE_ALMACENAMIENTO_TEMA);
  if (temaGuardado !== null) {
    aplicarTema(temaGuardado);
  }
}

function configurarRespaldoImagenes() {
  imagenFotoPista.referrerPolicy = 'no-referrer';
  imagenFotoPista.addEventListener('error', manejarErrorFotoJugador);
  fotoJugadorResultado.referrerPolicy = 'no-referrer';
  fotoJugadorResultado.addEventListener('error', manejarErrorFotoJugador);
}

configurarRespaldoImagenes();
