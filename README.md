# App de reservas local  Barbería

Pequeña app web para gestionar citas de una barbería en local (sin servidor).

Características:
- Calendario (selector de fecha) y selección de franjas horarias por hora (9:0018:00).
- Cada cita dura 1 hora.
- Persistencia en `localStorage` del navegador.
- Evita solapamientos de hora y no permite reservar horas pasadas para hoy.

# App de reservas local — Barbería

Pequeña aplicación web para gestionar citas de una barbería en local, sin backend. Los datos se guardan en el navegador usando `localStorage`.

**Características principales**
- Selector de fecha y franjas horarias por hora (9:00–18:00).
- Persistencia local en `localStorage`.
- Previene solapamientos y no permite reservar horas pasadas el mismo día.
- Modal de confirmación y sistema de toasts para feedback.

**Cómo ejecutar la aplicación**

Opción 1 — Abrir directamente (modo rápido):

1. Abre el archivo `index.html` en un navegador moderno (Chrome, Edge, Firefox).

Opción 2 — Servir con un servidor local (recomendado):

PowerShell (Windows):

```powershell
# Con Python 3
python -m http.server 8000

# Con Node.js (si tienes http-server instalado)
npx http-server -p 8000
```

Luego abre `http://localhost:8000` en tu navegador.

**Uso básico**

1. Selecciona una fecha en el campo `Fecha`.
2. Haz clic en una franja horaria disponible para seleccionarla.
3. Pulsa `Confirmar reserva` y confirma en el modal.
4. Las citas aparecen en la columna `Próximas citas` y pueden cancelarse.

**Tecnologías utilizadas**

- HTML, CSS, JavaScript (vanilla).
- Persistencia: `localStorage` del navegador.

**Arquitectura / archivos relevantes**
- `index.html` — interfaz y estructura DOM.
- `styles.css` — estilos.
- `app.js` — lógica de la aplicación (gestión de slots, modal, toasts, almacenamiento).

**Notas y limitaciones**
- Es una aplicación totalmente cliente (sin backend). Para uso real en producción se requeriría un servidor y un sistema de autenticación, control de concurrencia y notificaciones por correo.

---

Repositorio: https://github.com/sunadyp/Agentes-Inteligentes-para-Programacion (rama `add-local-project` contiene este proyecto)


