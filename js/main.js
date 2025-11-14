let turnos = JSON.parse(localStorage.getItem("turnos")) || [];

const form = document.getElementById("turnoForm");
const listaTurnos = document.getElementById("listaTurnos");
const mensaje = document.getElementById("mensaje");

function mostrarTurnos() {
    listaTurnos.innerHTML = "";

    if (turnos.length === 0) {
        listaTurnos.innerHTML = "<p>No hay turnos agendados.</p>";
        return;
    }

    turnos.forEach(turno => {
        const div = document.createElement("div");
        div.className = "turno";

        div.innerHTML = `
            <span>${turno.nombre} — ${turno.dia} — ${turno.hora} hs</span>
            <button class="borrar" data-id="${turno.id}">X</button>
        `;

        listaTurnos.appendChild(div);
    });
}

function agregarTurno(nombre, dia, hora) {

    mensaje.textContent = "";

    const ocupado = turnos.some(t => t.dia === dia && t.hora === hora);

    if (ocupado) {
        mensaje.textContent = "Ese turno ya está ocupado.";
        return;
    }

    const nuevoTurno = {
        id: Date.now(),
        nombre,
        dia,
        hora
    };

    turnos.push(nuevoTurno);

    localStorage.setItem("turnos", JSON.stringify(turnos));

    mostrarTurnos();
    form.reset();
}

function borrarTurno(id) {
    turnos = turnos.filter(t => t.id !== Number(id));

    localStorage.setItem("turnos", JSON.stringify(turnos));
    mostrarTurnos();
}

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const dia = document.getElementById("dia").value.trim();
    const hora = document.getElementById("hora").value.trim();

    if (!nombre || !dia || !hora) {
        mensaje.textContent = "Complete todos los campos.";
        return;
    }

    const formatoHora = /^([01]\d|2[0-3]):[0-5]\d$/;

    if (!formatoHora.test(hora)) {
        mensaje.textContent = "Hora inválida. Ejemplo correcto: 14:30";
        return;
    }

    agregarTurno(nombre, dia, hora);
});

listaTurnos.addEventListener("click", function (e) {
    if (e.target.classList.contains("borrar")) {
        const id = e.target.dataset.id;
        borrarTurno(id);
    }
});

mostrarTurnos();