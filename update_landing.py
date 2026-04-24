import os

file_path = r'c:\Users\monst\Documents\movilidad nod\N-main\index.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """</section>

<!-- ─── FOOTER — NODE MEDIANOCHE (único dark) ─── -->"""

replacement = """</section>

<!-- ─── INTERACTIVE DASHBOARD SECTION ─── -->
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

/* SIDEBAR */
.idash-sidebar {
    width: 300px;
    background: rgba(20, 20, 30, 0.7);
    backdrop-filter: blur(20px);
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    padding: 40px 20px;
    display: flex;
    flex-direction: column;
    z-index: 100;
    box-shadow: 5px 0 30px rgba(0,0,0,0.5);
}

.idash-sidebar-header {
    margin-bottom: 30px;
    text-align: center;
}

.idash-sidebar-header h2 {
    font-weight: 800;
    font-size: 28px;
    letter-spacing: 2px;
    color: #fff;
    text-transform: uppercase;
    margin: 0;
}
.idash-sidebar-header span {
    color: #00ffcc;
}

.idash-menu-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow-y: auto;
    padding-right: 5px;
    margin: 0;
}

.idash-menu-list::-webkit-scrollbar { width: 4px; }
.idash-menu-list::-webkit-scrollbar-thumb { background: #00ffcc; border-radius: 4px; }

.idash-menu-item {
    padding: 14px 20px;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    border: 1px solid transparent;
    color: #888;
    position: relative;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.02);
}

.idash-menu-item::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 4px;
    background: #00ffcc;
    transform: scaleY(0);
    transition: transform 0.4s ease;
    transform-origin: bottom;
}

.idash-menu-item:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.05);
    transform: translateX(5px);
}

.idash-menu-item.active {
    color: #fff;
    background: rgba(0, 255, 204, 0.05);
    border: 1px solid rgba(0, 255, 204, 0.3);
    box-shadow: 0 0 20px rgba(0, 255, 204, 0.5) inset;
}

.idash-menu-item.active::before {
    transform: scaleY(1);
}

/* MAIN CONTAINER */
.idash-main-view {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    background-image: 
        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 50px 50px;
    perspective: 1500px;
}

/* TABLET CONTAINER */
.idash-tablet-container {
    position: relative;
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
        flex-direction: column;
        height: auto;
        min-height: auto;
        padding-bottom: 50px;
    }
    .idash-sidebar {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .idash-tablet-container {
        transform: scale(0.4) !important;
        margin: -100px 0;
    }
}
</style>

<section id="interactive-dashboard" class="interactive-dash-section">
    <!-- Menú Lateral Interactivo -->
    <aside class="idash-sidebar">
        <div class="idash-sidebar-header">
            <h2>NODE<span>.App</span></h2>
        </div>
        <ul class="idash-menu-list" id="idashMenuList">
            <!-- Items generados con JS -->
        </ul>
    </aside>

    <!-- Vista Principal -->
    <main class="idash-main-view">
        <div class="idash-tablet-container" id="idashTablet">
            <div class="idash-tablet-screen">
                <div class="idash-app-header">
                    <span class="idash-app-title" id="idashAppTitle">Cargando...</span>
                    <span style="font-size: 13px; font-weight: bold; color: #fff;">100% 🔋</span>
                </div>
                
                <div class="idash-image-wrapper">
                    <!-- Note the path assumes images are in the parent directory '../img1.png' -->
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
    const menuItems = [
        { id: 'img1', src: '../img1.png', title: 'Dashboard Principal' },
        { id: 'img2', src: '../img2.png', title: 'Módulo de CRM' },
        { id: 'img3', src: '../img3.png', title: 'Analítica Avanzada' },
        { id: 'img4', src: '../img4.png', title: 'Reporte de Operaciones' },
        { id: 'img5', src: '../img5.png', title: 'Flujo Financiero' },
        { id: 'img6', src: '../img6.png', title: 'Métricas de Marketing' },
        { id: 'img7', src: '../img7.png', title: 'Rendimiento Global' },
        { id: 'img8', src: '../img8.png', title: 'Configuración del Sistema' },
    ];

    const menuList = document.getElementById('idashMenuList');
    if (!menuList) return;
    
    menuItems.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'idash-menu-item' + (index === 0 ? ' active' : '');
        li.textContent = item.title;
        li.onclick = function() {
            idashLoadModule(item.src, item.title, this);
        };
        menuList.appendChild(li);
    });

    document.getElementById('idashAppTitle').textContent = menuItems[0].title;

    function idashLoadModule(imageSrc, title, element) {
        document.querySelectorAll('.idash-menu-item').forEach(el => el.classList.remove('active'));
        element.classList.add('active');

        const img = document.getElementById('idashDisplayImage');
        const loader = document.getElementById('idashLoader');
        const titleEl = document.getElementById('idashAppTitle');
        
        img.classList.remove('loaded');
        loader.style.display = 'block';

        setTimeout(() => {
            img.src = imageSrc;
            titleEl.textContent = title;
            
            document.querySelectorAll('.idash-data-point').forEach(dp => {
                dp.style.top = (20 + Math.random() * 60) + '%';
                dp.style.left = (20 + Math.random() * 60) + '%';
            });

            img.onload = () => {
                loader.style.display = 'none';
                img.classList.add('loaded');
            };
        }, 400); 
    }

    // Efecto Parallax 3D
    const mainView = document.querySelector('.idash-main-view');
    const tablet = document.getElementById('idashTablet');

    if (mainView && tablet) {
        mainView.addEventListener('mousemove', (e) => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            const rotateX = ((centerY - mouseY) / 35).toFixed(2);
            const rotateY = ((mouseX - centerX) / 35).toFixed(2);
            
            tablet.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });

        mainView.addEventListener('mouseleave', () => {
            tablet.style.transition = "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)";
            tablet.style.transform = `rotateX(0deg) rotateY(0deg) translateZ(0px)`;
        });

        mainView.addEventListener('mouseenter', () => {
            tablet.style.transition = "transform 0.1s ease-out";
        });
    }
});
</script>

<!-- ─── FOOTER — NODE MEDIANOCHE (único dark) ─── -->"""

if target in content:
    new_content = content.replace(target, replacement)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Success: Replacement made.")
else:
    print("Error: Target not found.")
