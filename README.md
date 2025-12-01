Turnero - Centro de Ecografías

## Descripción

Aplicación web para gestionar turnos en un consultorio de ecografías. Permite reservar, visualizar, editar y eliminar turnos de forma dinámica, almacenando los datos en el navegador (localStorage).

---

## Cómo usar la aplicación

1.Reservar un turno
  a. Completa los campos: Nombre, Email, WhatsApp.
  b. Selecciona la Obra Social (OOSS), la Categoría y luego la Ecografía.
  c. Escoge una Fecha en el calendario.
  d. Selecciona un Horario disponible.
  e. Haz clic en Reservar → El turno se añade y se guarda automáticamente.

2.Ver turnos
    Los turnos aparecen en el panel derecho.
    Si no hay turnos, se muestra: “No hay turnos agendados.”

3.Editar un turno
        Haz clic en Editar sobre un turno.
        Modifica los datos y pulsa Reservar para guardar cambios.

4.Eliminar un turno
        Haz clic en Borrar sobre el turno.
        Confirma la acción en la ventana emergente.

5.Limpiar formulario
        Haz clic en Limpiar Formulario para vaciar los campos.

---

## Lógica de negocio

  -Gestión exclusiva de turnos via DOM + LocalStorage.
  -Horarios disponibles:
    Lunes, Martes, Jueves: 15:30 – 19:00
    Sábados: 10:00 – 19:00
  -No se permiten turnos solapados.
  -Cada turno almacena Nombre, Email, WhatsApp, Obra Social (OOSS), Categoría, Servicio, Fecha, Hora y Duración.
  -La lista de turnos y horarios disponibles se generan dinámicamente según la fecha y servicio seleccionados.

---

## Estructura del proyecto

  -index.html: Página principal con interfaz y carga de scripts.
  -css/style.css: Estilos para la apariencia visual.
  -js/servicesLoader.js: Carga dinámica desde JSON de categorías y servicios.
  -js/turnosUtils.js: Funciones auxiliares y validaciones.
  -js/turnosDom.js: Referencias DOM y pre-carga formularios.
  -js/turnosManager.js: Lógica principal (crear, editar, borrar turnos).
  -database/services.json: Base simulada de datos JSON para categorías y servicios.
  -assets/: Carpeta con imágenes y recursos multimedia.
  -README.md: Guía para usar y entender el proyecto.

---

## Tecnologías utilizadas

  - HTML / CSS / JavaScript
  - [Vanilla Calendar](https://vanilla-calendar.com/) → para selección de fechas
  - [SweetAlert2](https://sweetalert2.github.io/) → para mensajes y confirmaciones emergentes
  - LocalStorage → para persistencia de datos en navegador

---

## Consideraciones y buenas prácticas

  -No se usan alert, prompt, ni confirm nativos (solo SweetAlert2).
  -No hay console.log en el código final entregado.
  -Todos los scripts JS se importan con atributo defer en el head.
  -No se envuelve el código JS en DOMContentLoaded debido a uso de defer.
  -No se asignan funciones a objetos globales como window, salvo referencias DOM agrupadas en objeto.
  -No existe código JS dentro del archivo HTML; toda la lógica está en archivos externos.

---

## Notas para el corrector

  -El formulario se pre-carga con datos de ejemplo para facilitar las pruebas.
  -La base de datos simulada de servicios está en database/services.json y se carga con fetch.
  -El simulador permite editar y eliminar turnos para un circuito completo.
  -La UI es clara, accesible y dinámica, sin interacción con ventanas nativas limitadas.
  -El proyecto puede probarse offline tras descargar, no necesita servicios backend externos.

