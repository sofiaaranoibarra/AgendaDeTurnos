const TurnosUtils = (() => {
  const LS_KEY = 'turnos_v1';
  const DIAS_HABILITADOS = new Set([1, 2, 4, 6]);
  let turnos = [];

  // ---------- STORAGE ----------
  const guardarStorage = () => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(turnos)); }
    catch { window.Swal && Swal.fire({ icon:'error', title:'Error', text:'No se pudo guardar en LocalStorage.' }); }
  };

  const cargarStorage = () => { 
    try { turnos = JSON.parse(localStorage.getItem(LS_KEY)) || []; } 
    catch { turnos = []; } 
  };

  // ---------- VALIDACIONES ----------
  const validarNombre = n => /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]{3,}$/.test(n.trim());
  const validarEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
  const validarTelefono = t => /^[\d+\s]{7,}$/.test(t.trim());

  // ---------- HORARIOS ----------
  const esDiaHabil = f => DIAS_HABILITADOS.has(f.getDay());

  const rangoPorDia = f => [1,2,4].includes(f.getDay()) ? {inicio:'15:30', fin:'19:00'} : f.getDay()===6 ? {inicio:'10:00', fin:'19:00'} : null;

  const sumarMinutos = (hm, min) => { 
    const [h,m] = hm.split(':').map(Number); 
    const d = new Date(); 
    d.setHours(h,m,0,0); 
    d.setTime(d.getTime() + min*60000); 
    return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`; 
  };

  const hmAMinutos = hm => { 
    const [h,m] = hm.split(':').map(Number); 
    return h*60+m; 
  };

  const intervaloSolapa = (fecha, slot, dur, t) => {
    if(t.fecha!==fecha) return false;
    const startA = hmAMinutos(slot), endA = startA+dur;
    const startB = hmAMinutos(t.hora), durB = Number(t.duracion ?? 15), endB = startB+durB;
    return startA<endB && startB<endA;
  };

  const generarSlotsPorIntervalo = (inicio, fin) => {
    const slots=[]; let c=hmAMinutos(inicio), e=hmAMinutos(fin);
    while(c<=e-1){slots.push(`${Math.floor(c/60).toString().padStart(2,'0')}:${(c%60).toString().padStart(2,'0')}`); c+=15;}
    return slots;
  };

  return {
    turnos, guardarStorage, cargarStorage,
    validarNombre, validarEmail, validarTelefono,
    esDiaHabil, rangoPorDia, sumarMinutos, hmAMinutos, intervaloSolapa, generarSlotsPorIntervalo
  };
})();
