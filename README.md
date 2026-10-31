# ECOGEN Solar

Aplicación Next.js/TypeScript en español para cotizar sistemas solares en MXN.

## Probar en Windows
Instala Node.js 24 LTS con el instalador de nodejs.org, extrae todo el ZIP y abre `PROBAR-WINDOWS.bat`. Alternativamente, abre una terminal en la carpeta y ejecuta `node probar.mjs`. Espera a que aparezca Ready y abre http://localhost:3000. La primera instalación necesita internet. Mantén la terminal abierta mientras pruebas; Ctrl+C detiene la aplicación.

En Mac: `bash PROBAR-MAC.command`. En Linux: `node probar.mjs`.

Para desarrollo: `npm ci` y `npm run dev`. En este entorno Turbopack tiene restricciones de puertos internos: usa `npm run dev -- --webpack` si ocurre ese error. Producción: `npm run build -- --webpack` y `npm start`.

## Cotizador simplificado
- Los botones generales abren una cotización vacía. Solo «Elegir este sistema» preselecciona el paquete que el cliente pulsó.
- Una pantalla para elegir 4, 6, 8, 10, 12, 14 o 16 paneles, forma de pago y nombre opcional. No solicita correo, consumo, periodo, hilos ni recibo CFE.
- Inversores incluidos fijos: 4/6 paneles → 3.6 kW; 8/10/12 → 5 kW; 14 → 6 kW; 16 → 10 kW. No se cobra aumento de inversor al elegir estos paquetes.
- El precio aparece únicamente después de elegir paneles. Los precios y plazos provienen del catálogo vigente; la cotización es preliminar, sin cargo eléctrico automático. Posibles adecuaciones requieren revisión y cotización separada.
- Fichas PDF originales de panel GCL 630 W y Growatt 3.6, 5 y 10 kW en `public/fichas-tecnicas`, visibles en Nuestros equipos y en el cotizador. La ficha de 6 kW sigue pendiente.
- Descarga de cotización PDF sin cuenta ni datos personales obligatorios.

## WhatsApp
El botón final abre `wa.me/526142847477` con el detalle del paquete, inversor, forma de pago, total y nombre opcional. El cliente debe pulsar Enviar dentro de WhatsApp. No requiere un agente, credenciales, Supabase ni contratar servicios. En computadora puede requerir iniciar sesión en WhatsApp Web.

El sitio no puede confirmar la entrega ni enviar el mensaje sin la intervención del cliente. No se adjunta automáticamente el PDF ni se guarda la solicitud en Supabase mediante este flujo. Se verificaron el destino y el contenido del enlace; no se enviaron mensajes reales al negocio.

Para un envío desde servidor sin confirmación en WhatsApp haría falta una integración separada con la plataforma oficial de WhatsApp Business, sus credenciales y requisitos de Meta. No está implementada ni contratada.

## Integraciones existentes
Las rutas anteriores de recibos, IA, solicitudes y administración permanecen disponibles para desarrollo, pero el cotizador público usa ahora el flujo de WhatsApp. Supabase y OpenAI no son necesarios para probarlo. Sin Supabase la portada usa el catálogo local; con un catálogo persistido configurado, se consultan sus precios.

Para configurar esas integraciones: consulta `.env.example`, aplica `supabase/schema.sql`, configura las variables privadas en `.env.local`, ejecuta `npm run seed` y crea el usuario administrativo con el correo de `ADMIN_EMAIL`. Nunca publiques claves ni recibos. No se probaron persistencia, IA ni administración con servicios reales en esta entrega.

## Validación
`npm test`: pruebas de cálculo, validaciones, PDF y mensajes de WhatsApp. `npm run typecheck`: TypeScript. `npm run build -- --webpack`: compilación. Con una instancia nueva de la app en el puerto 3000 y Chromium en `/usr/bin/chromium`, `npm run test:e2e` comprueba el flujo simplificado y las fichas en escritorio y emulación móvil. Las ejecuciones consecutivas de pruebas de API comparten el límite de solicitudes en memoria.

## Antes de producción
Completar aviso legal, condiciones comerciales, garantías, modelos definitivos, ficha de 6 kW y validación técnica de los paquetes. Probar el envío manual desde dispositivos con WhatsApp y la recepción en el número del negocio. La imagen Unsplash es demostrativa, no una instalación ECOGEN. El PDF es preliminar. No se ha contratado ni publicado un alojamiento web.

## Evidencia de esta actualización
Pasaron 11 pruebas de cálculo, validación y PDF; TypeScript; compilación de producción con Webpack; y 6 casos E2E en escritorio y emulación móvil. Se verificó selección inicial vacía, reinicio al abrir una cotización general, los siete pares paneles/inversor, cuotas, descarga PDF, fichas y contenido/destino del enlace de WhatsApp. No se envió un mensaje real ni se comprobó recepción en el teléfono del negocio.
