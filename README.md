# App de reservas local  Barbería

Pequeña app web para gestionar citas de una barbería en local (sin servidor).

Características:
- Calendario (selector de fecha) y selección de franjas horarias por hora (9:0018:00).
- Cada cita dura 1 hora.
- Persistencia en `localStorage` del navegador.
- Evita solapamientos de hora y no permite reservar horas pasadas para hoy.

Cómo usar:
1. Abrir `index.html` en un navegador moderno.
2. Seleccionar una fecha y pulsar en la franja horaria disponible para reservar.
3. Ver las próximas citas en la columna derecha y cancelar si es necesario.

Opciones para servir localmente (PowerShell en Windows):

```powershell
# Con Python 3
python -m http.server 8000

# Con Node.js (si tienes http-server instalado)
npx http-server -p 8000
```

Luego abrir `http://localhost:8000` en el navegador.

Posibles mejoras:
- Múltiples barberos/puestos
- Ventanas de 30 minutos
- Confirmaciones por email (requiere backend)
- Exportar/importar citas
