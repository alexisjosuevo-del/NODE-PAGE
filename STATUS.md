# Status — nueva web de NODE

**Actualizado:** 2026-08-16  
**Estado general:** borrador funcional para revisión local; no listo para producción.

## Stage A

- [x] Chatbot conectado al contrato publico `/api/chat` con sesion y acciones tipadas.
- [x] Backend Stage A fijado a Groq `openai/gpt-oss-20b` mediante `NODE_CHAT_PRIMARY`.
- [x] Autoridad semantica UI del proveedor deshabilitada/fail-closed; navegacion aprobada determinista.
- [x] Cobertura provider-free Stage A: 5/5.
- [ ] Despliegue: pendiente de decision y autorizacion explicita del Owner.

## Desarrollado

- [x] Carpeta independiente `NODE-WEB-2026/`.
- [x] Landing de una sola página.
- [x] Navegación responsive.
- [x] Hero alineado al nuevo posicionamiento B2B.
- [x] Secciones de enfoque, proceso, capacidades y diferenciación.
- [x] Presencia institucional sin perfiles personales.
- [x] Eliminación del catálogo, paquetes y precios públicos.
- [x] Eliminación de WhatsApp como CTA principal.
- [x] Formulario corto con validación en cliente.
- [x] Sistema visual oscuro basado en la identidad NODE.
- [x] Logo nuevo incorporado como activo local.
- [x] Metadatos básicos de SEO y redes sociales.
- [x] Ajustes responsive y soporte para `prefers-reduced-motion`.
- [x] Documento de contexto del proyecto.
- [x] Verificación de sintaxis JavaScript.
- [x] Verificación de enlaces internos, IDs y archivos locales.
- [x] Revisión visual de escritorio mediante navegador.
- [x] Captura de control archivada fuera del release tree.

## Pendiente antes de producción

- [ ] Definir CRM y endpoint seguro para recibir el formulario.
- [ ] Implementar envío, manejo de errores de red y confirmación real.
- [ ] Definir consentimiento y aviso de privacidad definitivo para el formulario.
- [ ] Confirmar si se requieren páginas o modales legales separados.
- [ ] Añadir favicon y versión optimizada del símbolo cuando exista el activo aprobado.
- [ ] Añadir imagen Open Graph para compartir en redes.
- [ ] Confirmar URL oficial de LinkedIn antes de agregarla.
- [ ] Ejecutar pruebas en navegadores y dispositivos reales.
- [ ] Revisar copy final con dirección de marca.
- [ ] Configurar analítica solo si se aprueba proveedor y política de privacidad.
- [ ] Definir despliegue y sustituir producción únicamente con autorización.

## Pendiente cuando exista evidencia

- [ ] Incorporar casos de estudio verificables.
- [ ] Incorporar resultados cuantificados.
- [ ] Incorporar testimonios y logos con autorización de clientes.

## Nota operativa

El formulario no transmite datos en esta versión. Valida los campos y comunica que la integración con CRM sigue pendiente; no debe publicarse como canal activo hasta completar esa conexión.
