Turnero - Centro de Ecografías

## Descripción
Esta es una aplicación web para gestionar turnos en un consultorio de ecografías.  
Permite al usuario reservar turnos, ver los turnos ya agendados, editar o eliminar turnos, todo de manera dinámica y almacenando los datos en el navegador (LocalStorage).

---

## Cómo usar la aplicación

1. Reservar un turno
a. Completa los datos: Nombre, Email, WhatsApp.
b. Selecciona la **Categoría** y luego el **Servicio/Ecografía**.
c. Escoge una **Fecha** en el calendario.
d. Selecciona un **Horario disponible**.
e. Haz clic en **Reservar** → El turno se agrega y guarda automáticamente.

2. Ver turnos
- Los turnos aparecen en el panel derecho.
- Si no hay turnos, se muestra: *“No hay turnos agendados.”*

3. Editar un turno
- Clic en **Editar** sobre un turno.
- Modifica los datos y presiona **Reservar** para guardar cambios.

4. Eliminar un turno
- Clic en **Borrar** sobre el turno.
- Confirma la acción en la ventana emergente.

5. Limpiar formulario
- Clic en **Limpiar Formulario** para vaciar los campos.

---

## Lógica de negocio

- Los turnos se gestionan únicamente con **DOM + LocalStorage**.
- Horarios disponibles:
  - Lunes, Martes, Jueves: 15:30 – 19:00
  - Sábados: 10:00 – 19:00
- Evita solapamiento de turnos.
- Cada turno tiene: Nombre, Email, WhatsApp, Categoría, Servicio, Fecha, Hora y Duración.
- Se genera dinámicamente la lista de turnos y los horarios según la fecha seleccionada.

---

## Tecnologías utilizadas

- HTML / CSS / JavaScript
- [Vanilla Calendar](https://vanilla-calendar.com/) → Selección de fechas
- [SweetAlert2](https://sweetalert2.github.io/) → Mensajes emergentes
- LocalStorage → Persistencia de datos

---

## Notas

- No se utilizan `alert`, `prompt` ni `console.log` en el proyecto final.  
- Todo se maneja mediante eventos del DOM y almacenamiento local.
- Pre-carga del formulario para facilitar pruebas al corrector.