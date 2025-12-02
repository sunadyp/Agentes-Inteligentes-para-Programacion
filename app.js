// App de reservas local para barbería  versión con selección previa, modal y toasts
(function(){
  const STORAGE_KEY = 'barber_appointments_v1';
  const SLOT_START = 9; // 9:00
  const SLOT_END = 18;  // 18:00 (último inicio 17:00)

  // Elements
  const dateInput = document.getElementById('date');
  const slotsContainer = document.getElementById('slots');
  const feedback = document.getElementById('feedback');
  const appointmentsList = document.getElementById('appointmentsList');
  const selectedInfo = document.getElementById('selectedInfo');
  const confirmBtn = document.getElementById('confirmBtn');
  const clearSelectionBtn = document.getElementById('clearSelection');

  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modalBody');
  const modalConfirm = document.getElementById('modalConfirm');
  const modalCancel = document.getElementById('modalCancel');

  const toastsEl = document.getElementById('toasts');

  let selected = null; // {date, hour}

  function todayISO(){
    const d = new Date();
    d.setHours(0,0,0,0);
    return d.toISOString().slice(0,10);
  }

  function loadAppointments(){
    try{ return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch(e){ console.error(e); return []; }
  }

  function saveAppointments(list){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function getAppointmentsForDate(dateISO){
    const list = loadAppointments();
    return list.filter(a => a.date === dateISO);
  }

  function isSlotBooked(dateISO, hour){
    const appts = getAppointmentsForDate(dateISO);
    return appts.some(a => a.hour === hour);
  }

  function clearSelectedUI(){
    selected = null;
    selectedInfo.textContent = 'Ningún horario seleccionado';
    confirmBtn.disabled = true;
    // remove selected class
    const prev = slotsContainer.querySelector('.slot.selected');
    if(prev) prev.classList.remove('selected');
  }

  function setSelected(dateISO, hour, btnEl){
    clearSelectedUI();
    selected = {date: dateISO, hour};
    selectedInfo.textContent = `${dateISO}  ${String(hour).padStart(2,'0')}:00  ${String(hour+1).padStart(2,'0')}:00`;
    confirmBtn.disabled = false;
    if(btnEl) btnEl.classList.add('selected');
  }

  function renderSlots(){
    slotsContainer.innerHTML = '';
    const dateISO = dateInput.value;
    if(!dateISO){ feedback.textContent = 'Selecciona una fecha.'; return; }
    feedback.textContent = '';

    const now = new Date();
    const isToday = dateISO === todayISO();

    for(let h = SLOT_START; h < SLOT_END; h++){
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'slot';
      btn.dataset.hour = String(h);
      const label = `${String(h).padStart(2,'0')}:00  ${String(h+1).padStart(2,'0')}:00`;
      btn.textContent = label;

      if(isSlotBooked(dateISO, h)){
        btn.classList.add('booked');
        btn.title = 'Hora ya reservada';
        btn.disabled = true;
      }

      if(isToday){
        const slotDate = new Date(`${dateISO}T${String(h).padStart(2,'0')}:00:00`);
        if(slotDate <= now){
          btn.classList.add('past');
          btn.disabled = true;
          btn.title = 'Hora pasada';
        }
      }

      btn.addEventListener('click', ()=>{
        if(btn.disabled) return;
        setSelected(dateISO, h, btn);
      });

      slotsContainer.appendChild(btn);
    }
  }

  // Modal helpers
  function openModal(text){
    modalBody.textContent = text;
    modal.setAttribute('aria-hidden','false');
  }
  function closeModal(){
    modal.setAttribute('aria-hidden','true');
  }

  // Toasts
  function showToast(message, type='success', timeout=3000){
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<div class=\"msg\">${message}</div><button class=\"close\"></button>`;
    const closeBtn = t.querySelector('.close');
    closeBtn.addEventListener('click', ()=>{ t.remove(); });
    toastsEl.appendChild(t);
    setTimeout(()=>{ t.remove(); }, timeout);
  }

  function confirmReservation(){
    if(!selected) return;
    // show modal
    openModal(`Vas a reservar ${selected.date} ${String(selected.hour).padStart(2,'0')}:00`);
  }

  function performBooking(){
    if(!selected) return;
    const list = loadAppointments();
    if(isSlotBooked(selected.date, selected.hour)){
      showToast('Ese horario ya está reservado', 'error');
      closeModal();
      renderSlots();
      clearSelectedUI();
      return;
    }

    const id = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,7);
    list.push({id, date: selected.date, hour: selected.hour});
    saveAppointments(list);
    closeModal();
    showToast('Cita reservada', 'success');
    // visual feedback: add animation class to new appointment
    renderSlots();
    renderAppointments(true, id);
    clearSelectedUI();
  }

  function cancelAppointment(id){
    let list = loadAppointments();
    const toRemove = list.find(a=>a.id===id);
    if(!toRemove) return;
    list = list.filter(a=>a.id !== id);
    saveAppointments(list);
    // animate removal
    const li = appointmentsList.querySelector(`[data-id=\"${id}\"]`);
    if(li){
      li.classList.add('removing');
      setTimeout(()=>{ li.remove(); showToast('Cita cancelada', 'warn'); renderSlots(); }, 280);
    } else {
      showToast('Cita cancelada', 'warn');
      renderSlots();
    }
  }

  function renderAppointments(markNew=false, newId=null){
    const list = loadAppointments().slice().sort((a,b)=>{
      if(a.date===b.date) return a.hour - b.hour;
      return a.date < b.date ? -1:1;
    });
    appointmentsList.innerHTML = '';
    if(list.length===0){
      const li = document.createElement('li');
      li.textContent = 'No hay citas.';
      appointmentsList.appendChild(li);
      return;
    }

    for(const a of list){
      const li = document.createElement('li');
      li.dataset.id = a.id;
      const time = `${a.date} ${String(a.hour).padStart(2,'0')}:00  ${String(a.hour+1).padStart(2,'0')}:00`;
      const left = document.createElement('div');
      left.className = 'time'; left.textContent = time;
      const right = document.createElement('div');
      const btn = document.createElement('button');
      btn.className = 'btn ghost';
      btn.textContent = 'Cancelar';
      btn.addEventListener('click', ()=>{
        if(confirm('¿Cancelar esta cita?')) cancelAppointment(a.id);
      });
      right.appendChild(btn);
      li.appendChild(left);
      li.appendChild(right);
      if(markNew && a.id === newId) li.classList.add('new');
      appointmentsList.appendChild(li);
    }
  }

  // Event wiring
  function init(){
    dateInput.min = todayISO();
    dateInput.value = todayISO();
    dateInput.addEventListener('change', ()=>{ renderSlots(); clearSelectedUI(); });

    clearSelectionBtn.addEventListener('click', ()=> clearSelectedUI());
    confirmBtn.addEventListener('click', ()=> confirmReservation());

    modalConfirm.addEventListener('click', ()=> performBooking());
    modalCancel.addEventListener('click', ()=> { closeModal(); });
    document.getElementById('modalBackdrop').addEventListener('click', ()=> closeModal());

    renderSlots();
    renderAppointments();
  }

  init();

})();
