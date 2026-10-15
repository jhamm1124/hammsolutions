(function() {
  const modal = document.getElementById('contact-modal');
  if (!modal) return;

  const closeElems = modal.querySelectorAll('[data-action="close"]');
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('contact-form-status');
  const submitBtn = form.querySelector('button[type="submit"]');
  const nameField = document.getElementById('cf-name');
  const messageField = document.getElementById('cf-message');
  const endpoint = 'https://contact-form-hammsolutions.jdhamm17.workers.dev';

  const COOLDOWN_MS = 2 * 60 * 1000; // 2 minutes
  const COOLDOWN_KEY = 'hammContactLastSent';
  let cooldownTimer = null;
  let lastTrigger = null;

  function getRemainingCooldown() {
    const last = parseInt(localStorage.getItem(COOLDOWN_KEY) || '0', 10);
    const remaining = COOLDOWN_MS - (Date.now() - last);
    return remaining > 0 ? remaining : 0;
  }

  function formatRemaining(ms) {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return minutes + ':' + String(seconds).padStart(2, '0');
  }

  function stopCooldownDisplay() {
    if (cooldownTimer) {
      clearInterval(cooldownTimer);
      cooldownTimer = null;
    }
  }

  function startCooldownDisplay() {
    stopCooldownDisplay();
    submitBtn.disabled = true;

    function tick() {
      const remaining = getRemainingCooldown();
      if (remaining <= 0) {
        stopCooldownDisplay();
        submitBtn.disabled = false;
        statusEl.textContent = '';
        return;
      }
      statusEl.textContent = 'Please wait ' + formatRemaining(remaining) + ' before sending another message.';
    }

    tick();
    cooldownTimer = setInterval(tick, 1000);
  }

  function openModal(service) {
    if (service && messageField && !messageField.value.trim()) {
      messageField.value = "I'm interested in your " + service + " services. ";
    }

    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (nameField) nameField.focus();

    if (getRemainingCooldown() > 0) startCooldownDisplay();
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (getRemainingCooldown() <= 0) statusEl.textContent = '';
    if (lastTrigger) lastTrigger.focus();
  }

  document.querySelectorAll('[data-open-contact]').forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      lastTrigger = trigger;
      openModal(trigger.getAttribute('data-service'));
    });
  });

  closeElems.forEach(el => el.addEventListener('click', closeModal));

  modal.addEventListener('click', (e) => {
    if (e.target === e.currentTarget || e.target.classList.contains('contact-modal-overlay')) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (getRemainingCooldown() > 0) {
      startCooldownDisplay();
      return;
    }

    const data = {
      name: (form.name.value || '').trim(),
      email: (form.email.value || '').trim(),
      phone: (form.phone.value || '').trim(),
      message: (form.message.value || '').trim()
    };

    if (!data.name || !data.email || !data.message) {
      statusEl.textContent = 'Please complete all fields.';
      return;
    }

    statusEl.textContent = 'Sending…';
    submitBtn.disabled = true;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        mode: 'cors'
      });

      if (res.ok) {
        localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
        statusEl.textContent = 'Message sent — thank you!';
        form.reset();
        setTimeout(() => {
          closeModal();
          startCooldownDisplay();
        }, 1400);
      } else {
        let message = 'Send failed — please try again later.';
        try {
          const body = await res.json();
          if (body && body.error) message = body.error;
        } catch (_) {}
        console.error('Contact submit failed', res.status, message);
        statusEl.textContent = message;
        submitBtn.disabled = false;
      }
    } catch (err) {
      console.error(err);
      statusEl.textContent = 'Network error — please try again later.';
      submitBtn.disabled = false;
    }
  });
})();
