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
  const pinButton = widget.querySelector('[data-chat-pin]');
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
  const compactViewport = globalThis.matchMedia?.('(max-width: 680px)');

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
    flight.settleForPanel();
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
    flight.resumeAfterPause(1800);
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

  /* El vuelo se calcula fuera de los fotogramas: los rectángulos sólo se actualizan al cambiar
     la distribución. El único requestAnimationFrame mezcla trayectoria y mirada. */
  const flight = (() => {
    const haloRadius = 52;
    const proximityRadius = 128;
    const state = { x: 0, y: 0, baseX: 0, baseY: 0, size: 68, zones: [], dirty: true, plan: null, pausedUntil: 0, pinned: false, pointer: null, raf: 0, scrollTimer: 0 };

    function mobileOrReduced() { return Boolean(reducedMotion?.matches || compactViewport?.matches); }
    function setFlightState(value) { widget.dataset.nodeFlight = value; }
    function readPinned() {
      try { return sessionStorage.getItem('node.chat.pinned.v1') === 'true'; } catch (_) { return false; }
    }
    function savePinned() {
      try { sessionStorage.setItem('node.chat.pinned.v1', String(state.pinned)); } catch (_) { /* Optional session preference. */ }
    }
    function setTransform(tilt = 0) {
      widget.style.transform = `translate3d(${state.x.toFixed(2)}px, ${state.y.toFixed(2)}px, 0) rotate(${tilt.toFixed(2)}deg)`;
    }
    function resetBase() {
      const previous = widget.style.transform;
      widget.style.transform = 'none';
      const rect = widget.getBoundingClientRect();
      widget.style.transform = previous;
      state.baseX = rect.left;
      state.baseY = rect.top;
      state.size = rect.width || 68;
    }
    function visualCenter() { return { x: state.baseX + state.x + state.size / 2, y: state.baseY + state.y + state.size / 2 }; }
    function visibleObstacleRects() {
      const selectors = 'h1,h2,h3,h4,p,li,a,button,input,textarea,select,img,picture,video,canvas,svg,form,nav,header,[role="banner"],[role="navigation"],[role="dialog"],[data-chat-widget]';
      return [...document.querySelectorAll(selectors)].filter((element) => {
        if (element === widget || widget.contains(element) || element.closest('[hidden]')) return false;
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 3 && rect.height > 3 && rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth;
      }).map((element) => {
        const rect = element.getBoundingClientRect();
        return { left: rect.left - haloRadius, right: rect.right + haloRadius, top: rect.top - haloRadius, bottom: rect.bottom + haloRadius };
      });
    }
    function pointIsFree(x, y, obstacles) {
      return x >= haloRadius && x <= innerWidth - haloRadius && y >= haloRadius && y <= innerHeight - haloRadius && !obstacles.some((rect) => x > rect.left && x < rect.right && y > rect.top && y < rect.bottom);
    }
    function segmentIsFree(from, to, obstacles) {
      const distance = Math.hypot(to.x - from.x, to.y - from.y);
      const samples = Math.max(2, Math.ceil(distance / 14));
      for (let index = 0; index <= samples; index += 1) {
        const t = index / samples;
        if (!pointIsFree(from.x + (to.x - from.x) * t, from.y + (to.y - from.y) * t, obstacles)) return false;
      }
      return true;
    }
    function refreshZones() {
      resetBase();
      const obstacles = visibleObstacleRects();
      const candidates = [];
      for (let y = haloRadius + 14; y < innerHeight - haloRadius; y += 56) {
        for (let x = haloRadius + 14; x < innerWidth - haloRadius; x += 56) {
          if (pointIsFree(x, y, obstacles)) candidates.push({ x, y });
        }
      }
      state.zones = { obstacles, candidates };
      state.dirty = false;
    }
    function canExplore() { return panel.hidden && !state.pinned && !mobileOrReduced() && !document.hidden; }
    function chooseDestination() {
      if (state.dirty) refreshZones();
      const from = visualCenter();
      const options = state.zones.candidates.filter((candidate) => {
        const distance = Math.hypot(candidate.x - from.x, candidate.y - from.y);
        return distance > 74 && distance < 300 && segmentIsFree(from, candidate, state.zones.obstacles);
      });
      if (!options.length) return null;
      return options[Math.floor(Math.random() * Math.min(options.length, 12))];
    }
    function cubic(a, b, c, d, t) {
      const inverse = 1 - t;
      return inverse ** 3 * a + 3 * inverse ** 2 * t * b + 3 * inverse * t ** 2 * c + t ** 3 * d;
    }
    function start() {
      if (!canExplore() || state.plan || performance.now() < state.pausedUntil) return;
      const destination = chooseDestination();
      if (!destination) { setFlightState('rest'); state.pausedUntil = performance.now() + 3000; return; }
      const from = visualCenter();
      const dx = destination.x - from.x;
      const dy = destination.y - from.y;
      const distance = Math.hypot(dx, dy);
      const perpendicular = (Math.random() > .5 ? 1 : -1) * Math.min(36, distance * .16);
      const normalX = -dy / distance * perpendicular;
      const normalY = dx / distance * perpendicular;
      state.plan = { from, to: destination, c1: { x: from.x + dx * .3 + normalX, y: from.y + dy * .3 + normalY }, c2: { x: from.x + dx * .72 + normalX, y: from.y + dy * .72 + normalY }, started: performance.now() + 180, duration: Math.max(1100, Math.min(2200, distance * 9.2)) };
      setFlightState('exploring');
    }
    function stop(reason = 'rest') {
      state.plan = null;
      state.pausedUntil = performance.now() + (reason === 'near' ? 2300 : 0);
      setTransform(0);
      setFlightState(reason);
    }
    function settleForPanel() {
      state.plan = null;
      state.x = 0;
      state.y = 0;
      setTransform(0);
      setFlightState('conversation');
    }
    function resumeAfterPause(delay = 2200) {
      if (!canExplore()) return;
      state.pausedUntil = performance.now() + delay;
      setFlightState('rest');
    }
    function updateGaze() {
      if (!state.pointer || mobileOrReduced()) return;
      const center = visualCenter();
      const dx = state.pointer.x - center.x;
      const dy = state.pointer.y - center.y;
      const length = Math.max(1, Math.hypot(dx, dy));
      const reach = Math.min(3.4, length / 58);
      toggle.style.setProperty('--node-x', `${(dx / length * reach).toFixed(2)}px`);
      toggle.style.setProperty('--node-y', `${(dy / length * reach * .72).toFixed(2)}px`);
    }
    function tick(now) {
      updateGaze();
      if (state.plan) {
        const elapsed = (now - state.plan.started) / state.plan.duration;
        if (elapsed < 0) {
          setTransform(-1.5);
        } else {
          const t = Math.min(1, elapsed);
          const eased = t * t * (3 - 2 * t);
          const x = cubic(state.plan.from.x, state.plan.c1.x, state.plan.c2.x, state.plan.to.x, eased);
          const y = cubic(state.plan.from.y, state.plan.c1.y, state.plan.c2.y, state.plan.to.y, eased);
          const ahead = Math.min(1, eased + .015);
          const ax = cubic(state.plan.from.x, state.plan.c1.x, state.plan.c2.x, state.plan.to.x, ahead);
          const ay = cubic(state.plan.from.y, state.plan.c1.y, state.plan.c2.y, state.plan.to.y, ahead);
          state.x = x - state.baseX - state.size / 2;
          state.y = y - state.baseY - state.size / 2;
          setTransform(Math.max(-8, Math.min(8, Math.atan2(ay - y, ax - x) * 180 / Math.PI * .22)));
          if (t >= 1) { state.plan = null; setTransform(0); setFlightState('rest'); state.pausedUntil = now + 1500 + Math.random() * 1800; }
        }
      } else if (canExplore() && now >= state.pausedUntil) start();
      state.raf = requestAnimationFrame(tick);
    }
    function pointerMove(event) {
      if (event.pointerType === 'touch') {
        state.pointer = { x: event.clientX, y: event.clientY };
        window.setTimeout(() => { state.pointer = null; toggle.style.setProperty('--node-x', '0px'); toggle.style.setProperty('--node-y', '0px'); }, 900);
        return;
      }
      state.pointer = { x: event.clientX, y: event.clientY };
      const center = visualCenter();
      if (Math.hypot(event.clientX - center.x, event.clientY - center.y) < proximityRadius && canExplore()) stop('near');
    }
    function pointerExit() { state.pointer = null; toggle.style.setProperty('--node-x', '0px'); toggle.style.setProperty('--node-y', '0px'); }
    function layoutChanged() { state.dirty = true; if (state.plan) stop('rest'); resumeAfterPause(600); }
    function scrollChanged() { stop('rest'); state.dirty = true; window.clearTimeout(state.scrollTimer); state.scrollTimer = window.setTimeout(() => { refreshZones(); resumeAfterPause(700); }, 180); }
    function setPinned(value) {
      state.pinned = value;
      pinButton.setAttribute('aria-pressed', String(value));
      pinButton.textContent = value ? 'Liberar asistente' : 'Fijar asistente';
      savePinned();
      if (value) stop('pinned'); else resumeAfterPause(1300);
    }
    function init() {
      resetBase();
      state.pinned = readPinned();
      setPinned(state.pinned);
      document.addEventListener('pointermove', pointerMove, { passive: true });
      document.addEventListener('mouseout', (event) => { if (!event.relatedTarget) pointerExit(); });
      toggle.addEventListener('pointerenter', () => stop('near'));
      toggle.addEventListener('pointerleave', () => resumeAfterPause(2100));
      toggle.addEventListener('focus', () => stop('near'));
      toggle.addEventListener('blur', () => resumeAfterPause(2100));
      pinButton.addEventListener('click', () => setPinned(!state.pinned));
      globalThis.addEventListener('resize', layoutChanged, { passive: true });
      globalThis.addEventListener('scroll', scrollChanged, { passive: true });
      compactViewport?.addEventListener?.('change', layoutChanged);
      requestAnimationFrame(tick);
      resumeAfterPause(2300);
    }
    function destroy() { cancelAnimationFrame(state.raf); window.clearTimeout(state.scrollTimer); }
    return { init, stop, settleForPanel, resumeAfterPause, destroy, layoutChanged };
  })();

  const onVisibilityChange = () => {
    if (document.hidden) {
      flight.stop('rest');
      window.clearTimeout(blinkTimer);
      window.clearTimeout(gestureTimer);
      delete widget.dataset.nodeGesture;
    } else {
      scheduleBlink();
      flight.layoutChanged();
    }
  };
  document.addEventListener('visibilitychange', onVisibilityChange);
  globalThis.addEventListener('pagehide', () => {
    window.clearTimeout(blinkTimer);
    window.clearTimeout(gestureTimer);
    window.clearTimeout(joyTimer);
    window.clearTimeout(errorTimer);
    window.clearTimeout(greetingTimer);
    flight.destroy();
  }, { once: true });
  reducedMotion?.addEventListener?.('change', onVisibilityChange);
  setNodeState('idle');
  flight.init();
  startGreetingOnce();
  scheduleBlink();
})();
