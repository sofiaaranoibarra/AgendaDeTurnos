// Referencias al DOM
const form = document.getElementById('formTurno');
const nombreInput = document.getElementById('nombre');
const emailInput = document.getElementById('email');
const telefonoInput = document.getElementById('telefono');
const categoriaSelect = document.getElementById('categoria');
const servicioSelect = document.getElementById('servicio');
const fechaInput = document.getElementById('fecha');
const horaSelect = document.getElementById('hora');
const listaTurnos = document.getElementById('listaTurnos');
const btnLimpiar = document.getElementById('btnLimpiar');
const btnReservar = document.getElementById('btnReservar');

// ---------- FUNCION PRE-RELLENAR FORMULARIO ----------
function preRellenarFormulario() {
  nombreInput.value = "Juan Pérez";
  emailInput.value = "juan.perez@example.com";
  telefonoInput.value = "1134567890";
}

// Hacemos globales para que los use el otro archivo
window.TurneroDOM = {
  form,
  nombreInput,
  emailInput,
  telefonoInput,
  categoriaSelect,
  servicioSelect,
  fechaInput,
  horaSelect,
  listaTurnos,
  btnLimpiar,
  btnReservar,
  preRellenarFormulario
};
