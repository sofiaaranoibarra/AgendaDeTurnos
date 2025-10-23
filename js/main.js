// Agenda de turnos

const turnos = []

function agregarTurno(nombre, dia) {
    if (!nombre || !dia) {
        alert("Operación cancelada o datos inválidos.")
        return false
    }

    const turnoExistente = turnos.find(function(turno) {
        return turno.nombre === nombre && turno.dia === dia
    })

    if (turnoExistente) {
        alert("Ese turno ya está reservado.")
        return false
    }

    turnos.push({ nombre: nombre, dia: dia })
    alert("Turno agendado correctamente para " + nombre + " el día " + dia + ".")
    return true
}

function mostrarTurnos() {
    if (turnos.length === 0) {
        alert("No hay turnos agendados.")
    } else {
        let lista = "Turnos agendados:\n"
        for (let i = 0; i < turnos.length; i++) {
            lista += (i + 1) + ". " + turnos[i].nombre + " - " + turnos[i].dia + "\n"
        }
        alert(lista)
    }
}

function cancelarTurno(nombre) {
    const indice = turnos.findIndex(function(turno) {
        return turno.nombre === nombre
    })

    if (indice === -1) {
        alert("No se encontró un turno con ese nombre.")
        return false
    }

    const confirmado = confirm("¿Desea cancelar el turno de " + turnos[indice].nombre + "?")
    if (confirmado) {
        turnos.splice(indice, 1)
        alert("Turno cancelado correctamente.")
        return true
    } else {
        alert("Operación cancelada.")
        return false
    }
}

let opcion = ""

while (opcion !== "4") {
    opcion = prompt(
        "AGENDA DE TURNOS\n\n1. Agendar turno\n2. Ver turnos\n3. Cancelar turno\n4. Salir\n\nIngrese el número de la opción:"
    )

    switch (opcion) {
        case "1":
            const nombre = prompt("Ingrese el nombre del paciente:")
            const dia = prompt("Ingrese el día del turno:")
            agregarTurno(nombre, dia)
            break

        case "2":
            mostrarTurnos()
            break

        case "3":
            const nombreCancelar = prompt("Ingrese el nombre del paciente a cancelar:")
            cancelarTurno(nombreCancelar)
            break

        case "4":
            alert("Saliendo del programa. ¡Hasta luego!")
            break

        default:
            alert("Opción no válida. Intente nuevamente.")
            break
    }
}

console.log("Programa finalizado.")