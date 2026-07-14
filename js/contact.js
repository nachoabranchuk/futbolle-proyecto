'use strict';

var THEME_STORAGE_KEY = 'futbolleTheme';
var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var ALPHANUMERIC_REGEX = /^[a-zA-ZÀ-ÿ0-9\s]+$/;
var themeToggleBtn = document.getElementById('theme-toggle-btn');
var contactForm = document.getElementById('contact-form');
var contactNameInput = document.getElementById('contact-name-input');
var contactNameError = document.getElementById('contact-name-error');
var contactEmailInput = document.getElementById('contact-email-input');
var contactEmailError = document.getElementById('contact-email-error');
var contactMessageInput = document.getElementById('contact-message-input');
var contactMessageError = document.getElementById('contact-message-error');
var contactSubmitBtn = document.getElementById('contact-submit-btn');
var errorModalOverlay = document.getElementById('error-modal-overlay');
var errorModalMessage = document.getElementById('error-modal-message');
var errorModalCloseBtn = document.getElementById('error-modal-close-btn');

function showModal(overlayElement) {
  overlayElement.classList.remove('hidden');
}

function hideModal(overlayElement) {
  overlayElement.classList.add('hidden');
}

function applyTheme(themeName) {
  if (themeName === 'light') {
    document.body.classList.add('theme-light');
    themeToggleBtn.textContent = '☀️';
  } else {
    document.body.classList.remove('theme-light');
    themeToggleBtn.textContent = '🌙';
  }
}

function toggleTheme() {
  var isLight = document.body.classList.contains('theme-light');
  var newTheme = isLight ? 'dark' : 'light';
  applyTheme(newTheme);
  window.localStorage.setItem(THEME_STORAGE_KEY, newTheme);
}

function loadStoredTheme() {
  var storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme !== null) {
    applyTheme(storedTheme);
  }
}

function validateContactName(nameValue) {
  var trimmedName = nameValue.trim();
  if (trimmedName.length === 0) {
    return 'Ingresá tu nombre.';
  }
  if (ALPHANUMERIC_REGEX.test(trimmedName) === false) {
    return 'El nombre solo puede tener letras, números y espacios.';
  }
  return '';
}

function validateContactEmail(emailValue) {
  var trimmedEmail = emailValue.trim();
  if (EMAIL_REGEX.test(trimmedEmail) === false) {
    return 'Ingresá un email válido.';
  }
  return '';
}

function validateContactMessage(messageValue) {
  var trimmedMessage = messageValue.trim();
  if (trimmedMessage.length <= 5) {
    return 'El mensaje debe tener más de 5 caracteres.';
  }
  return '';
}

function buildMailtoUrl(nameValue, emailValue, messageValue) {
  var subject = encodeURIComponent('Contacto desde Futbolle - ' + nameValue.trim());
  var bodyLines = 'Nombre: ' + nameValue.trim() + '\nEmail: ' + emailValue.trim() + '\n\n' + messageValue.trim();
  var body = encodeURIComponent(bodyLines);
  return 'mailto:Tomas.ariaskarle@uai.edu.ar?subject=' + subject + '&body=' + body;
}

function handleContactSubmitClick() {
  var nameValue = contactNameInput.value;
  var emailValue = contactEmailInput.value;
  var messageValue = contactMessageInput.value;
  var nameErrorMessage = validateContactName(nameValue);
  var emailErrorMessage = validateContactEmail(emailValue);
  var messageErrorMessage = validateContactMessage(messageValue);
  contactNameError.textContent = nameErrorMessage;
  contactEmailError.textContent = emailErrorMessage;
  contactMessageError.textContent = messageErrorMessage;
  if (nameErrorMessage !== '' || emailErrorMessage !== '' || messageErrorMessage !== '') {
    errorModalMessage.textContent = 'Corregí los campos marcados en rojo antes de enviar.';
    showModal(errorModalOverlay);
    return;
  }
  window.location.href = buildMailtoUrl(nameValue, emailValue, messageValue);
}

function handleErrorModalCloseClick() {
  hideModal(errorModalOverlay);
}

function handleThemeToggleClick() {
  toggleTheme();
}

function initializeContactPage() {
  loadStoredTheme();
  contactSubmitBtn.addEventListener('click', handleContactSubmitClick);
  errorModalCloseBtn.addEventListener('click', handleErrorModalCloseClick);
  themeToggleBtn.addEventListener('click', handleThemeToggleClick);
}

document.addEventListener('DOMContentLoaded', initializeContactPage);
