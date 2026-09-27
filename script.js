// ===== INICIO: INTERACCIONES EDITORIALES NODE (2026-08-20) =====
// ===== INICIO: PRESENTACION NODE =====
(() => {
  const intro = document.querySelector('[data-intro]');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const key = 'node-intro-preview-v11';
  const preview = new URLSearchParams(location.search).has('intro');
  if (!intro) return;
  // try { if (!preview && sessionStorage.getItem(key) === 'true') return; } catch {}
  const canvas = intro.querySelector('canvas'), ctx = canvas?.getContext('2d');
  if (!ctx) return;
  const counter = intro.querySelector('[data-intro-progress]'), skip = intro.querySelector('[data-intro-skip]');
  const siblings = [...document.body.children].filter(el => el !== intro && el.tagName !== 'SCRIPT');
  const inertStates = siblings.map(el => el.inert);
  const clamp = n => Math.max(0, Math.min(1,n));
  const ease = n => { n=clamp(n); return n*n*n*(n*(n*6-15)+10); };
  const mix = (a,b,t) => a+(b-a)*t;
  let width,height,dpr,frame,start,closed=false,revealing=false,failsafe;
  // Cached spherical normals, broad studio reflections and a pearl coating.
  // The animation only composites these surfaces; no per-frame pixel shading.
  function material(size, tone, pearl=false) {
    const surface=document.createElement('canvas');surface.width=surface.height=size;
    const c=surface.getContext('2d'), pixels=c.createImageData(size,size);
    const base=[[33,67,112],[122,152,181],[196,204,205]][tone];
    for(let y=0;y<size;y++) for(let x=0;x<size;x++) {
      const nx=(x+.5-size/2)/(size*.487), ny=(y+.5-size/2)/(size*.487);
      const r2=nx*nx+ny*ny;if(r2>=1)continue;
      const nz=Math.sqrt(1-r2), i=(y*size+x)*4;
      const light=Math.max(0,-nx*.42-ny*.58+nz*.69);
      const softbox=Math.exp(-((nx+.28)**2/.18+(ny+.48)**2/.065));
      const edge=Math.pow(1-nz,2.4);
      const lower=Math.exp(-((nx-.38)**2/.38+(ny-.4)**2/.22));
      const cloud=clamp(.5+.32*Math.sin(nx*3.1+ny*2.6)+.14*Math.cos(ny*5-nx*2));
      for(let k=0;k<3;k++) {
        let value=base[k]*(.60+.40*light);
        if(pearl) value=mix([49,86,132][k],[231,235,230][k],clamp(cloud*.72+light*.3));
        value=mix(value,[255,253,246][k],clamp(softbox*.76+edge*(pearl?.84:.35)));
        value=mix(value,[174,200,219][k],lower*(pearl?.44:.12));
        pixels.data[i+k]=value;
      }
      pixels.data[i+3]=Math.round(255*clamp((1-Math.sqrt(r2))*size*.48));
    }
    c.putImageData(pixels,0,0);return surface;
  }
  const surfaces=[material(160,0),material(160,1),material(160,2),material(768,1,true)];
  const nodes=[[-.31,.12,.24,27,1],[-.23,-.17,.4,24,0],[.28,-.25,-.2,17,2],
    [.22,.23,.44,27,0],[-.045,.17,-.22,12,1],[.09,.35,-.3,10,2],
    [-.16,.39,-.2,7,0],[.38,.15,-.34,8,1],[.4,.065,-.28,9,2],
    [-.46,.29,.55,30,0],[.47,-.005,-.3,6,2],[.57,.005,-.35,6,0],
    [-.035,-.025,-.05,7,0],[.025,-.01,.12,8,1],[.035,.05,-.12,6,2],
    [-.08,.07,.0,8,0],[.31,-.008,-.15,7,1]];
  function resize() {
    width=innerWidth;height=innerHeight;dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function finish(immediate=false) {
    if(closed)return;closed=true;cancelAnimationFrame(frame);clearTimeout(failsafe);
    removeEventListener('resize',resize);document.removeEventListener('keydown',onKey);
    motion.removeEventListener('change',onMotion);
    try{sessionStorage.setItem(key,'true')}catch{}
    const returnFocus=intro.contains(document.activeElement);
    intro.dataset.phase='done';document.body.classList.add('intro-revealing');
    setTimeout(()=>{
      intro.hidden=true;document.body.classList.remove('intro-active','intro-revealing');
      siblings.forEach((el,i)=>{el.inert=inertStates[i]});
      if(returnFocus)document.querySelector('[data-header] .brand')?.focus({preventScroll:true});
    },0);
  }
  function onKey(e) {
    if(e.key==='Escape'){e.preventDefault();finish()}
    if(e.key==='Tab'){e.preventDefault();skip?.focus({preventScroll:true})}
  }
  function onMotion(){if(motion.matches)finish(true)}
  function sphere(x,y,r,tone,alpha=1,blur=0) {
    if(r<.2||alpha<=0)return;
    ctx.save();ctx.globalAlpha=alpha;
    if(blur>.2)ctx.filter=`blur(${blur}px)`;
    ctx.drawImage(surfaces[tone],x-r,y-r,r*2,r*2);ctx.restore();
  }
  function draw(now) {
    if(closed)return;start??=now;const elapsed=now-start;
    const t=elapsed*1.5;
    const phase=elapsed<450?'entering':elapsed<1750?'converging':elapsed<2900?'formed':'revealing';
    if(intro.dataset.phase!==phase)intro.dataset.phase=phase;
    ctx.clearRect(0,0,width,height);
    const scale=Math.min(width*.77,height*1.05,930), cx=width*.5,cy=height*.46;
    const shrink=1-ease((t-650)/1900), grow=ease((t-2500)/1100);
    ctx.globalAlpha=ease(elapsed/400);
    const yaw=.10*Math.sin(t/1600)*shrink;
    const points=nodes.map(([x,y,z,r,tone],i)=>{
      const pull=1-ease((t-650-i*16)/1600),depth=1+z*.38;
      const px=x*Math.cos(yaw)+z*.12*Math.sin(yaw);
      return {x:cx+(px+Math.sin(t/1800+i)*.008)*scale*pull*depth,
        y:cy+(y+Math.cos(t/2100+i)*.008)*scale*pull*depth,
        r:r*Math.max(.52,scale/850)*depth*mix(.14,1,pull),tone,z,pull};
    });
    ctx.lineWidth=.65;ctx.strokeStyle=`rgba(25,58,103,${.20*shrink})`;
    points.forEach(p=>{ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(p.x,p.y);ctx.stroke()});
    points.sort((a,b)=>a.z-b.z).forEach(p=>sphere(p.x,p.y,p.r,p.tone,clamp(p.pull*3),Math.max(0,p.z)*3*p.pull));
    // The hero orb is born on the far-right branch, follows that actual
    // connection into the central node, then drops and expands. This keeps
    // the object physically attached to the network throughout the reveal.
    const source=nodes[11];
    const sourceX=cx+source[0]*scale*(1+source[2]*.38);
    const sourceY=cy+source[1]*scale*(1+source[2]*.38);
    const travel=ease((t-950)/1450);
    const drop=ease((t-2500)/1500);
    const pathX=mix(sourceX,cx,travel);
    const pathY=mix(sourceY,cy,travel);
    const orbX=mix(pathX,cx,drop);
    // Keep the formed orb centered, including narrow mobile viewports.
    const orbY=mix(pathY,height*.46,drop);
    const orbR=mix(4,Math.max(13,scale*.027),travel);
      const finalR=Math.min(width,height)*.25;
    const orbRadius=mix(orbR,finalR,grow);
    const alpha=ease((t-750)/450);
    const halo=ctx.createRadialGradient(orbX,orbY,orbRadius*.8,orbX,orbY,orbRadius*1.22);
    halo.addColorStop(0,`rgba(219,228,237,${alpha*.25})`);halo.addColorStop(1,'rgba(219,228,237,0)');
    ctx.fillStyle=halo;ctx.fillRect(orbX-orbRadius*1.22,orbY-orbRadius*1.22,orbRadius*2.44,orbRadius*2.44);
    sphere(orbX,orbY,orbRadius,3,alpha);
    // The word shares the sphere's exact opacity, position and scale.
    ctx.save();
    ctx.globalAlpha=alpha;
    ctx.textAlign='center';
    ctx.textBaseline='alphabetic';
    // Fit the uppercase word to the visible circular area, including on mobile.
    const visibleTop=Math.max(0,orbY-orbRadius);
    const visibleBottom=Math.min(height,orbY+orbRadius);
    const visibleHeight=Math.max(0,visibleBottom-visibleTop);
    const wordY=(visibleTop+visibleBottom)/2;
    const fontSize=Math.min(orbRadius*.60,visibleHeight*.68);
    const edge=Math.min(orbRadius,Math.abs(wordY-orbY)+fontSize*.38);
    const wordWidth=2*Math.sqrt(Math.max(0,orbRadius*orbRadius-edge*edge))*.92;
    ctx.font=`700 ${Math.max(.1,fontSize)}px Arial, sans-serif`;
    ctx.fillStyle='#193a67';
    const bounds=ctx.measureText('node');
    const baseline=wordY+(bounds.actualBoundingBoxAscent-bounds.actualBoundingBoxDescent)/2;
    if(wordWidth>0 && visibleHeight>0)ctx.fillText('node',orbX,baseline,wordWidth);
    ctx.restore();
    counter.textContent=phase==='entering'?'CONECTAR':phase==='converging'?'INTEGRAR':'ESCALAR';
    if(phase==='revealing'&&!revealing){revealing=true;document.body.classList.add('intro-revealing')}
    if(elapsed>=3600){finish();return}frame=requestAnimationFrame(draw);
  }
  intro.hidden=false;document.body.classList.add('intro-active');
  siblings.forEach(el=>{el.inert=true});resize();
  intro.tabIndex=-1;intro.focus({preventScroll:true});
  addEventListener('resize',resize,{passive:true});document.addEventListener('keydown',onKey);
  motion.addEventListener('change',onMotion);skip?.addEventListener('click',()=>finish(),{once:true});
  failsafe=setTimeout(()=>finish(true),4300);frame=requestAnimationFrame(draw);
})();
// ===== FIN: PRESENTACION NODE =====






const header=document.querySelector('[data-header]');
const menuButton=document.querySelector('[data-menu-button]');
const navigation=document.querySelector('[data-nav]');
const form=document.querySelector('[data-diagnostic-form]');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const setMenu=open=>{if(!menuButton||!navigation)return;navigation.classList.toggle('open',open);menuButton.setAttribute('aria-expanded',String(open));menuButton.querySelector('.sr-only').textContent=open?'Cerrar menú':'Abrir menú'};
window.addEventListener('scroll',()=>header?.classList.toggle('scrolled',scrollY>12),{passive:true});
if(menuButton&&navigation){menuButton.addEventListener('click',()=>setMenu(!navigation.classList.contains('open')));navigation.addEventListener('click',event=>{if(event.target.closest('a'))setMenu(false)});document.addEventListener('click',event=>{if(navigation.classList.contains('open')&&!navigation.contains(event.target)&&!menuButton.contains(event.target))setMenu(false)});document.addEventListener('keydown',event=>{if(event.key==='Escape'&&navigation.classList.contains('open')){setMenu(false);menuButton.focus()}})}
const rotatingWord=document.querySelector('[data-rotating-word]');
if(rotatingWord&&!reduced.matches){const words=['escalar tus proyectos','evolucionar tus procesos','acelerar tu operación','multiplicar tu capacidad','transformar tu empresa'];let index=0;setInterval(()=>{rotatingWord.classList.add('is-changing');setTimeout(()=>{index=(index+1)%words.length;rotatingWord.textContent=words[index];rotatingWord.classList.remove('is-changing')},140)},1800)}
const observer='IntersectionObserver'in window?new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12}):null;document.querySelectorAll('.reveal').forEach(element=>observer?observer.observe(element):element.classList.add('visible'));
if(form){form.addEventListener('submit',event=>{event.preventDefault();const status=form.querySelector('[data-form-status]');form.querySelectorAll('[data-error-for]').forEach(error=>error.textContent='');if(!form.checkValidity()){[...form.elements].filter(field=>field.willValidate&&!field.validity.valid).forEach(field=>{const error=form.querySelector(`[data-error-for="${field.name}"]`);if(error)error.textContent=field.validity.typeMismatch?'Ingrese un correo válido.':'Complete este campo.'});form.reportValidity();if(status)status.textContent='Revise los campos señalados antes de continuar.';return}const data=new FormData(form);const company=data.get('empresa')||'Sin empresa';const subject=`Solicitud de diagnóstico — ${company}`;const body=[`Nombre: ${data.get('nombre')}`,`Empresa: ${company}`,`Correo corporativo: ${data.get('correo')}`,`Rol: ${data.get('rol')}`,'',`¿Qué quiere resolver?`,data.get('problema')].join('\n');if(status)status.textContent='Se abrirá su cliente de correo con la solicitud prellenada.';window.location.href=`mailto:hola@nodeq.com.mx?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`})}
// ===== INICIO: PRIVACIDAD Y COOKIES NODE =====
const consentBar=document.querySelector('[data-consent-bar]');
const privacyDialog=document.querySelector('[data-privacy-dialog]');
const privacyStorageKey='node_privacy_notice_v1';
let privacyReturnFocus=null;
const hasPrivacyPreference=()=>{try{return localStorage.getItem(privacyStorageKey)==='accepted'}catch{return false}};
const savePrivacyPreference=()=>{try{localStorage.setItem(privacyStorageKey,'accepted')}catch{}};
const setPrivacyTab=name=>{
  if(!privacyDialog)return;
  privacyDialog.querySelectorAll('[data-privacy-tab]').forEach(tab=>{const active=tab.dataset.privacyTab===name;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1});
  privacyDialog.querySelectorAll('[data-privacy-panel]').forEach(panel=>{panel.hidden=panel.dataset.privacyPanel!==name});
};
const openPrivacy=()=>{
  if(!privacyDialog)return;
  privacyReturnFocus=document.activeElement;
  privacyDialog.hidden=false;
  document.body.classList.add('privacy-open');
  privacyDialog.querySelector('.privacy-close')?.focus();
};
const closePrivacy=()=>{
  if(!privacyDialog||privacyDialog.hidden)return;
  privacyDialog.hidden=true;
  document.body.classList.remove('privacy-open');
  privacyReturnFocus?.focus?.();
};
if(consentBar&&!hasPrivacyPreference())consentBar.hidden=false;
document.querySelectorAll('[data-privacy-open]').forEach(button=>button.addEventListener('click',openPrivacy));
document.querySelectorAll('[data-privacy-close]').forEach(button=>button.addEventListener('click',closePrivacy));
document.querySelectorAll('[data-consent-accept]').forEach(button=>button.addEventListener('click',()=>{savePrivacyPreference();if(consentBar)consentBar.hidden=true;closePrivacy()}));
privacyDialog?.querySelectorAll('[data-privacy-tab]').forEach(tab=>tab.addEventListener('click',()=>setPrivacyTab(tab.dataset.privacyTab)));
document.addEventListener('keydown',event=>{
  if(!privacyDialog||privacyDialog.hidden)return;
  if(event.key==='Escape'){event.preventDefault();closePrivacy();return}
  if(event.key==='Tab'){
    const focusable=[...privacyDialog.querySelectorAll('button:not([hidden]),a[href], [tabindex]:not([tabindex="-1"])')].filter(element=>!element.closest('[hidden]'));
    if(!focusable.length)return;
    const first=focusable[0],last=focusable.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  }
});
// ===== FIN: PRIVACIDAD Y COOKIES NODE =====
const year=document.querySelector('[data-year]');if(year)year.textContent=new Date().getFullYear();
// Chat transport and guided actions live in chat.js.

// ===== INICIO: ANIMACIONES TECNOLOGICAS NODE =====
(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches) return;

  /* ── Utilidades ── */
  const rand  = (a, b) => a + Math.random() * (b - a);
  const lerp  = (a, b, t) => a + (b - a) * t;

  /* ════════════════════════════════════════════════
     CANVAS 1 — Red de nodos interconectados (Network)
     Sección "Sobre Nosotros"
  ════════════════════════════════════════════════ */
  function initNetworkCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, nodes, raf;
    const PALETTE = { bg: '#0b0e1a', node: '#193a67', line: '#193a67', accent: '#4a7fc1', pulse: '#7eb8f7' };
    const NODE_COUNT = 38;
    const MAX_DIST   = 130;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr  = Math.min(devicePixelRatio || 1, 2);
      W = rect.width;  H = rect.height;
      canvas.width  = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildNodes();
    }

    function buildNodes() {
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: rand(20, W - 20),  y: rand(20, H - 20),
        vx: rand(-0.28, 0.28), vy: rand(-0.22, 0.22),
        r:  rand(2.5, 5),
        pulse: rand(0, Math.PI * 2),
        pulseSpeed: rand(0.018, 0.038),
        color: Math.random() > 0.7 ? PALETTE.accent : PALETTE.node,
      }));
    }

    function draw(now) {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);

      /* fondo con fade sutil */
      ctx.fillStyle = PALETTE.bg;
      ctx.fillRect(0, 0, W, H);

      /* mover nodos */
      nodes.forEach(n => {
        n.x += n.vx;  n.y += n.vy;
        n.pulse += n.pulseSpeed;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });

      /* conexiones */
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.55;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(74,127,193,${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      /* nodos */
      nodes.forEach(n => {
        const glow = (Math.sin(n.pulse) + 1) / 2; /* 0–1 */
        /* halo */
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4);
        grad.addColorStop(0, `rgba(126,184,247,${0.18 * glow})`);
        grad.addColorStop(1, 'rgba(126,184,247,0)');
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad; ctx.fill();
        /* núcleo */
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = lerp(0.6, 1, glow) < 0.8 ? PALETTE.node : PALETTE.pulse;
        ctx.fill();
      });

      /* línea de datos animada */
      const t   = now / 1000;
      const seg = nodes.slice(0, 6);
      ctx.beginPath();
      ctx.moveTo(seg[0].x, seg[0].y);
      seg.forEach((n, i) => { if (i) ctx.lineTo(n.x, n.y); });
      const alpha = 0.35 + 0.25 * Math.sin(t * 1.8);
      ctx.strokeStyle = `rgba(126,184,247,${alpha})`;
      ctx.lineWidth   = 1.4;
      ctx.stroke();
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    raf = requestAnimationFrame(draw);

    /* detener cuando no es visible (rendimiento) */
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { if (!raf) raf = requestAnimationFrame(draw); }
        else { cancelAnimationFrame(raf); raf = null; }
      });
    }, { threshold: 0.05 });
    io.observe(canvas);
  }

  /* ════════════════════════════════════════════════
     CANVAS 2 — Radar HUD holográfico
     Sección "Escenarios" — Iniciamos node cuando:
  ════════════════════════════════════════════════ */
  function initCodeCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, cx, cy, R, raf, blips = [], dataLines = [], angle = 0;

    const C  = { bg: '#0b0e1a', ring: 'rgba(74,127,193,', sweep: 'rgba(126,184,247,', blip: '#7eb8f7', text: 'rgba(126,184,247,' };
    const LABELS = ['SYS.INIT','NODE.SCAN','AI.PROC','OPS.FLOW','DATA.OK','ARCH.V2'];
    const METRICS = [
      '> proc.speed   98.4%',
      '> latency      12ms',
      '> uptime       99.9%',
      '> nodes        active',
      '> pipeline     OK',
      '> deploy       ready',
    ];

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr  = Math.min(devicePixelRatio || 1, 2);
      W = rect.width; H = rect.height;
      canvas.width  = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W / 2; cy = H / 2;
      R  = Math.min(W, H) * 0.38;

      /* generar líneas de datos ficticias */
      dataLines = METRICS.map((text, i) => ({
        text,
        x: 12, y: H - 16 - i * 16,
        alpha: rand(0.35, 0.75),
        blinkSpeed: rand(0.008, 0.022),
        phase: rand(0, Math.PI * 2),
      }));
    }

    function spawnBlip() {
      const a = rand(0, Math.PI * 2);
      const r = rand(R * 0.15, R * 0.92);
      blips.push({
        x: cx + Math.cos(a) * r,
        y: cy + Math.sin(a) * r,
        life: 1, decay: rand(0.008, 0.018),
        label: LABELS[Math.floor(Math.random() * LABELS.length)],
      });
    }

    function draw() {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);

      /* fondo */
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, W, H);

      /* ── Anillos concéntricos ── */
      [1, 0.67, 0.4, 0.18].forEach((frac, i) => {
        const r = R * frac;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `${C.ring}${0.18 + i * 0.06})`;
        ctx.lineWidth   = i === 0 ? 1.2 : 0.6;
        ctx.setLineDash(i > 0 ? [4, 6] : []);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      /* ── Cruz de referencia ── */
      ctx.strokeStyle = `${C.ring}0.14)`;
      ctx.lineWidth   = 0.5;
      ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();

      /* ── Tick marks en anillo exterior ── */
      for (let t = 0; t < 36; t++) {
        const a  = (t / 36) * Math.PI * 2;
        const r1 = R * 0.92, r2 = R * (t % 9 === 0 ? 0.82 : 0.88);
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
        ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
        ctx.strokeStyle = `${C.ring}${t % 9 === 0 ? 0.5 : 0.25})`;
        ctx.lineWidth = t % 9 === 0 ? 1 : 0.5;
        ctx.stroke();
      }

      /* ── Sector de barrido (sweep) ── */
      const sweepAngle = Math.PI / 5;
      const grad = ctx.createConicalGradient
        ? null   /* no nativo, hacemos con arc */
        : null;

      /* dibujamos el cono de luz manualmente */
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R * 0.92, angle, angle + sweepAngle);
      ctx.closePath();
      const gSweep = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.92);
      gSweep.addColorStop(0,    `${C.sweep}0)`);
      gSweep.addColorStop(0.55, `${C.sweep}0.04)`);
      gSweep.addColorStop(1,    `${C.sweep}0.14)`);
      ctx.fillStyle = gSweep;
      ctx.fill();
      ctx.restore();

      /* línea principal del sweep */
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * R * 0.92, cy + Math.sin(angle) * R * 0.92);
      ctx.strokeStyle = `${C.sweep}0.75)`;
      ctx.lineWidth   = 1.5;
      ctx.stroke();

      angle += 0.012;

      /* ── Blips ── */
      /* spawn aleatorio */
      if (Math.random() < 0.025) spawnBlip();

      blips = blips.filter(b => b.life > 0);
      blips.forEach(b => {
        b.life -= b.decay;
        const a = b.life;

        /* halo exterior */
        const halo = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, 12);
        halo.addColorStop(0, `rgba(126,184,247,${a * 0.6})`);
        halo.addColorStop(1, 'rgba(126,184,247,0)');
        ctx.beginPath(); ctx.arc(b.x, b.y, 12, 0, Math.PI * 2);
        ctx.fillStyle = halo; ctx.fill();

        /* punto central */
        ctx.beginPath(); ctx.arc(b.x, b.y, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(126,184,247,${a})`;
        ctx.fill();

        /* etiqueta del blip */
        ctx.fillStyle = `rgba(126,184,247,${a * 0.7})`;
        ctx.font = `500 8px "JetBrains Mono", monospace`;
        ctx.fillText(b.label, b.x + 6, b.y - 6);
      });

      /* ── Punto central ── */
      ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = C.blip; ctx.fill();
      const centerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 20);
      centerGlow.addColorStop(0, 'rgba(126,184,247,0.25)');
      centerGlow.addColorStop(1, 'rgba(126,184,247,0)');
      ctx.beginPath(); ctx.arc(cx, cy, 20, 0, Math.PI * 2);
      ctx.fillStyle = centerGlow; ctx.fill();

      /* ── Ángulo en texto ── */
      const deg = Math.round((angle % (Math.PI * 2)) * (180 / Math.PI));
      ctx.fillStyle = `${C.sweep}0.45)`;
      ctx.font = `500 9px "JetBrains Mono", monospace`;
      ctx.textAlign = 'right';
      ctx.fillText(`${deg}°`, W - 12, 20);
      ctx.textAlign = 'left';

      /* ── Líneas de datos abajo izquierda ── */
      dataLines.forEach(d => {
        d.phase += d.blinkSpeed;
        const a = d.alpha * (0.7 + 0.3 * Math.sin(d.phase));
        ctx.fillStyle = `${C.text}${a})`;
        ctx.font = `400 9px "JetBrains Mono", monospace`;
        ctx.fillText(d.text, d.x, d.y);
      });

      /* ── Etiqueta NODE / RADAR ── */
      ctx.fillStyle = `${C.sweep}0.3)`;
      ctx.font = `500 8px "JetBrains Mono", monospace`;
      ctx.textAlign = 'right';
      ctx.fillText('NODE / RADAR', W - 12, H - 10);
      ctx.textAlign = 'left';
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    raf = requestAnimationFrame(draw);

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { if (!raf) raf = requestAnimationFrame(draw); }
        else { cancelAnimationFrame(raf); raf = null; }
      });
    }, { threshold: 0.05 });
    io.observe(canvas);
  }

  /* ── Inicializar todos los canvas ── */
  document.querySelectorAll('[data-tech-canvas]').forEach(canvas => {
    const type = canvas.dataset.techCanvas;
    if (type === 'network') initNetworkCanvas(canvas);
    if (type === 'code')    initCodeCanvas(canvas);
    if (type === 'hero')    initHeroCanvas(canvas);
    if (type === 'pcb')     initPCBCanvas(canvas);
  });

  /* ════════════════════════════════════════════════
     CANVAS 3 — Partículas flotantes (Hero background)
  ════════════════════════════════════════════════ */
  function initHeroCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles, raf;
    const COUNT = 55;

    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = canvas.offsetWidth;  H = canvas.offsetHeight;
      canvas.width  = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    function build() {
      particles = Array.from({ length: COUNT }, () => ({
        x: rand(0, W), y: rand(0, H),
        vx: rand(-0.15, 0.15), vy: rand(-0.18, 0.18),
        r:  rand(1, 3.5),
        alpha: rand(0.04, 0.22),
        phase: rand(0, Math.PI * 2),
        speed: rand(0.006, 0.018),
        /* línea trazadora */
        trail: [],
      }));
    }

    function draw(now) {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);

      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.phase += p.speed;
        const a = p.alpha * (0.6 + 0.4 * Math.sin(p.phase));

        /* trail */
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 18) p.trail.shift();

        /* wrap */
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;

        /* dibujar trail */
        if (p.trail.length > 2) {
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          p.trail.forEach(pt => ctx.lineTo(pt.x, pt.y));
          ctx.strokeStyle = `rgba(25,58,103,${a * 0.5})`;
          ctx.lineWidth = p.r * 0.4;
          ctx.stroke();
        }

        /* punto */
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(74,127,193,${a})`;
        ctx.fill();
      });

      /* conexiones cruzadas sutiles entre cercanos */
      const t = now / 1000;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d  = Math.sqrt(dx*dx + dy*dy);
          if (d < 90) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(25,58,103,${(1 - d/90) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);
    resize();
    raf = requestAnimationFrame(draw);
  }

  /* ════════════════════════════════════════════════
     CANVAS 4 — Circuito PCB (Capacidades background)
  ════════════════════════════════════════════════ */
  function initPCBCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, tracks, raf;
    const TRACK_COLOR = 'rgba(25,58,103,1)';
    const NODE_COLOR  = 'rgba(74,127,193,1)';
    const PULSE_COLOR = 'rgba(126,184,247,1)';

    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width  = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildTracks();
    }

    function buildTracks() {
      const GRID = 48;
      tracks = [];
      /* genera trayectorias ortogonales tipo PCB */
      for (let i = 0; i < 22; i++) {
        const sx = (Math.floor(rand(0, W / GRID)) * GRID) + GRID / 2;
        const sy = (Math.floor(rand(0, H / GRID)) * GRID) + GRID / 2;
        const len = Math.floor(rand(3, 9));
        const dir = Math.random() > 0.5 ? 'h' : 'v';
        const segs = [];
        let cx = sx, cy = sy;
        for (let s = 0; s < len; s++) {
          const step = GRID * (Math.random() > 0.5 ? 1 : -1);
          const nx = dir === 'h' ? cx + step : cx;
          const ny = dir === 'v' ? cy + step : cy;
          segs.push({ x1: cx, y1: cy, x2: nx, y2: ny });
          cx = nx; cy = ny;
        }
        tracks.push({
          segs,
          pulse: rand(0, 1),   /* posición del pulso 0-1 */
          speed: rand(0.002, 0.006),
          totalLen: len * GRID,
        });
      }
    }

    function draw() {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);

      tracks.forEach(tr => {
        tr.pulse = (tr.pulse + tr.speed) % 1;
        const pulseDist = tr.pulse * tr.totalLen;
        let accLen = 0;

        tr.segs.forEach(seg => {
          const dx = seg.x2 - seg.x1, dy = seg.y2 - seg.y1;
          const segLen = Math.abs(dx) + Math.abs(dy);

          /* pista base */
          ctx.beginPath();
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
          ctx.strokeStyle = TRACK_COLOR;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          /* vía/nodo en inicio del segmento */
          ctx.beginPath();
          ctx.arc(seg.x1, seg.y1, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = NODE_COLOR;
          ctx.fill();

          /* pulso de señal */
          const localDist = pulseDist - accLen;
          if (localDist >= 0 && localDist <= segLen) {
            const t2 = localDist / segLen;
            const px = seg.x1 + dx * t2;
            const py = seg.y1 + dy * t2;
            const grad = ctx.createRadialGradient(px, py, 0, px, py, 10);
            grad.addColorStop(0, PULSE_COLOR);
            grad.addColorStop(1, 'rgba(126,184,247,0)');
            ctx.beginPath();
            ctx.arc(px, py, 10, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
          }
          accLen += segLen;
        });
      });
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);
    resize();
    raf = requestAnimationFrame(draw);

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { if (!raf) raf = requestAnimationFrame(draw); }
        else { cancelAnimationFrame(raf); raf = null; }
      });
    }, { threshold: 0.05 });
    io.observe(canvas);
  }

  /* ════════════════════════════════════════════════
     Efecto Tilt 3D con mouse en capability cards
  ════════════════════════════════════════════════ */
  (function initTilt3D() {
    const cards = document.querySelectorAll('.capability-card');
    if (!cards.length || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    cards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const r  = card.getBoundingClientRect();
        const cx = r.left + r.width  / 2;
        const cy = r.top  + r.height / 2;
        const dx = (e.clientX - cx) / (r.width  / 2);
        const dy = (e.clientY - cy) / (r.height / 2);
        card.style.transform = `perspective(600px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg) translateY(-4px) scale(1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  })();

  /* ════════════════════════════════════════════════
     IntersectionObserver ampliado — nuevos elementos
  ════════════════════════════════════════════════ */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  /* Elementos extra a revelar (que NO usan .reveal) */
  document.querySelectorAll(
    '.process-list li, .capability-card, .hero-facts > div, .problem-grid article, .founders-visual'
  ).forEach(el => revealObs.observe(el));

  /* ════════════════════════════════════════════════
     Cursor data-trail en la sección hero (sutil)
  ════════════════════════════════════════════════ */
  (function initCursorEffect() {
    const hero = document.querySelector('.hero');
    if (!hero || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const canvas = hero.querySelector('.hero-bg-canvas');
    if (!canvas) return;

    let mx = -1000, my = -1000;
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
      canvas.style.setProperty('--mx', mx + 'px');
      canvas.style.setProperty('--my', my + 'px');
    });
    hero.addEventListener('mouseleave', () => { mx = -1000; my = -1000; });
  })();

})();
// ===== FIN: ANIMACIONES TECNOLOGICAS NODE =====
// ===== FIN: INTERACCIONES EDITORIALES NODE =====
