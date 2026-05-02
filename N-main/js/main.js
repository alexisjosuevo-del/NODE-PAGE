/* NODE landing interactions (original) */
(function(){
  const qs = (s, el=document)=>el.querySelector(s);
  const qsa = (s, el=document)=>Array.from(el.querySelectorAll(s));

  // Year
  const y = qs('#year');
  if (y) y.textContent = new Date().getFullYear();

  // Mobile nav
  const navToggle = qs('#navToggle');
  const navLinks = qs('#navLinks');
  if (navToggle && navLinks){
    navToggle.addEventListener('click', ()=>{
      const open = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });

    // Close on link click (mobile)
    navLinks.addEventListener('click', (e)=>{
      const a = e.target.closest('a');
      if (!a) return;
      if (navLinks.classList.contains('is-open')){
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Dropdowns
  qsa('.dropdown').forEach(dd=>{
    const btn = qs('.dropdown__btn', dd);
    if (!btn) return;
    btn.addEventListener('click', (e)=>{
      e.preventDefault();
      const isOpen = dd.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(isOpen));

      // close others
      qsa('.dropdown').forEach(other=>{
        if (other !== dd){
          other.classList.remove('is-open');
          const ob = qs('.dropdown__btn', other);
          if (ob) ob.setAttribute('aria-expanded','false');
        }
      });
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', (e)=>{
    if (e.target.closest('.dropdown')) return;
    qsa('.dropdown').forEach(dd=>{
      dd.classList.remove('is-open');
      const b = qs('.dropdown__btn', dd);
      if (b) b.setAttribute('aria-expanded','false');
    });
  });

  // Tabs
  qsa('[data-tabs]').forEach(root=>{
    const tabs = qsa('.tab', root);
    const panes = qsa('.tabpane', root);

    const activate = (key)=>{
      tabs.forEach(t=>{
        const active = t.dataset.tab === key;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });
      panes.forEach(p=>{
        p.classList.toggle('is-active', p.dataset.pane === key);
      });
    };

    tabs.forEach(t=>{
      t.addEventListener('click', ()=>activate(t.dataset.tab));
    });
  });

  // Before/After slider
  qsa('[data-ba]').forEach(ba=>{
    const range = qs('.ba__range', ba);
    const before = qs('.ba__layer--before', ba);
    const handle = qs('.ba__handle', ba);
    if (!range || !before || !handle) return;

    const sync = ()=>{
      const v = Number(range.value);
      before.style.width = v + '%';
      handle.style.left = v + '%';
    };
    range.addEventListener('input', sync);
    sync();
  });

  // Count-up on view
  const counters = qsa('[data-count]');
  if ('IntersectionObserver' in window && counters.length){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(ent=>{
        if (!ent.isIntersecting) return;
        const el = ent.target;
        io.unobserve(el);

        const target = Number(el.dataset.count || '0');
        const isInt = Number.isInteger(target);
        const dur = 900;
        const t0 = performance.now();

        const step = (t)=>{
          const p = Math.min(1, (t - t0)/dur);
          const val = target * (0.15 + 0.85 * easeOutCubic(p));
          el.textContent = (isInt ? Math.round(val) : val.toFixed(1));
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = String(target);
        };
        requestAnimationFrame(step);
      });
    }, {threshold: 0.5});
    counters.forEach(c=>io.observe(c));
  }

  function easeOutCubic(x){ return 1 - Math.pow(1-x, 3); }

  // Demo lead submit: store locally + show toast
  window.NODE_submitLead = function(evt){
    evt.preventDefault();
    const form = evt.target;
    const data = Object.fromEntries(new FormData(form).entries());
    const key = 'node_leads';
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    list.push({ ...data, ts: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(list));
    form.reset();
    toast('¡Listo! Guardé tu mensaje localmente. Conecta un formulario real para recibirlo en tu correo.');
    return false;
  };

  function toast(msg){
    let t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(()=>t.classList.add('is-on'));
    setTimeout(()=>t.classList.remove('is-on'), 3300);
    setTimeout(()=>t.remove(), 3800);
  }

  // inject toast styles (keeps css file lean)
  const s = document.createElement('style');
  s.textContent = `
    .toast{
      position: fixed;
      left: 50%;
      bottom: 22px;
      transform: translateX(-50%) translateY(10px);
      opacity: 0;
      background: rgba(255,255,255,.96);
      border: 1px solid rgba(15, 23, 42, .12);
      box-shadow: 0 18px 50px rgba(2, 6, 23, .12);
      color: rgba(2, 6, 23, .90);
      padding: 12px 14px;
      border-radius: 16px;
      width: min(720px, calc(100% - 34px));
      z-index: 999;
      transition: opacity .25s ease, transform .25s ease;
      font-weight: 800;
    }
    .toast.is-on{
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  `;
  document.head.appendChild(s);

  // Demo box tabs + mini quote calculator
  qsa('[data-demo="true"]').forEach(box=>{
    const tabs = qsa('[data-demo-tab]', box);
    const panes = qsa('[data-demo-pane]', box);

    const setActive = (key)=>{
      tabs.forEach(t=>t.classList.toggle('is-active', t.dataset.demoTab === key));
      panes.forEach(p=>p.classList.toggle('is-active', p.dataset.demoPane === key));
    };

    tabs.forEach(t=>t.addEventListener('click', ()=>setActive(t.dataset.demoTab)));

    // Quote calculator
    const base = qs('[data-qc="base"]', box);
    const desc = qs('[data-qc="desc"]', box);
    const ivaOn = qs('[data-qc="ivaOn"]', box);
    const total = qs('[data-qc="total"]', box);

    const money = (n)=>{
      try{
        return new Intl.NumberFormat('es-MX', {style:'currency', currency:'MXN', maximumFractionDigits:0}).format(n);
      }catch(e){
        return '$' + Math.round(n).toLocaleString();
      }
    };

    const calc = ()=>{
      if (!total || !base || !desc) return;
      const b = Math.max(0, Number(base.value || 0));
      const d = Math.min(50, Math.max(0, Number(desc.value || 0)));
      const net = b * (1 - (d/100));
      const withIva = ivaOn && ivaOn.checked ? net * 1.16 : net;
      total.textContent = money(withIva);
    };

    [base, desc, ivaOn].forEach(el=> el && el.addEventListener('input', calc));
    calc();
  });

})();
