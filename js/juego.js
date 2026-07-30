'use strict';

var INTENTOS_MAXIMOS = 8;
var PUNTAJE_BASE_POR_DIFICULTAD = { facil: 60, medio: 80, dificil: 100 };
var estadoJuego = {
  jugadorSecreto: null,
  intentosUsados: 0,
  idsIntentados: [],
  dificultad: 'medio',
  nombreJugador: '',
  idIntervaloTiempo: null,
  segundosTranscurridos: 0,
  tiempoIniciado: false,
  juegoTerminado: false
};

function compararAtributo(valorIntento, valorSecreto) {
  if (valorIntento === valorSecreto) {
    return 'coincide';
  }
  return 'no-coincide';
}

function compararAtributoNumerico(valorIntento, valorSecreto) {
  if (valorIntento === valorSecreto) {
    return 'coincide';
  }
  if (valorSecreto > valorIntento) {
    return 'mayor';
  }
  return 'menor';
}

function construirResultadoIntento(jugadorIntentado) {
  var jugadorSecreto = estadoJuego.jugadorSecreto;
  var resultadoIntento = {
    id: jugadorIntentado.id,
    nombre: jugadorIntentado.name,
    nacionalidad: jugadorIntentado.nationality,
    coincidenciaNacionalidad: compararAtributo(jugadorIntentado.nationality, jugadorSecreto.nationality),
    club: jugadorIntentado.club,
    coincidenciaClub: compararAtributo(jugadorIntentado.club, jugadorSecreto.club),
    posicion: jugadorIntentado.position,
    coincidenciaPosicion: compararAtributo(jugadorIntentado.position, jugadorSecreto.position),
    edad: jugadorIntentado.age,
    comparacionEdad: compararAtributoNumerico(jugadorIntentado.age, jugadorSecreto.age),
    valoracion: jugadorIntentado.overall,
    comparacionValoracion: compararAtributoNumerico(jugadorIntentado.overall, jugadorSecreto.overall),
    alturaCm: jugadorIntentado.heightCm,
    comparacionAltura: compararAtributoNumerico(jugadorIntentado.heightCm, jugadorSecreto.heightCm)
  };
  return resultadoIntento;
}

function calcularPuntaje(dificultad, intentosUsados, segundosTranscurridos) {
  var puntajeBase = PUNTAJE_BASE_POR_DIFICULTAD[dificultad];
  var penalizacionIntentos = (intentosUsados - 1) * 10;
  var bonusTiempo = 0;
  var puntajeFinal = 0;
  if (segundosTranscurridos < 60) {
    bonusTiempo = 20;
  } else if (segundosTranscurridos < 120) {
    bonusTiempo = 10;
  }
  puntajeFinal = puntajeBase - penalizacionIntentos + bonusTiempo;
  if (puntajeFinal < 10) {
    puntajeFinal = 10;
  }
  return puntajeFinal;
}

function formatearEtiquetaFecha(objetoFecha) {
  var dia = objetoFecha.getDate() < 10 ? '0' + objetoFecha.getDate() : String(objetoFecha.getDate());
  var mes = objetoFecha.getMonth() + 1 < 10 ? '0' + (objetoFecha.getMonth() + 1) : String(objetoFecha.getMonth() + 1);
  var anio = objetoFecha.getFullYear();
  var horas = objetoFecha.getHours() < 10 ? '0' + objetoFecha.getHours() : String(objetoFecha.getHours());
  var minutos = objetoFecha.getMinutes() < 10 ? '0' + objetoFecha.getMinutes() : String(objetoFecha.getMinutes());
  return dia + '/' + mes + '/' + anio + ' ' + horas + ':' + minutos;
}

function finalizarPartida(resultado, puntaje) {
  var fechaActual = new Date();
  var registro = {
    nombreJugador: estadoJuego.nombreJugador,
    resultado: resultado,
    intentos: estadoJuego.intentosUsados,
    puntaje: puntaje,
    marcaTiempo: fechaActual.getTime(),
    etiquetaFecha: formatearEtiquetaFecha(fechaActual),
    duracionSegundos: estadoJuego.segundosTranscurridos
  };
  estadoJuego.juegoTerminado = true;
  detenerTiempo();
  guardarResultadoPartida(registro);
}

function manejarVictoria() {
  var puntaje = calcularPuntaje(estadoJuego.dificultad, estadoJuego.intentosUsados, estadoJuego.segundosTranscurridos);
  finalizarPartida('ganado', puntaje);
  reproducirSonidoVictoria();
  tituloModalResultado.textContent = '¡Ganaste!';
  mensajeModalResultado.textContent = 'Adivinaste a ' + estadoJuego.jugadorSecreto.name + ' en ' + estadoJuego.intentosUsados + ' intento(s). Puntaje: ' + puntaje + '.';
  jugadorSecretoResultado.classList.add('oculto');
  mostrarModal(fondoModalResultado);
}

function manejarDerrota() {
  finalizarPartida('perdido', 0);
  reproducirSonidoDerrota();
  tituloModalResultado.textContent = 'Perdiste';
  mensajeModalResultado.textContent = 'Se agotaron los intentos. El jugador secreto era:';
  fotoJugadorResultado.src = estadoJuego.jugadorSecreto.photo;
  nombreJugadorResultado.textContent = estadoJuego.jugadorSecreto.name;
  jugadorSecretoResultado.classList.remove('oculto');
  mostrarModal(fondoModalResultado);
}

function avanzarTiempo() {
  estadoJuego.segundosTranscurridos = estadoJuego.segundosTranscurridos + 1;
  actualizarPantallaTiempo(estadoJuego.segundosTranscurridos);
}

function iniciarTiempo() {
  if (estadoJuego.tiempoIniciado === true) {
    return;
  }
  estadoJuego.tiempoIniciado = true;
  estadoJuego.idIntervaloTiempo = window.setInterval(avanzarTiempo, 1000);
}

function detenerTiempo() {
  if (estadoJuego.idIntervaloTiempo !== null) {
    window.clearInterval(estadoJuego.idIntervaloTiempo);
    estadoJuego.idIntervaloTiempo = null;
  }
}

function actualizarPistasSegunDificultad() {
  if (estadoJuego.dificultad === 'facil') {
    mostrarFotoPista(estadoJuego.jugadorSecreto.photo);
    ocultarPanelPistasExtra();
  } else if (estadoJuego.dificultad === 'medio') {
    ocultarFotoPista();
    mostrarPanelPistasExtra();
  } else {
    ocultarFotoPista();
    ocultarPanelPistasExtra();
  }
}

function registrarIntento(jugadorIntentado) {
  var resultadoIntento = null;
  var intentosRestantes = 0;
  if (estadoJuego.juegoTerminado === true) {
    return;
  }
  if (estadoJuego.idsIntentados.indexOf(jugadorIntentado.id) !== -1) {
    mostrarModalError('Ya usaste ese nombre en esta partida. Probá con otro jugador.');
    return;
  }
  iniciarTiempo();
  estadoJuego.intentosUsados = estadoJuego.intentosUsados + 1;
  estadoJuego.idsIntentados.push(jugadorIntentado.id);
  resultadoIntento = construirResultadoIntento(jugadorIntentado);
  renderizarFilaIntento(resultadoIntento);
  intentosRestantes = INTENTOS_MAXIMOS - estadoJuego.intentosUsados;
  actualizarContadorIntentos(intentosRestantes);
  if (estadoJuego.dificultad === 'facil') {
    actualizarDesenfoqueFoto(estadoJuego.intentosUsados);
  } else if (estadoJuego.dificultad === 'medio') {
    actualizarPistasExtra(estadoJuego.intentosUsados, estadoJuego.jugadorSecreto);
  }
  if (jugadorIntentado.id === estadoJuego.jugadorSecreto.id) {
    manejarVictoria();
    return;
  }
  reproducirSonidoAcierto();
  if (estadoJuego.intentosUsados >= INTENTOS_MAXIMOS) {
    manejarDerrota();
  }
}

function reiniciarTableroUi() {
  vaciarTableroIntentos();
  actualizarContadorIntentos(INTENTOS_MAXIMOS);
  actualizarPantallaTiempo(0);
  ocultarAutocompletado();
  entradaBusqueda.value = '';
}

function comenzarPartidaConJugadorSecreto(jugadorSecreto) {
  estadoJuego.jugadorSecreto = jugadorSecreto;
  estadoJuego.intentosUsados = 0;
  estadoJuego.idsIntentados = [];
  estadoJuego.segundosTranscurridos = 0;
  estadoJuego.tiempoIniciado = false;
  estadoJuego.juegoTerminado = false;
  reiniciarTableroUi();
  actualizarPistasSegunDificultad();
}

function manejarErrorCargaJugador(error) {
  mostrarModalError('No se pudo obtener un jugador secreto. Verificá tu conexión e intentá nuevamente.');
}

function cargarJugadorSecretoYComenzar() {
  obtenerJugadorAleatorio(comenzarPartidaConJugadorSecreto, manejarErrorCargaJugador);
}

function iniciarNuevaPartida(nombreJugador, dificultad) {
  estadoJuego.nombreJugador = nombreJugador;
  estadoJuego.dificultad = dificultad;
  detenerTiempo();
  cargarJugadorSecretoYComenzar();
}

function reiniciarPartida() {
  estadoJuego.dificultad = selectorDificultad.value;
  detenerTiempo();
  cargarJugadorSecretoYComenzar();
}
