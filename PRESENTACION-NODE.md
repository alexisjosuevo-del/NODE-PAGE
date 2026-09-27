# Presentación NODE

Documento de respaldo de la presentación vigente y dirección creativa para su siguiente versión.

> **Decisión de implementación · 21 de agosto de 2026:** se conserva la narrativa original. `innovation` se contrae hacia su `i`; el punto de la letra cae, crece hasta alcanzar la escala de las letras de `node` y revela `n`, `o`, `d`, `e` con cada rebote. La dirección alternativa de red oscura y activación de sistema queda registrada abajo como exploración descartada, no como implementación vigente.

## 1. Implementación actual

Estado guardado el 21 de agosto de 2026. La implementación fuente permanece distribuida en:

- `index.html`: estructura entre los marcadores `INICIO: PRESENTACION NODE` y `FIN: PRESENTACION NODE`.
- `styles.css`: estilos base de `PRESENTACION NODE` y animación `innovation -> cuadro -> punto que cae y rebota -> node`.
- `script.js`: apertura, cierre, preferencia de movimiento reducido y registro por sesión.

### HTML actual

```html
<!-- ===== INICIO: PRESENTACION NODE ===== -->
<section class="intro" data-intro aria-label="Presentación de NODE" aria-live="polite" hidden>
  <div class="intro-stage" aria-label="NODE">
    <div class="intro-frame" aria-hidden="true">
      <p class="intro-innovation"><span class="io-target" style="--k:0">ı</span><span style="--k:1">n</span><span style="--k:2">n</span><span style="--k:3">o</span><span style="--k:4">v</span><span style="--k:5">a</span><span style="--k:6">t</span><span style="--k:7">i</span><span style="--k:8">o</span><span style="--k:9">n</span></p>
      <i class="intro-dot" aria-hidden="true"></i>
    </div>
    <p class="intro-word" aria-hidden="true"><span>n</span><span>o</span><span>d</span><span>e</span></p>
  </div>
  <p class="intro-status">Conexión en curso</p>
</section>
<!-- ===== FIN: PRESENTACION NODE ===== -->
```

### Comportamiento actual

1. La presentación aparece solamente una vez por sesión mediante `sessionStorage` y la clave `node-intro-seen`.
2. `innovation` aparece dentro del cuadro y se comprime sobre su primera letra.
3. Un punto independiente cae y rebota sobre las posiciones de `n`, `o`, `d` y `e`.
4. Las letras se revelan secuencialmente.
5. La presentación se cierra automáticamente a los 4.2 segundos o al pulsar `Escape`.
6. Con `prefers-reduced-motion`, se muestra una versión simplificada y se cierra a los 280 ms.

### Observaciones técnicas

- En `styles.css` conviven reglas heredadas de una presentación anterior con las reglas de la animación vigente. En particular, `.intro-word` se declara dos veces con composiciones distintas.
- Permanecen estilos de `.intro-node`, sus enlaces y órbitas, aunque el HTML actual ya no contiene ese SVG.
- Antes de construir la siguiente versión se deben consolidar ambos bloques en un solo sistema de estilos para evitar colisiones y facilitar el ajuste de tiempos.

## 2. Concepto que se conserva

La idea central es correcta y debe permanecer:

> Una innovación dispersa se convierte en un nodo operativo que conecta y activa todo el sistema.

La evolución no cambia la historia. Mejora su dirección artística, la integra con el sitio y convierte el movimiento en una demostración del posicionamiento de NODE.

## 3. Propuesta: Activación del sistema NODE

### Objetivo

Crear una apertura breve, premium y tecnológica que comunique transformación, conexión y capacidad operativa. Debe sentirse como el encendido de un sistema preciso, no como una animación decorativa ni como una pantalla de carga genérica.

### Secuencia narrativa

#### Fase 1 — Señal detectada

- Fondo negro azulado conectado visualmente con el hero.
- Cuadrícula técnica de baja opacidad y una respiración luminosa muy sutil.
- `innovation` aparece en tipografía monoespaciada, inicialmente con un desenfoque ligero o caracteres inestables.
- Estado inferior: `INNOVACIÓN DETECTADA`.

#### Fase 2 — Compresión

- Los caracteres se estabilizan y convergen hacia el punto de la primera `i`.
- El punto cambia al azul eléctrico de NODE y recibe un halo concentrado.
- El movimiento debe sentirse magnético y controlado; no elástico ni caricaturesco.
- Estado inferior: `CONECTANDO CAPACIDADES`.

#### Fase 3 — Construcción de la red

- El nodo recorre cuatro posiciones mediante una trayectoria curva.
- Deja conexiones finas detrás, formando una pequeña red visible.
- Cada contacto produce un pulso y revela una letra de `node` mediante máscara, luz o barrido.
- Las conexiones pueden sugerir por un instante la geometría del isotipo, sin dibujarlo de manera literal demasiado pronto.

#### Fase 4 — Sistema operativo

- La palabra `node` queda completa, estable y nítida.
- El nodo final emite un pulso de confirmación.
- Estado inferior: `SISTEMA NODE · OPERATIVO`.
- El pulso expande una máscara que revela el hero. El fondo de la intro debe transformarse directamente en el fondo del sitio, evitando un corte brusco.

## 4. Dirección visual

### Color

- Fondo principal: negro azulado, cercano al fondo actual del hero.
- Nodo activo y señales: azul eléctrico `#245BFF`.
- Texto principal: blanco frío.
- Texto de sistema: gris azulado de contraste medio.
- Cuadrícula y conexiones: azul o blanco entre 6 % y 16 % de opacidad.

El brillo debe concentrarse alrededor del nodo activo. No usar un resplandor generalizado ni grandes nubes de color.

### Tipografía

- `innovation` y estados: `JetBrains Mono` o la monoespaciada vigente.
- `node`: la tipografía de marca o la misma construcción visual empleada en el hero.
- Estados en mayúsculas, tracking amplio y tamaño pequeño.

### Movimiento

- Duración total recomendada: 3.0–3.4 segundos.
- Curvas principales: `cubic-bezier(.16, 1, .3, 1)` para apariciones y desaceleración.
- Evitar rebotes altos, rotaciones excesivas, glitch agresivo y partículas abundantes.
- Usar pulsos cortos, trazos progresivos, cambios de enfoque y aceleración controlada.

### Sonido

No reproducir sonido automáticamente. La presentación debe funcionar completamente en silencio.

## 5. Experiencia y accesibilidad

- Mostrar una sola vez por sesión, como en la versión actual.
- Incorporar un control discreto `Omitir` visible y accesible mediante teclado.
- Permitir salida con `Escape`.
- No retener el foco ni impedir el acceso al sitio si falla la animación.
- Para `prefers-reduced-motion`, mostrar `node` ya formado y realizar un fundido corto, sin trayectorias ni pulsos expansivos.
- El texto anunciado por lectores de pantalla debe ser breve; no anunciar cada estado animado mediante `aria-live`.
- Mantener la presentación como una mejora progresiva: el contenido principal debe continuar disponible si JavaScript no carga.

## 6. Arquitectura sugerida

```html
<section class="intro" data-intro hidden>
  <div class="intro-grid" aria-hidden="true"></div>
  <div class="intro-stage" aria-hidden="true">
    <p class="intro-innovation">innovation</p>
    <svg class="intro-network"><!-- trayectoria y conexiones --></svg>
    <i class="intro-node"></i>
    <p class="intro-word"><span>n</span><span>o</span><span>d</span><span>e</span></p>
  </div>
  <p class="intro-status" data-intro-status>Sistema NODE</p>
  <button class="intro-skip" type="button" data-intro-skip>Omitir</button>
</section>
```

La secuencia debe controlarse principalmente con clases de estado:

- `.phase-detected`
- `.phase-compressing`
- `.phase-connecting`
- `.phase-operational`
- `.is-exiting`

Esto separa la narrativa de los fotogramas CSS, facilita las pruebas y permite sincronizar el texto de estado sin depender de una sola animación extensa.

## 7. Criterios de aceptación

- La intro y el hero parecen partes del mismo sistema visual.
- La historia `innovation -> nodo -> node` se entiende sin explicación.
- El cierre provoca una activación visible del sitio y no un simple desvanecimiento.
- La secuencia completa no supera 3.4 segundos.
- Funciona correctamente en escritorio y móvil sin depender de posiciones frágiles basadas en `ch`.
- No hay selectores heredados ni animaciones sin uso.
- Existe salida por botón, por teclado y por finalización automática.
- La experiencia con movimiento reducido es clara y no bloquea la navegación.

## 8. Orden recomendado de implementación

1. Limpiar las reglas antiguas de la presentación.
2. Crear la composición oscura y su transición compartida con el hero.
3. Construir el recorrido del nodo y las conexiones como SVG responsivo.
4. Sincronizar letras, estados y cierre con clases de fase.
5. Añadir `Omitir`, teclado y movimiento reducido.
6. Probar a 1440 px, 1024 px, 768 px y 390 px de ancho.
