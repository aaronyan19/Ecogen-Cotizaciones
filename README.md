# ECOGEN Solar — cotizador simplificado

Aplicación en español con Next.js, TypeScript, Tailwind, Supabase, OpenAI y pdf-lib. **Versión preliminar de desarrollo: no habilitar todavía para captar datos reales.**

## Cotizador público actual
Una pantalla permite elegir 4, 6, 8, 10, 12, 14 o 16 paneles; escribir nombre, declarar servicio de 220 V y adjuntar opcionalmente JPG/PNG/PDF. No solicita teléfono, correo ni consumo; el inversor incluido se asigna según el catálogo. El total se actualiza para contado, 3, 6 o 12 meses y contempla el cargo eléctrico cuando corresponde. Se puede descargar PDF con nombre y consultar las fichas GCL 630 W y Growatt 3.6/5/6/10 kW. La ficha comercial informativa Growatt MIN 6000TL-X2 de 6 kW fue proporcionada por el usuario y está disponible en Nuestros equipos y en la cotización del paquete de 14 paneles. Su incorporación no modifica precios ni sustituye la revisión técnica de compatibilidad.

El botón «Enviar cotización por WhatsApp» prepara un mensaje para ECOGEN al +52 614 177 4155 con nombre, paneles, inversor, servicio de 220 V, forma de pago, importes y condiciones vigentes. Requiere nombre y consentimiento; el cliente confirma Enviar dentro de WhatsApp. Abrir el chat no acredita envío ni recepción y no guarda una solicitud. El PDF y el recibo se adjuntan manualmente en WhatsApp; no se transmiten mediante el enlace. No requiere WhatsApp Business API.

La acción independiente «Guardar mi solicitud y recibo» solo transmite el recibo seleccionado con consentimiento y requiere Supabase; en demostración se informa que no se guardó. No se envía a IA automáticamente. La persistencia real sigue sin validarse con credenciales. Sin teléfono o correo, una solicitud guardada no permite contactar al cliente desde esos medios. WhatsApp utiliza el número del cliente que inicia el chat.

## Cómo abrirla en tu computadora
1. Instala Node.js 24 LTS y descarga este repositorio.
2. Abre una terminal dentro de la carpeta y ejecuta `npm ci`.
3. Ejecuta `npm run dev` y abre la dirección indicada en la terminal.
4. Pulsa «Cotiza tu sistema solar». Puedes configurar paquetes y descargar una vista previa PDF sin contratar servicios.

Sin variables configuradas aparece un aviso de demostración. La acción de guardado **no guarda ni envía** solicitudes en ese modo; el botón WhatsApp sí permite abrir un mensaje preparado para que el cliente confirme su envío. No se usan clientes ficticios ni contraseñas administrativas predeterminadas.

## Conectar servicios reales
1. Crea un proyecto Supabase. Ejecuta `supabase/schema.sql` en su editor SQL.
2. Copia `.env.example` a `.env.local`. Introduce URL y clave pública de Supabase; la clave service role debe permanecer privada. Nunca subas este archivo a GitHub.
3. Ejecuta `npm run seed` para cargar el catálogo inicial (no sobrescribe un catálogo ya creado).
4. En Supabase Authentication crea tu usuario y configura su correo en `ADMIN_EMAIL`. Entra por `/admin`. Deshabilita altas públicas y configura MFA y políticas de contraseña en Supabase antes de producción.
5. Para IA configura `OPENAI_API_KEY` en el servidor. Su uso puede generar cargos: esta versión no crea ni contrata cuentas. La extracción no sustituye la revisión humana. La API recibe el documento enviado por el cliente; se recomienda ocultar datos personales irrelevantes.
6. Reinicia la aplicación. Prueba una solicitud con datos de prueba, comprueba su aparición en administración y su recibo privado.

En cloud, las llamadas requieren acceso a tu dominio Supabase `PROYECTO.supabase.co` y, para IA, `api.openai.com`. Solicita esos destinos en la configuración del entorno sin eliminar otros dominios existentes. Los secretos deben introducirse de forma segura en los ajustes, nunca en el chat.

## Validación
`npm test` prueba precios, redondeos, compatibilidad, financiamiento, formularios, firmas de archivos, PDF y destinatario/contenido del mensaje de WhatsApp. Las pruebas de navegador interceptan la apertura de WhatsApp; no se enviaron mensajes reales ni se verificó su recepción. `npm run test:e2e` ejecuta los diez casos de navegador, con la app ya iniciada en el puerto 3000 y Chromium en `/usr/bin/chromium` (ajusta `playwright.config.ts` para tu equipo). `npm run typecheck` verifica TypeScript. `npm run build` prepara la versión de producción. `npm start` ejecuta esa versión. Las pruebas de integración requieren tu proyecto Supabase de pruebas; no se declaran ejecutadas sin él.

## Implementado
- Diseño adaptable, navegación, siete paquetes y cotizador en una pantalla.
- Datos y consentimiento, recibo con vista previa, validación de tamaño/MIME/firma, captura manual, estimación y avisos técnicos.
- Motor de cálculo compartido y recálculo obligatorio en servidor con catálogo vigente.
- Persistencia Supabase, recibos privados, identificador único por intento y restricción única contra duplicados. Si se pierde la respuesta de un envío ya guardado, se informa que existe; no se vuelve a insertar ni se revela un enlace privado nuevo.
- Administración con autenticación Supabase, autorización de correo en servidor, consulta, búsqueda, estados, resumen de ventas, catálogo configurable y eliminación de datos/recibos. Auditoría de cambios de catálogo y estados.
- Extracción de CFE con respuesta estructurada, tiempos de espera, rechazo de lecturas de baja confianza y captura manual si falla. Por seguridad esta versión conserva el consumo como declarado y pendiente de revisión; no afirma verificación de IA.
- PDF preliminar con cálculos, condiciones, cuotas y enlace privado mediante token aleatorio cuyo hash se almacena. RLS bloquea acceso directo de clientes a tablas; bucket privado.

## Pendiente antes de producción y siguientes entregas
- Probar contra Supabase real: aislamiento entre clientes, almacenamiento, fallos transitorios, concurrencia, autenticación y eliminación. Validar IA con recibos CFE reales anonimizados y diferentes periodos.
- Pruebas adicionales en dispositivos físicos. Se ejecutaron diez comprobaciones E2E en Chromium con viewport de escritorio y emulación móvil; no equivalen a pruebas en teléfonos físicos.
- Persistir análisis IA y trazabilidad verificable del documento; revisión/corrección administrativa de hilos con nueva versión de precios; cotizaciones personalizadas de más de 16 paneles.
- Formularios administrativos visuales para equipos y plazos, altas/bajas completas, creación manual, duplicación, aprobación formal y PDF administrativo. La edición inicial del catálogo usa JSON validado.
- Carga administrativa de fotografías y fichas técnicas, galería real y logo oficial. La imagen remota Unsplash es demostrativa de paneles solares, no una instalación propia ni la fotografía residencial definitiva. Ilustraciones de paneles hechas con CSS.
- PDF de referencia, contacto real, garantías, materiales incluidos, vigencia, condiciones y aviso de privacidad legal definitivo. No se inventan datos comerciales.
- Notificaciones opcionales por correo, actualización en tiempo real (actualmente botón Actualizar), política configurable de conservación y borrado programado, auditoría con identidad del actor y gestión de solicitudes de privacidad.
- Protección de abuso distribuida/CAPTCHA y límites a nivel de plataforma. El límite en memoria por IP es básico y no es suficiente para múltiples servidores ni redes no confiables. Configurar límite del cuerpo de solicitudes en el proxy de despliegue antes de procesar archivos.
- Escaneo antimalware de recibos; políticas de contenido, observabilidad sin datos personales, backups y recuperación, revisión de seguridad y accesibilidad.

## Publicación futura
No se ha publicado la aplicación. Tras completar pendientes, puede desplegarse en un proveedor compatible con Next.js y Node 24; configura HTTPS, dominio, variables privadas y límite de carga de 10 MB. Comprueba previamente los límites de archivos del proveedor (algunos requieren subir directamente a storage con URL firmada). La instalación no requiere ningún servicio de pago por sí misma.

## Evidencia de esta entrega
Se ejecutaron 16 pruebas unitarias/funcionales y 10 casos E2E (5 por tamaño de pantalla), TypeScript y compilación de producción. Las pruebas de acceso confirman rechazo de solicitudes no autenticadas en demostración; el aislamiento con una base de datos real sigue pendiente. No se ejecutaron pruebas de persistencia ni IA real sin credenciales.

## Privacidad y protección
El aviso en `/privacidad` incluye finalidades, recibos opcionales, análisis con IA y derechos ARCO. Completa las variables `PRIVACY_RESPONSIBLE_NAME`, `PRIVACY_ADDRESS`, `PRIVACY_EMAIL` y `PRIVACY_RETENTION` con datos reales antes de recibir información de clientes; requiere revisión legal. Consulta [SECURITY.md](SECURITY.md) para configuración de cuentas, permisos Supabase, limitaciones y verificaciones de producción. Las pruebas locales no verifican la base de datos desplegada.
