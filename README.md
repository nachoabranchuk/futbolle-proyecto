# Futbolle

Proyecto Final Individual - Desarrollo y Arquitecturas Web 2026 (UAI).

Juego de adivinanza de futbolistas al estilo Wordle. El usuario ingresa su nombre, elige una
dificultad y debe adivinar al jugador secreto en un máximo de 8 intentos, escribiendo nombres en
un buscador con autocompletado. Cada intento devuelve pistas visuales (colores y flechas) por
atributo: nacionalidad, club, posición, edad, overall y altura.

## Demo

[Jugar online](https://nachoabranchuk.github.io/futbolle-proyecto/)

## Tecnologías

- HTML5
- CSS3 (Flexbox, variables CSS, sin frameworks)
- JavaScript ES5 puro (sin `let`, `const`, arrow functions ni otra sintaxis ES6)

## Estructura del proyecto

```
futbolle/
├── index.html          Página principal del juego
├── contacto.html        Página de contacto
├── css/
│   ├── reset.css        Normalización cross-browser
│   └── styles.css       Estilos del proyecto (layout, tema claro/oscuro, tablero)
├── js/
│   ├── api.js            Llamadas fetch a los endpoints de la cátedra
│   ├── ui.js              Renderizado de DOM, modales, tema y sonido
│   ├── history.js         Historial de partidas en LocalStorage
│   ├── game.js            Lógica del juego (comparaciones, puntaje, timer)
│   ├── events.js          Listeners y arranque de la aplicación (index.html)
│   └── contact.js         Validación y envío del formulario de contacto
├── .gitignore
└── README.md
```

## Endpoints utilizados

- `GET /api/players/random` — jugador secreto aleatorio al iniciar cada partida.
- `GET /api/players/search?q=&limit=8` — autocompletado del buscador de jugadores.

Toda la comunicación se realiza con `fetch`, sin datos hardcodeados en el proyecto.

## Reglas del juego

- Se ingresa un nombre de jugador humano (mínimo 3 letras) y se elige la dificultad al comenzar.
- Cada intento compara nacionalidad, club, posición, edad, overall y altura contra el jugador secreto.
- Verde: coincide. Rojo: no coincide. Flecha arriba/abajo: el jugador secreto es mayor/menor en ese
  atributo numérico.
- No se puede repetir un mismo jugador como intento, ni enviar un intento vacío o inexistente.
- Se gana adivinando el nombre correcto dentro de los 8 intentos; se pierde si se agotan.
- El temporizador corre desde el primer intento hasta el final de la partida.
- Se puede reiniciar la partida (nuevo jugador secreto) sin recargar la página.

## Dificultad

- **Fácil**: se muestra la foto del jugador secreto desenfocada, que se va revelando con cada intento.
- **Medio**: se revelan progresivamente datos del jugador (edad, overall, altura) sin foto.
- **Difícil**: sin pistas adicionales, solo el feedback de colores y flechas de cada intento.

## Puntaje

`puntaje = puntos_base(dificultad) − (intentos_usados − 1) × 10 + bonus_por_tiempo`

Puntos base: Fácil 60, Medio 80, Difícil 100. Bonus: +20 si se ganó en menos de 60s, +10 si fue en
menos de 120s, +0 en cualquier otro caso. Puntaje mínimo en una partida ganada: 10. Si se pierde,
el puntaje registrado es 0.

## Funcionalidades extra

- Modo claro / oscuro persistente (LocalStorage).
- Sonidos generados con la Web Audio API al acertar un atributo, ganar o perder.
- Historial de partidas en LocalStorage (jugador, resultado, intentos, puntaje, fecha y duración),
  con un modal ordenable por fecha o cantidad de intentos.

## Cómo jugar localmente

Al ser un proyecto 100% estático, alcanza con abrir `index.html` en un navegador o servirlo con
cualquier servidor estático (por ejemplo `npx serve .`).

## Deploy

El proyecto se publica mediante GitHub Pages desde la rama principal del repositorio.

## Autor

Trabajo Práctico Final Individual — Desarrollo y Arquitecturas Web 2026 — Universidad Abierta
Interamericana (UAI).
