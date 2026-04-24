import os

file_path = r'c:\Users\monst\Documents\movilidad nod\N-main\index.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Stats -> Radar Sweep
if '<section id="stats">' in content:
    stats_anim = """<section id="stats" style="position: relative; overflow: hidden;">
<!-- ANIMATION: Radar Sweep -->
<div class="anim-radar"></div>
<style>
.anim-radar {
    position: absolute; top: 50%; left: 50%;
    width: 200vw; height: 200vw;
    background: conic-gradient(from 0deg, transparent 70%, rgba(0, 255, 204, 0.08) 100%);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: radarSpin 10s linear infinite;
    pointer-events: none; z-index: 0;
}
@keyframes radarSpin { 100% { transform: translate(-50%, -50%) rotate(360deg); } }
#stats > .container { position: relative; z-index: 1; }
</style>
"""
    content = content.replace('<section id="stats">', stats_anim)


# 2. Problema -> Warning Pulse
if '<section id="problema">' in content:
    problema_anim = """<section id="problema" style="position: relative; overflow: hidden;">
<!-- ANIMATION: Warning Pulse -->
<div class="anim-warning-pulse"></div>
<style>
.anim-warning-pulse {
    position: absolute; top: 50%; left: 50%;
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(255, 100, 100, 0.04) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    border-radius: 50%;
    animation: warningPulse 5s infinite alternate ease-in-out;
    pointer-events: none; z-index: 0;
}
@keyframes warningPulse { 
    0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; } 
    100% { transform: translate(-50%, -50%) scale(4); opacity: 1; } 
}
#problema > .container { position: relative; z-index: 1; }
</style>
"""
    content = content.replace('<section id="problema">', problema_anim)


# 3. Nosotros -> Orbiting Constellation
if '<section id="nosotros">' in content:
    nosotros_anim = """<section id="nosotros" style="position: relative; overflow: hidden;">
<!-- ANIMATION: Orbiting Rings -->
<div class="anim-orbits">
    <div class="orbit orbit-1"><div class="orbit-dot"></div></div>
    <div class="orbit orbit-2"><div class="orbit-dot"></div></div>
    <div class="orbit orbit-3"><div class="orbit-dot"></div></div>
</div>
<style>
.anim-orbits {
    position: absolute; top: 50%; right: -200px;
    width: 600px; height: 600px;
    transform: translateY(-50%);
    pointer-events: none; z-index: 0;
}
.orbit {
    position: absolute; top: 50%; left: 50%;
    border: 1px dashed rgba(255, 255, 255, 0.08);
    border-radius: 50%;
    transform: translate(-50%, -50%);
}
.orbit-1 { width: 300px; height: 300px; animation: orbitSpin 30s linear infinite; }
.orbit-2 { width: 450px; height: 450px; animation: orbitSpin 45s linear infinite reverse; }
.orbit-3 { width: 600px; height: 600px; animation: orbitSpin 60s linear infinite; }
.orbit-dot {
    position: absolute; top: -5px; left: 50%;
    width: 10px; height: 10px; background: #00ffcc;
    border-radius: 50%; box-shadow: 0 0 15px #00ffcc;
    transform: translateX(-50%);
}
@keyframes orbitSpin { 100% { transform: translate(-50%, -50%) rotate(360deg); } }
#nosotros > .container { position: relative; z-index: 1; }
</style>
"""
    content = content.replace('<section id="nosotros">', nosotros_anim)


# 4. Features -> Floating Tech Crosshairs
if '  <section id="features">' in content:
    features_anim = """  <section id="features" style="position: relative; overflow: hidden;">
<!-- ANIMATION: Floating Tech Crosses -->
<div class="anim-crosses">
    <div class="cross" style="top: 20%; left: 10%; animation-delay: 0s;">+</div>
    <div class="cross" style="top: 70%; left: 80%; animation-delay: 2s;">+</div>
    <div class="cross" style="top: 40%; left: 90%; animation-delay: 1s;">+</div>
    <div class="cross" style="top: 80%; left: 20%; animation-delay: 3s;">+</div>
    <div class="cross" style="top: 10%; left: 50%; animation-delay: 1.5s;">+</div>
</div>
<style>
.anim-crosses {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 0;
}
.cross {
    position: absolute;
    color: rgba(0, 255, 204, 0.4);
    font-family: monospace; font-size: 32px; font-weight: 300;
    animation: crossFloat 15s infinite alternate ease-in-out;
}
@keyframes crossFloat {
    0% { transform: translateY(0) rotate(0deg); opacity: 0.1; }
    100% { transform: translateY(-100px) rotate(180deg); opacity: 0.7; }
}
#features > .container { position: relative; z-index: 1; }
</style>
"""
    content = content.replace('  <section id="features">', features_anim)


# 5. FAQ -> Soft Gradient Wave
if '<section id="faq">' in content:
    faq_anim = """<section id="faq" style="position: relative; overflow: hidden;">
<!-- ANIMATION: FAQ Wave -->
<div class="anim-wave"></div>
<style>
.anim-wave {
    position: absolute; bottom: -100px; left: -50%;
    width: 200%; height: 300px;
    background: radial-gradient(ellipse at center, rgba(100, 50, 255, 0.08) 0%, transparent 60%);
    animation: waveMove 10s infinite alternate ease-in-out;
    pointer-events: none; z-index: 0;
}
@keyframes waveMove {
    0% { transform: translateX(0) scaleY(1); }
    100% { transform: translateX(10%) scaleY(1.5); }
}
#faq > .container { position: relative; z-index: 1; }
</style>
"""
    content = content.replace('<section id="faq">', faq_anim)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Additional animations injected successfully.")
