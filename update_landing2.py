import os

file_path = r'c:\Users\monst\Documents\movilidad nod\N-main\index.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# We will split the file using the known markers
start_marker = "<!-- ─── INTERACTIVE DASHBOARD SECTION ─── -->"
end_marker = "<!-- ─── FOOTER — NODE MEDIANOCHE (único dark) ─── -->"

if start_marker in content and end_marker in content:
    pre_content = content.split(start_marker)[0]
    post_content = content.split(end_marker)[1]
    
    new_injected_block = """<!-- ─── INTERACTIVE DASHBOARD SECTION ─── -->
<style>
/* SCOPED CSS FOR INTERACTIVE DASHBOARD */
.interactive-dash-section {
    display: flex;
    height: 90vh;
    min-height: 700px;
    background-color: #050508;
    color: #fff;
    font-family: 'Inter', sans-serif;
    position: relative;
    overflow: hidden;
    background-image: 
        radial-gradient(circle at 50% 0%, rgba(0, 255, 204, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 100% 100%, rgba(100, 50, 255, 0.1) 0%, transparent 50%);
}

.interactive-dash-section * {
    box-sizing: border-box;
}

/* MAIN CONTAINER (CENTERED) */
.idash-main-view {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;
    background-image: 
        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 50px 50px;
    perspective: 1500px;
    cursor: grab; /* Indicador de que se puede mover */
}

.idash-main-view:active {
    cursor: grabbing;
}

/* TABLET CONTAINER */
.idash-tablet-container {
    position: absolute; /* Para permitir moverla libremente */
    width: 850px;
    height: 550px;
    border-radius: 35px;
    background: #111;
    box-shadow: 
        0 0 0 10px #222,
        0 0 0 12px #444,
        0 0 0 14px #111,
        30px 40px 60px rgba(0,0,0,0.8),
        -10px -10px 30px rgba(0, 255, 204, 0.1);
    transition: transform 0.1s ease-out;
    transform-style: preserve-3d;
    user-select: none;
}

.idash-tablet-container::before {
    content: '';
    position: absolute;
    left: -15px; 
    top: 50%;
    transform: translateY(-50%);
    width: 8px;
    height: 8px;
    background: #050510;
    border-radius: 50%;
    box-shadow: inset 0 0 2px rgba(255,255,255,0.4);
    z-index: 100;
}

.idash-tablet-screen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 25px; 
    background-color: #000;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    border: 2px solid #0a0a0a;
}

.idash-image-wrapper {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    pointer-events: none;
}

.idash-screen-image {
    width: 100%;
    height: 100%;
    object-fit: cover; 
    opacity: 0;
    transition: opacity 0.6s ease;
    animation: panDashboard 25s infinite alternate ease-in-out;
    transform-origin: center center;
}

.idash-screen-image.loaded {
    opacity: 1;
}

@keyframes panDashboard {
    0% { transform: scale(1.1) translate(0%, 0%); }
    25% { transform: scale(1.2) translate(-3%, -2%); }
    50% { transform: scale(1.15) translate(2%, 3%); }
    75% { transform: scale(1.2) translate(3%, -3%); }
    100% { transform: scale(1.1) translate(0%, 0%); }
}

.idash-tech-overlay {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    pointer-events: none;
    mix-blend-mode: screen;
    z-index: 10;
}

.idash-scanner-line {
    position: absolute;
    width: 100%;
    height: 2px;
    background: #00ffcc;
    box-shadow: 0 0 20px 4px rgba(0, 255, 204, 0.5);
    opacity: 0.5;
    animation: scanTablet 4s linear infinite;
}

@keyframes scanTablet {
    0% { top: -10%; opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { top: 110%; opacity: 0; }
}

.idash-data-point {
    position: absolute;
    width: 10px;
    height: 10px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 0 15px 5px rgba(0, 255, 204, 0.5);
    animation: pulseData 2s infinite alternate;
}
.idash-dp1 { top: 30%; left: 40%; animation-delay: 0s; }
.idash-dp2 { top: 60%; left: 70%; animation-delay: 0.5s; }
.idash-dp3 { top: 20%; left: 80%; animation-delay: 1s; }

@keyframes pulseData {
    0% { transform: scale(0.5); opacity: 0.3; }
    100% { transform: scale(1.5); opacity: 0.9; }
}

.idash-app-header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 15px 25px;
    background: linear-gradient(to bottom, rgba(0,0,0,0.9), transparent);
    z-index: 20;
    display: flex;
    justify-content: space-between;
    align-items: center;
    pointer-events: none;
}

.idash-app-title {
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 1px;
    color: #00ffcc;
    text-shadow: 0 2px 5px rgba(0,0,0,0.8);
}

.idash-loader {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 50px; height: 50px;
    border: 4px solid rgba(0,255,204,0.1);
    border-top-color: #00ffcc;
    border-radius: 50%;
    animation: spin 1s infinite linear;
    display: none;
    z-index: 50;
}

@media (max-width: 900px) {
    .interactive-dash-section {
        height: auto;
        min-height: 500px;
        padding: 40px 0;
    }
    .idash-tablet-container {
        transform: scale(0.4) !important;
        position: relative;
    }
}
</style>

<section id="interactive-dashboard" class="interactive-dash-section">
    <!-- Vista Principal (Sin Sidebar) -->
    <main class="idash-main-view" id="idashMainView">
        <div class="idash-tablet-container" id="idashTablet">
            <div class="idash-tablet-screen">
                <div class="idash-app-header">
                    <span class="idash-app-title" id="idashAppTitle">Cargando...</span>
                    <span style="font-size: 13px; font-weight: bold; color: #fff;">100% 🔋</span>
                </div>
                
                <div class="idash-image-wrapper">
                    <img src="../img1.png" class="idash-screen-image loaded" id="idashDisplayImage">
                </div>
                
                <div class="idash-tech-overlay">
                    <div class="idash-scanner-line"></div>
                    <div class="idash-data-point idash-dp1"></div>
                    <div class="idash-data-point idash-dp2"></div>
                    <div class="idash-data-point idash-dp3"></div>
                </div>

                <div class="idash-loader" id="idashLoader"></div>
            </div>
        </div>
    </main>
</section>

<script>
document.addEventListener("DOMContentLoaded", function() {
    const imagesList = [
        { src: '../img1.png', title: 'Dashboard Principal' },
        { src: '../img2.png', title: 'Módulo de CRM' },
        { src: '../img3.png', title: 'Analítica Avanzada' },
        { src: '../img4.png', title: 'Reporte de Operaciones' },
        { src: '../img5.png', title: 'Flujo Financiero' },
        { src: '../img6.png', title: 'Métricas de Marketing' },
        { src: '../img7.png', title: 'Rendimiento Global' },
        { src: '../img8.png', title: 'Configuración del Sistema' }
    ];

    let currentIndex = 0;
    const imgElement = document.getElementById('idashDisplayImage');
    const loader = document.getElementById('idashLoader');
    const titleEl = document.getElementById('idashAppTitle');
    
    // Configurar la primera imagen
    titleEl.textContent = imagesList[0].title;

    function nextImage() {
        currentIndex = (currentIndex + 1) % imagesList.length;
        const item = imagesList[currentIndex];
        
        imgElement.classList.remove('loaded');
        loader.style.display = 'block';

        setTimeout(() => {
            imgElement.src = item.src;
            titleEl.textContent = item.title;
            
            // Randomizar puntos de datos
            document.querySelectorAll('.idash-data-point').forEach(dp => {
                dp.style.top = (20 + Math.random() * 60) + '%';
                dp.style.left = (20 + Math.random() * 60) + '%';
            });

            imgElement.onload = () => {
                loader.style.display = 'none';
                imgElement.classList.add('loaded');
            };
        }, 400); 
    }

    // Cambiar imagen automáticamente cada 4 segundos
    setInterval(nextImage, 4000);

    // Sistema de Drag and Drop + Parallax
    const mainView = document.getElementById('idashMainView');
    const tablet = document.getElementById('idashTablet');
    
    let isDragging = false;
    let startX, startY;
    let initialX = 0, initialY = 0; // Offset actual
    let currentRotateX = 0, currentRotateY = 0; // Rotación actual del parallax
    
    // Centrar inicialmente
    function centerTablet() {
        if(window.innerWidth > 900) {
            tablet.style.left = '50%';
            tablet.style.top = '50%';
            tablet.style.marginLeft = '-425px'; // la mitad del ancho (850)
            tablet.style.marginTop = '-275px';  // la mitad del alto (550)
        }
    }
    centerTablet();
    window.addEventListener('resize', centerTablet);

    if (mainView && tablet) {
        // Eventos para Drag
        mainView.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX - initialX;
            startY = e.clientY - initialY;
            tablet.style.transition = 'none'; // Quitar transición al arrastrar para que sea instantáneo
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
            tablet.style.transition = "transform 0.1s ease-out";
        });

        // Combinar Drag y Parallax en mousemove
        mainView.addEventListener('mousemove', (e) => {
            // Drag Logic
            if (isDragging) {
                initialX = e.clientX - startX;
                initialY = e.clientY - startY;
            }
            
            // Parallax Logic
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            currentRotateX = ((centerY - mouseY) / 35).toFixed(2);
            currentRotateY = ((mouseX - centerX) / 35).toFixed(2);
            
            // Aplicar ambas transformaciones (Translate del Drag + Rotate del Parallax)
            tablet.style.transform = `translate(${initialX}px, ${initialY}px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) translateZ(20px)`;
        });

        mainView.addEventListener('mouseleave', () => {
            if(!isDragging) {
                tablet.style.transition = "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)";
                tablet.style.transform = `translate(${initialX}px, ${initialY}px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
            }
        });

        mainView.addEventListener('mouseenter', () => {
            tablet.style.transition = "transform 0.1s ease-out";
        });
    }
});
</script>

""" + end_marker

    final_content = pre_content + new_injected_block + post_content
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(final_content)
    print("Success: Sidebar removed and auto-scroll/drag added.")
else:
    print("Error: Markers not found in the file.")
