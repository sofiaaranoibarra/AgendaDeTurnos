const App = (function () {
  const LS_KEY = 'turnos_v1';
  const DIAS_HABILITADOS = new Set([1, 2, 4, 6]);

  // DOM
  const {
    form, nombreInput, emailInput, telefonoInput,
    categoriaSelect, servicioSelect, fechaInput,
    horaSelect, listaTurnos, btnLimpiar
  } = window.TurneroDOM;

  let turnos = [];
  let editId = null;
  let duracionServicioActual = 15;

  // ---------- STORAGE ----------
  const guardarStorage = () => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(turnos)); }
    catch { if (window.Swal) Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo guardar en LocalStorage.' }); }
  };

  const cargarStorage = () => {
    try { turnos = JSON.parse(localStorage.getItem(LS_KEY)) || []; }
    catch { turnos = []; }
  };

  // ---------- VALIDACIONES ----------
  const mostrarErrorCampo = (name, msg) => {
    const el = document.querySelector(`.error[data-for="${name}"]`);
    if (el) el.textContent = msg || '';
  };

  const limpiarErrores = () => {
    document.querySelectorAll('.error').forEach(e => e.textContent = '');
  };

  const validarNombre = n => /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]{3,}$/.test(n.trim());
  const validarEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
  const validarTelefono = t => /^[\d+\s]{7,}$/.test(t.trim());

  // ---------- HORARIOS ----------
  const esDiaHabil = fecha => DIAS_HABILITADOS.has(fecha.getDay());

  const rangoPorDia = fecha => {
    const day = fecha.getDay();
    if ([1, 2, 4].includes(day)) return { inicio: '15:30', fin: '19:00' };
    if (day === 6) return { inicio: '10:00', fin: '19:00' };
    return null;
  };

  const hmAMinutos = hm => {
    const [h, m] = hm.split(':').map(Number);
    return h * 60 + m;
  };

  const generarSlotsPorIntervalo = (inicio, fin) => {
    const slots = [];
    let current = hmAMinutos(inicio);
    const end = hmAMinutos(fin);
    while (current <= end - 1) {
      const hh = Math.floor(current / 60).toString().padStart(2, '0');
      const mm = (current % 60).toString().padStart(2, '0');
      slots.push(`${hh}:${mm}`);
      current += 15;
    }
    return slots;
  };

  const intervaloSolapa = (fecha, slot, dur, t) => {
    if (t.fecha !== fecha) return false;
    const startA = hmAMinutos(slot), endA = startA + dur;
    const startB = hmAMinutos(t.hora), durB = Number(t.duracion ?? 15), endB = startB + durB;
    return startA < endB && startB < endA;
  };

  const generarHorariosParaFecha = fechaStr => {
    horaSelect.innerHTML = '<option value="">-- Selecciona Horario --</option>';
    if (!fechaStr) return;

    const fecha = new Date(`${fechaStr}T00:00:00`);
    if (!esDiaHabil(fecha)) {
      if (window.Swal) Swal.fire({ icon: 'warning', title: 'Consultorio Cerrado', text: 'Atendemos Lunes, Martes, Jueves y Sábados.' });
      return;
    }

    const rango = rangoPorDia(fecha);
    if (!rango) return;

    const posibles = generarSlotsPorIntervalo(rango.inicio, rango.fin);
    const disponibles = posibles.filter(slot => hmAMinutos(slot) + duracionServicioActual <= hmAMinutos(rango.fin));

    if (!disponibles.length) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = 'No hay horarios disponibles';
      horaSelect.appendChild(opt);
      return;
    }

    disponibles.forEach(s => {
      const o = document.createElement('option');
      o.value = s;
      o.textContent = s;
      horaSelect.appendChild(o);
    });
  };

  // ---------- GESTION DE TURNOS ----------
  const renderTurnos = () => {
    listaTurnos.innerHTML = '';
    if (!turnos.length) {
      const emp = document.createElement('div');
      emp.className = 'empty';
      emp.textContent = 'No hay turnos agendados.';
      listaTurnos.appendChild(emp);
      return;
    }

    [...turnos].sort((a, b) => `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`))
      .forEach(t => {
        const cont = document.createElement('div');
        cont.className = 'turno';
        cont.innerHTML = `
          <div>
            <strong>${t.nombre}</strong> — <span class="meta">${t.categoria} • ${t.servicio}</span>
            <div class="meta">${t.fecha} • ${t.hora}</div>
          </div>
        `;
        const controls = document.createElement('div');
        controls.className = 'controls';

        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-small btn-edit';
        editBtn.textContent = 'Editar';
        editBtn.addEventListener('click', () => iniciarEdicion(t.id));

        const delBtn = document.createElement('button');
        delBtn.className = 'btn btn-small btn-delete';
        delBtn.textContent = 'Borrar';
        delBtn.addEventListener('click', () => confirmarBorrar(t.id));

        controls.append(editBtn, delBtn);
        cont.appendChild(controls);
        listaTurnos.appendChild(cont);
      });
  };

  const agregarTurnoObj = obj => { turnos.push(obj); guardarStorage(); renderTurnos(); };
  const actualizarTurnoObj = obj => { turnos = turnos.map(t => t.id === obj.id ? obj : t); guardarStorage(); renderTurnos(); };
  const borrarTurno = id => { turnos = turnos.filter(t => t.id !== id); guardarStorage(); renderTurnos(); };

  // ---------- EDICIÓN / BORRADO ----------
  const iniciarEdicion = id => {
    const t = turnos.find(x => x.id === id);
    if (!t) return;
    editId = id;
    nombreInput.value = t.nombre;
    emailInput.value = t.email;
    telefonoInput.value = t.telefono;
    categoriaSelect.value = t.categoria;
    categoriaSelect.dispatchEvent(new Event('change', { bubbles: true }));
    setTimeout(() => {
      servicioSelect.value = t.servicio;
      duracionServicioActual = Number(servicioSelect.selectedOptions[0]?.dataset?.duracion ?? t.duracion ?? 15);
      fechaInput.value = t.fecha;
      generarHorariosParaFecha(t.fecha);
      if (Array.from(horaSelect.options).some(o => o.value === t.hora)) horaSelect.value = t.hora;
      if (window.Swal) Swal.fire({ icon: 'info', title: 'Editar', text: 'Modifica los campos y presiona Reservar para guardar.' });
    }, 120);
  };

  const confirmarBorrar = id => {
    if (window.Swal) {
      Swal.fire({
        title: '¿Eliminar turno?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, borrar',
        cancelButtonText: 'Cancelar'
      }).then(r => { if (r.isConfirmed) { borrarTurno(id); Swal.fire({ icon: 'success', title: 'Borrado', text: 'Turno eliminado.' }); } });
    } else borrarTurno(id);
  };

  // ---------- EVENTOS ----------
  servicioSelect.addEventListener('change', () => {
    const dur = Number(servicioSelect.selectedOptions[0]?.dataset?.duracion ?? duracionServicioActual);
    duracionServicioActual = dur;
    if (fechaInput.value) generarHorariosParaFecha(fechaInput.value);
  });

  fechaInput.addEventListener('change', e => generarHorariosParaFecha(e.target.value));

  btnLimpiar.addEventListener('click', () => {
    form.reset();
    horaSelect.innerHTML = '<option value="">-- Selecciona Horario --</option>';
    editId = null;
    limpiarErrores();
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    limpiarErrores();

    const nombre = nombreInput.value.trim();
    const email = emailInput.value.trim();
    const telefono = telefonoInput.value.trim();
    const categoria = categoriaSelect.value;
    const servicio = servicioSelect.value;
    const fecha = fechaInput.value;
    const hora = horaSelect.value;
    const dur = duracionServicioActual;

    let valido = true;

    if (!validarNombre(nombre)) {
      mostrarErrorCampo('nombre', 'Nombre inválido (solo letras y espacios, min 3).');
      valido = false;
    }
    if (!validarEmail(email)) {
      mostrarErrorCampo('email', 'Email inválido.');
      valido = false;
    }
    if (!validarTelefono(telefono)) {
      mostrarErrorCampo('telefono', 'Teléfono inválido (mín 7 dígitos).');
      valido = false;
    }
    if (!categoria) {
      mostrarErrorCampo('categoria', 'Selecciona Categoría.');
      valido = false;
    }
    if (!servicio) {
      mostrarErrorCampo('servicio', 'Selecciona Ecografia.');
      valido = false;
    }
    if (!fecha) {
      mostrarErrorCampo('fecha', 'Selecciona una fecha.');
      valido = false;
    } else {
      const fechaHoy = new Date();
      fechaHoy.setHours(0, 0, 0, 0);
      const fechaTurno = new Date(`${fecha}T00:00:00`);

      if (fechaTurno < fechaHoy) {
        if (window.Swal) {
          Swal.fire({
            icon: 'warning',
            title: 'Fecha inválida',
            text: 'No se pueden reservar turnos en fechas pasadas.'
          });
        }
        valido = false;
      } else if (!esDiaHabil(fechaTurno)) {
        mostrarErrorCampo('fecha', 'Fecha no habilitada para turnos.');
        valido = false;
      }
    }

    if (!hora) {
      mostrarErrorCampo('hora', 'Selecciona una hora.');
      valido = false;
    }

    if (!valido) return;

    if (turnos.some(t => intervaloSolapa(fecha, hora, dur, t) && t.id !== editId)) {
      if (window.Swal) Swal.fire({ icon: 'error', title: 'Turno ocupado', text: 'Ese horario ya fue reservado.' });
      generarHorariosParaFecha(fecha);
      return;
    }

    const turnoObj = { id: editId ?? crypto.randomUUID(), nombre, email, telefono, categoria, servicio, fecha, hora, duracion: dur };

    if (editId) {
      actualizarTurnoObj(turnoObj);
      editId = null;
      if (window.Swal) Swal.fire({ icon: 'success', title: 'Actualizado', text: 'Turno actualizado correctamente.' });
    } else {
      agregarTurnoObj(turnoObj);
      if (window.Swal) Swal.fire({ icon: 'success', title: 'Reservado', text: 'Turno creado correctamente.' });
    }

    form.reset();
    horaSelect.innerHTML = '<option value="">-- Selecciona Horario --</option>';
  });

  // ---------- INICIALIZACIÓN ----------
  const init = () => {
    cargarStorage();
    renderTurnos();
    if (fechaInput.value) generarHorariosParaFecha(fechaInput.value);
    window.TurneroDOM.preRellenarFormulario();
  };

  return { init };
})();

App.init();