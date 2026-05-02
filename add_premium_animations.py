import os

file_path = r'c:\Users\monst\Documents\movilidad nod\N-main\index.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Global Mouse Spotlight
glow_html = """
<!-- PREMIUM CURSOR GLOW -->
<div id="premium-cursor-glow"></div>
<style>
#premium-cursor-glow {
    position: fixed;
    top: 0; left: 0;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(0, 255, 204, 0.05) 0%, transparent 60%);
    border-radius: 50%;
    pointer-events: none;
    transform: translate(-50%, -50%);
    z-index: 9999;
    mix-blend-mode: screen;
    transition: opacity 0.3s;
    opacity: 0;
}
</style>
<script>
document.addEventListener('DOMContentLoaded', () => {
    const glow = document.getElementById('premium-cursor-glow');
    let timeout;
    
    document.addEventListener('mousemove', (e) => {
        glow.style.opacity = '1';
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
        
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            glow.style.opacity = '0';
        }, 1500); // Glow fades after 1.5s of inactivity
    });
    
    document.addEventListener('mouseleave', () => glow.style.opacity = '0');
});
</script>
"""

# Insert glow before </body>
if '</body>' in content:
    content = content.replace('</body>', glow_html + '\n</body>')


# 2. Blobs in Productos
productos_target = '<section id="productos">'
productos_anim = """<section id="productos" style="position: relative; overflow: hidden;">
<!-- PREMIUM BACKGROUND BLOBS -->
<div class="premium-blobs-container">
    <div class="premium-blob blob-1"></div>
    <div class="premium-blob blob-2"></div>
</div>
<style>
.premium-blobs-container {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    overflow: hidden; z-index: 0; pointer-events: none;
}
.premium-blob {
    position: absolute;
    filter: blur(90px);
    border-radius: 50%;
    animation: blobFloat 25s infinite alternate ease-in-out;
    opacity: 0.35;
}
.blob-1 { width: 500px; height: 500px; background: rgba(0, 255, 204, 0.4); top: -10%; left: -100px; }
.blob-2 { width: 600px; height: 600px; background: rgba(100, 50, 255, 0.3); bottom: -10%; right: -150px; animation-delay: -5s; }

@keyframes blobFloat {
    0% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(150px, 200px) scale(1.1); }
    66% { transform: translate(-100px, 350px) scale(0.9); }
    100% { transform: translate(100px, -100px) scale(1); }
}
#productos > .container { position: relative; z-index: 2; }
</style>
"""
if productos_target in content:
    content = content.replace(productos_target, productos_anim)


# 3. Data Streams in Proceso
proceso_target = '<section id="proceso">'
proceso_anim = """<section id="proceso" style="position: relative; overflow: hidden;">
<!-- CYBERPUNK DATA STREAMS -->
<div class="data-streams">
    <div class="stream" style="left: 15%; animation-duration: 4s; animation-delay: 0s;"></div>
    <div class="stream" style="left: 45%; animation-duration: 5s; animation-delay: 1.5s;"></div>
    <div class="stream" style="left: 75%; animation-duration: 3.5s; animation-delay: 0.5s;"></div>
    <div class="stream" style="left: 90%; animation-duration: 6s; animation-delay: 2.5s;"></div>
</div>
<style>
.data-streams {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 0;
}
.stream {
    position: absolute; top: -150px; width: 1px; height: 150px;
    background: linear-gradient(to bottom, transparent, rgba(0, 255, 204, 0.8), transparent);
    opacity: 0;
    animation: streamDrop linear infinite;
}
@keyframes streamDrop {
    0% { transform: translateY(-100%); opacity: 0; }
    10% { opacity: 0.6; }
    80% { opacity: 0.6; }
    100% { transform: translateY(1500px); opacity: 0; }
}
#proceso > .container { position: relative; z-index: 1; }
</style>
"""
if proceso_target in content:
    content = content.replace(proceso_target, proceso_anim)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Premium animations added successfully.")
