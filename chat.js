(() => {
  const widget = document.querySelector('[data-chat-widget]');
  if (!widget) return;

  const panel = widget.querySelector('[data-chat-panel]');
  const toggle = widget.querySelector('[data-chat-toggle]');
  const closeButton = widget.querySelector('[data-chat-close]');
  const log = widget.querySelector('[data-chat-log]');
  const form = widget.querySelector('[data-chat-form]');
  const input = widget.querySelector('[data-chat-input]');
  const suggestions = widget.querySelector('[data-chat-suggestions]');
  const status = widget.querySelector('[data-chat-status]');
  const sessionKey = 'node.chat.session.v1';
  const requestTimeoutMs = 35000;
  const chatEndpoint = 'https://chess-positioning-sure-perform.trycloudflare.com/api/chat';
  const actions = Object.freeze([
    Object.freeze({ type: 'ASK', id: 'node-capabilities-question', label: '¿Qué puede hacer NODE?', message: '¿Qué puede hacer NODE?' }),
    Object.freeze({ type: 'ASK', id: 'node-process-question', label: '¿Cómo trabajamos?', message: '¿Cómo trabajamos?' }),
    Object.freeze({ type: 'NAVIGATE', id: 'diagnostic-navigation', label: 'Solicitar diagnóstico', target: 'diagnostico' })
  ]);
  const sections = Object.freeze({ enfoque: '#enfoque', proceso: '#proceso', capacidades: '#capacidades', equipo: '#diferencia', diagnostico: '#diagnostico' });
  const sectionLabels = Object.freeze({ enfoque: 'Ver enfoque', proceso: 'Ver proceso', capacidades: 'Ver capacidades', equipo: 'Ver equipo', diagnostico: 'Solicitar diagnóstico' });
  let inFlight = false;
  let sessionId = readSessionId();
  let gestureTimer = 0;
  let blinkTimer = 0;
  let joyTimer = 0;
  let errorTimer = 0;
  let greetingTimer = 0;
  const reducedMotion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');

  function setNodeState(state) {
    widget.dataset.nodeState = state;
  }

  function setGesture(gesture, duration = 0) {
    window.clearTimeout(gestureTimer);
    widget.dataset.nodeGesture = gesture;
    if (duration) {
      gestureTimer = window.setTimeout(() => {
        if (widget.dataset.nodeGesture === gesture) delete widget.dataset.nodeGesture;
      }, duration);
    }
  }

  function expressJoy() {
    window.clearTimeout(joyTimer);
    setGesture('joy');
    joyTimer = window.setTimeout(() => {
      if (widget.dataset.nodeGesture === 'joy') delete widget.dataset.nodeGesture;
    }, 760);
  }

  function scheduleBlink() {
    window.clearTimeout(blinkTimer);
    if (document.hidden || reducedMotion?.matches) return;
    const delay = 3000 + Math.round(Math.random() * 4000);
    blinkTimer = window.setTimeout(() => {
      if (!document.hidden && !reducedMotion?.matches && !widget.dataset.nodeGesture) setGesture('blink', 150);
      scheduleBlink();
    }, delay);
  }

  function startGreetingOnce() {
    if (reducedMotion?.matches) return;
    try {
      if (sessionStorage.getItem('node.chat.node-greeted.v1')) return;
      sessionStorage.setItem('node.chat.node-greeted.v1', '1');
    } catch (_) { /* Greeting is decorative if storage is unavailable. */ }
    greetingTimer = window.setTimeout(() => setGesture('salute', 580), 360);
  }

  function readSessionId() {
    try {
      const current = sessionStorage.getItem(sessionKey);
      if (current) return current;
      const created = makeId('session');
      sessionStorage.setItem(sessionKey, created);
      return created;
    } catch (_) {
      return makeId('session');
    }
  }

  function makeId(prefix) {
    if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') return globalThis.crypto.randomUUID();
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  }

  function addMessage(text, who) {
    const bubble = document.createElement('div');
    bubble.className = `chat-msg chat-msg--${who}`;
    const paragraph = document.createElement('p');
    paragraph.textContent = String(text);
    bubble.appendChild(paragraph);
    log.appendChild(bubble);
    log.scrollTop = log.scrollHeight;
    return bubble;
  }

  function setBusy(value) {
    inFlight = value;
    input.disabled = value;
    form.querySelector('button[type="submit"]').disabled = value;
    suggestions.querySelectorAll('button').forEach((button) => { button.disabled = value; });
    status.hidden = !value;
    status.textContent = value ? 'NODE está pensando…' : '';
    setNodeState(value ? 'thinking' : (panel.hidden ? 'idle' : (input.value.trim() ? 'writing' : 'open')));
  }

  function navigateToSection(target) {
    if (typeof target !== 'string' || !Object.prototype.hasOwnProperty.call(sections, target)) return false;
    const element = document.querySelector(sections[target]);
    if (!element) return false;
    const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    element.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    if (!element.hasAttribute('tabindex')) element.setAttribute('tabindex', '-1');
    element.focus({ preventScroll: true });
    return true;
  }

  function addSectionAction(container, type, target) {
    if (type !== 'OFFER_SECTION' && type !== 'NAVIGATE_SECTION') return;
    if (!Object.prototype.hasOwnProperty.call(sections, target)) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'chat-suggestion';
    button.textContent = sectionLabels[target];
    button.addEventListener('click', () => {
      if (navigateToSection(target)) button.remove();
    });
    container.appendChild(button);
    if (type === 'NAVIGATE_SECTION') navigateToSection(target);
  }

  function renderResponse(payload) {
    if (!payload || typeof payload.answer !== 'string' || !payload.answer.trim()) throw new Error('MALFORMED_RESPONSE');
    const bubble = addMessage(payload.answer, 'bot');
    if (typeof payload.follow_up_question === 'string' && payload.follow_up_question.trim() &&
        payload.follow_up_question.trim() !== payload.answer.trim()) addMessage(payload.follow_up_question, 'bot');
    if (payload.requires_human === true || payload.approval_required === true) {
      const note = document.createElement('p');
      note.className = 'chat-action-note';
      note.textContent = payload.approval_required === true ? 'Este paso requiere revisión y autorización.' : 'Puedes continuar con una persona del equipo.';
      bubble.appendChild(note);
    }
    if (Array.isArray(payload.ui_actions)) {
      const safeAction = payload.ui_actions.find((item) => item && typeof item === 'object' &&
        (item.type === 'OFFER_SECTION' || item.type === 'NAVIGATE_SECTION') &&
        Object.prototype.hasOwnProperty.call(sections, item.target));
      if (safeAction) addSectionAction(bubble, safeAction.type, safeAction.target);
    }
  }

  async function ask(message) {
    if (inFlight || !message.trim()) return;
    let failed = false;
    const requestId = makeId('request');
    addMessage(message, 'user');
    input.value = '';
    setBusy(true);
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), requestTimeoutMs);
    try {
      const response = await fetch(chatEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ channel: 'WEB', request_id: requestId, session_id: sessionId, message }),
        signal: controller.signal
      });
      if (!response.ok) throw new Error('HTTP_ERROR');
      renderResponse(await response.json());
      expressJoy();
    } catch (_) {
      failed = true;
      addMessage('No pude conectar con NODE en este momento. Intenta nuevamente.', 'bot');
      setGesture('curious', 900);
    } finally {
      window.clearTimeout(timer);
      setBusy(false);
      if (failed) {
        window.clearTimeout(errorTimer);
        setNodeState('error');
        errorTimer = window.setTimeout(() => {
          if (widget.dataset.nodeState === 'error') setNodeState(panel.hidden ? 'idle' : 'open');
        }, 1050);
      }
      if (!panel.hidden) input.focus();
    }
  }

  actions.forEach((action) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'chat-suggestion';
    button.textContent = action.label;
    button.addEventListener('click', () => action.type === 'ASK' ? ask(action.message) : navigateToSection(action.target));
    suggestions.appendChild(button);
  });

  const openPanel = () => {
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    setNodeState(input.value.trim() ? 'writing' : 'open');
    expressJoy();
    window.setTimeout(() => input.focus(), 50);
  };
  const closePanel = () => {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    setNodeState(inFlight ? 'thinking' : 'idle');
    setGesture('blink', 160);
    toggle.focus();
  };
  toggle.addEventListener('click', () => panel.hidden ? openPanel() : closePanel());
  closeButton.addEventListener('click', closePanel);
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !panel.hidden) closePanel(); });
  form.addEventListener('submit', (event) => { event.preventDefault(); ask(input.value.trim()); });
  input.addEventListener('input', () => {
    if (!inFlight && !panel.hidden) setNodeState(input.value.trim() ? 'writing' : 'open');
  });

  toggle.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch' || reducedMotion?.matches) return;
    const rect = toggle.getBoundingClientRect();
    const x = Math.max(-3, Math.min(3, ((event.clientX - rect.left) / rect.width - .5) * 7));
    const y = Math.max(-2, Math.min(2, ((event.clientY - rect.top) / rect.height - .5) * 5));
    toggle.style.setProperty('--node-x', `${x}px`);
    toggle.style.setProperty('--node-y', `${y}px`);
  });
  toggle.addEventListener('pointerleave', () => {
    toggle.style.setProperty('--node-x', '0px');
    toggle.style.setProperty('--node-y', '0px');
    if (!inFlight && !panel.hidden) setGesture('curious', 380);
  });
  toggle.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'touch' && !reducedMotion?.matches) setGesture('curious', 900);
  });

  const onVisibilityChange = () => {
    if (document.hidden) {
      window.clearTimeout(blinkTimer);
      window.clearTimeout(gestureTimer);
      delete widget.dataset.nodeGesture;
    } else {
      scheduleBlink();
    }
  };
  document.addEventListener('visibilitychange', onVisibilityChange);
  globalThis.addEventListener('pagehide', () => {
    window.clearTimeout(blinkTimer);
    window.clearTimeout(gestureTimer);
    window.clearTimeout(joyTimer);
    window.clearTimeout(errorTimer);
    window.clearTimeout(greetingTimer);
  }, { once: true });
  reducedMotion?.addEventListener?.('change', onVisibilityChange);
  setNodeState('idle');
  startGreetingOnce();
  scheduleBlink();
})();
