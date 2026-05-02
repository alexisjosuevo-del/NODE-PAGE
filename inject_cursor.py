import os
import re

file_path = r'c:\Users\monst\Documents\movilidad nod\N-main\index.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the old PREMIUM CURSOR GLOW if present
if "<!-- PREMIUM CURSOR GLOW -->" in content:
    # We can try to extract and remove it roughly by splitting, but it's safer to just inject the new one before </body>
    pass

new_cursor_html = """
<!-- CUSTOM CURSOR EFFECT -->
<div class="custom-cursor-dot" id="cursor-dot"></div>
<div class="custom-cursor-ring" id="cursor-ring"></div>
<style>
/* Aseguramos que los cursores custom se vean por encima de TODO */
.custom-cursor-dot {
    position: fixed;
    top: 0; left: 0;
    width: 6px; height: 6px;
    background: #00ffcc;
    border-radius: 50%;
    pointer-events: none;
    z-index: 2147483647;
    transform: translate(-50%, -50%);
    transition: width 0.2s, height 0.2s, opacity 0.3s;
    box-shadow: 0 0 10px #00ffcc;
}
.custom-cursor-ring {
    position: fixed;
    top: 0; left: 0;
    width: 36px; height: 36px;
    border: 1px solid rgba(0, 255, 204, 0.8);
    border-radius: 50%;
    pointer-events: none;
    z-index: 2147483646;
    transform: translate(-50%, -50%);
    transition: width 0.2s, height 0.2s, background-color 0.2s, opacity 0.3s;
    box-shadow: 0 0 15px rgba(0, 255, 204, 0.2) inset;
}

/* Opcional: Ocultar el cursor normal en desktop para que luzca mejor el custom */
@media (hover: hover) and (pointer: fine) {
    body {
        cursor: none;
    }
    a, button, input, textarea, .idash-menu-item, .price-card, .nod-trigger {
        cursor: none !important;
    }
}
</style>
<script>
document.addEventListener("DOMContentLoaded", () => {
    const dot = document.getElementById("cursor-dot");
    const ring = document.getElementById("cursor-ring");
    
    // Si estamos en un dispositivo tactil, ocultamos el custom cursor
    if (window.matchMedia("(max-width: 768px)").matches || !window.matchMedia("(hover: hover)").matches) {
        dot.style.display = 'none';
        ring.style.display = 'none';
        return;
    }
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = window.innerWidth / 2;
    let ringY = window.innerHeight / 2;
    
    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        // El punto sigue instantaneamente
        dot.style.left = mouseX + "px";
        dot.style.top = mouseY + "px";
    });
    
    // El anillo sigue con un smooth delay (lerp)
    function animateCursor() {
        ringX += (mouseX - ringX) * 0.2;
        ringY += (mouseY - ringY) * 0.2;
        ring.style.left = ringX + "px";
        ring.style.top = ringY + "px";
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Hover effects en elementos interactivos
    const interactives = document.querySelectorAll("a, button, input, textarea, .idash-menu-item, .price-card, .nod-trigger");
    interactives.forEach(el => {
        el.addEventListener("mouseenter", () => {
            ring.style.width = "50px";
            ring.style.height = "50px";
            ring.style.backgroundColor = "rgba(0, 255, 204, 0.15)";
            ring.style.border = "1px solid rgba(0, 255, 204, 1)";
            dot.style.width = "0px"; 
            dot.style.height = "0px";
        });
        el.addEventListener("mouseleave", () => {
            ring.style.width = "36px";
            ring.style.height = "36px";
            ring.style.backgroundColor = "transparent";
            ring.style.border = "1px solid rgba(0, 255, 204, 0.8)";
            dot.style.width = "6px";
            dot.style.height = "6px";
        });
    });
});
</script>
"""

# Inject right before </body>
if '</body>' in content:
    content = content.replace('</body>', new_cursor_html + '\n</body>')
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Custom cursor injected successfully.")
else:
    print("Could not find </body>.")
