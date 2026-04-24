import os
import shutil

root_dir = r'c:\Users\monst\Documents\movilidad nod'
n_main_dir = os.path.join(root_dir, 'N-main')
index_path = os.path.join(n_main_dir, 'index.html')

# 1. Copiar las imagenes a N-main
for i in range(1, 9):
    img_name = f'img{i}.png'
    src = os.path.join(root_dir, img_name)
    dst = os.path.join(n_main_dir, img_name)
    if os.path.exists(src):
        shutil.copy(src, dst)
        print(f"Copied {img_name} to N-main")

# 2. Actualizar las rutas en N-main/index.html
if os.path.exists(index_path):
    with open(index_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Reemplazar "../img" por "./img" o simplemente "img"
    content = content.replace('../img1.png', 'img1.png')
    content = content.replace('../img2.png', 'img2.png')
    content = content.replace('../img3.png', 'img3.png')
    content = content.replace('../img4.png', 'img4.png')
    content = content.replace('../img5.png', 'img5.png')
    content = content.replace('../img6.png', 'img6.png')
    content = content.replace('../img7.png', 'img7.png')
    content = content.replace('../img8.png', 'img8.png')

    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated image paths in N-main/index.html")
