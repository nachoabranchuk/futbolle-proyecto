'use strict';

var CLAVE_ALMACENAMIENTO_TEMA = 'futbolleTema';
var EXPRESION_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var EXPRESION_ALFANUMERICA = /^[a-zA-ZÀ-ÿ0-9\s]+$/;
var botonCambiarTema = document.getElementById('boton-cambiar-tema');
var formularioContacto = document.getElementById('formulario-contacto');
var entradaNombreContacto = document.getElementById('entrada-nombre-contacto');
var errorNombreContacto = document.getElementById('error-nombre-contacto');
var entradaEmailContacto = document.getElementById('entrada-email-contacto');
var errorEmailContacto = document.getElementById('error-email-contacto');
var entradaMensajeContacto = document.getElementById('entrada-mensaje-contacto');
var errorMensajeContacto = document.getElementById('error-mensaje-contacto');
var botonEnviarContacto = document.getElementById('boton-enviar-contacto');
var fondoModalError = document.getElementById('fondo-modal-error');
var mensajeModalError = document.getElementById('mensaje-modal-error');
var botonCerrarError = document.getElementById('boton-cerrar-error');

function mostrarModal(elementoFondo) {
  elementoFondo.classList.remove('oculto');
}

function ocultarModal(elementoFondo) {
  elementoFondo.classList.add('oculto');
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

function validarNombreContacto(valorNombre) {
  var nombreLimpio = valorNombre.trim();
  if (nombreLimpio.length === 0) {
    return 'Ingresá tu nombre.';
  }
  if (EXPRESION_ALFANUMERICA.test(nombreLimpio) === false) {
    return 'El nombre solo puede tener letras, números y espacios.';
  }
  return '';
}

function validarEmailContacto(valorEmail) {
  var emailLimpio = valorEmail.trim();
  if (EXPRESION_EMAIL.test(emailLimpio) === false) {
    return 'Ingresá un email válido.';
  }
  return '';
}

function validarMensajeContacto(valorMensaje) {
  var mensajeLimpio = valorMensaje.trim();
  if (mensajeLimpio.length <= 5) {
    return 'El mensaje debe tener más de 5 caracteres.';
  }
  return '';
}

function construirUrlMailto(valorNombre, valorEmail, valorMensaje) {
  var asunto = encodeURIComponent('Contacto desde Futbolle - ' + valorNombre.trim());
  var lineasCuerpo = 'Nombre: ' + valorNombre.trim() + '\nEmail: ' + valorEmail.trim() + '\n\n' + valorMensaje.trim();
  var cuerpo = encodeURIComponent(lineasCuerpo);
  return 'mailto:Tomas.ariaskarle@uai.edu.ar?subject=' + asunto + '&body=' + cuerpo;
}

function manejarClicEnviarContacto() {
  var valorNombre = entradaNombreContacto.value;
  var valorEmail = entradaEmailContacto.value;
  var valorMensaje = entradaMensajeContacto.value;
  var mensajeErrorNombre = validarNombreContacto(valorNombre);
  var mensajeErrorEmail = validarEmailContacto(valorEmail);
  var mensajeErrorMensaje = validarMensajeContacto(valorMensaje);
  errorNombreContacto.textContent = mensajeErrorNombre;
  errorEmailContacto.textContent = mensajeErrorEmail;
  errorMensajeContacto.textContent = mensajeErrorMensaje;
  if (mensajeErrorNombre !== '' || mensajeErrorEmail !== '' || mensajeErrorMensaje !== '') {
    mensajeModalError.textContent = 'Corregí los campos marcados en rojo antes de enviar.';
    mostrarModal(fondoModalError);
    return;
  }
  window.location.href = construirUrlMailto(valorNombre, valorEmail, valorMensaje);
}

function manejarClicCerrarError() {
  ocultarModal(fondoModalError);
}

function manejarClicCambiarTema() {
  cambiarTema();
}

function inicializarPaginaContacto() {
  cargarTemaGuardado();
  botonEnviarContacto.addEventListener('click', manejarClicEnviarContacto);
  botonCerrarError.addEventListener('click', manejarClicCerrarError);
  botonCambiarTema.addEventListener('click', manejarClicCambiarTema);
}

document.addEventListener('DOMContentLoaded', inicializarPaginaContacto);
