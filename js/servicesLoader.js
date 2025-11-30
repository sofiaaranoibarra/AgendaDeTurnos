const ServicesLoader = (function () {
  const categoriaSelect = document.getElementById('categoria');
  const servicioSelect = document.getElementById('servicio');

  async function cargar() {
    try {
      const resp = await fetch('./database/services.json');
      if (!resp.ok) throw new Error('No se pudo cargar services.json');

      const data = await resp.json();

      // Cargar categorías
      data.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item.categoria;
        opt.textContent = item.categoria;
        categoriaSelect.appendChild(opt);
      });

      // Evento para cargar servicios según categoría
      categoriaSelect.addEventListener('change', (e) => {
        const cat = e.target.value;
        servicioSelect.innerHTML = '<option value="">-- Selecciona Ecografia --</option>';

        if (!cat) return;

        const item = data.find(x => x.categoria === cat);
        if (!item) return;

        item.servicios.forEach(s => {
          const o = document.createElement('option');
          o.value = s.nombre;
          o.textContent = s.nombre;
          o.dataset.duracion = s.duracion;
          servicioSelect.appendChild(o);
        });
      });

    } catch (err) {
      if (window.Swal) {
        Swal.fire({icon: 'error', title: 'Error', text: 'No se pudo cargar la base de servicios.'});
      } else {
        alert('No se pudo cargar la base de servicios.');
      }
    }
  }

  function initCalendarAndFallback() {
    try {
      const dateInput = document.getElementById('fecha');

      if (typeof VanillaCalendar !== 'undefined') {
        const vc = new VanillaCalendar('#vanilla-calendar', {
          settings: {
            lang: 'es',
            selection: { day: 'single' },
          },
          actions: {
            clickDay(event, date) {
              const iso = date.toISOString().slice(0,10);
              dateInput.value = iso;
              dateInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
          }
        });

        vc.init();
      } else {
        document.getElementById('vanilla-calendar').style.display = 'none';
      }
    } catch (e) {
      document.getElementById('vanilla-calendar').style.display = 'none';
    }
  }

  function init() {
    cargar();
    initCalendarAndFallback();
  }

  return { init };
})();

ServicesLoader.init();