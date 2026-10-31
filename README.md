# ECOGEN Solar — primera versión funcional

Aplicación en español con Next.js, TypeScript, Tailwind, Supabase, OpenAI y pdf-lib. **Versión preliminar de desarrollo: no habilitar todavía para captar datos reales.**

## Cómo abrirla en tu computadora
1. Instala Node.js 24 LTS y descarga este repositorio.
2. Abre una terminal dentro de la carpeta y ejecuta `npm ci`.
3. Ejecuta `npm run dev` y abre la dirección indicada en la terminal.
4. Pulsa «Cotiza tu sistema solar». Puedes configurar paquetes y descargar una vista previa PDF sin contratar servicios.

Sin variables configuradas aparece un aviso de demostración. El botón de envío **no guarda ni envía** solicitudes en ese modo. No se usan clientes ficticios ni contraseñas administrativas predeterminadas.

## Fichas técnicas
Las cuatro fichas PDF proporcionadas están en `public/fichas-tecnicas`. Se pueden abrir en otra pestaña desde «Nuestros equipos» y desde los pasos de configuración y revisión del cotizador, donde se muestra la del panel GCL de 630 W y la del inversor seleccionado (Growatt de 3.6, 5 o 10 kW). La opción de 6 kW informa que su ficha está pendiente; no se sustituye por otro modelo. Los documentos son referencias y los equipos definitivos requieren confirmación técnica. No requieren credenciales ni servicios externos.

## Conectar servicios reales
1. Crea un proyecto Supabase. Ejecuta `supabase/schema.sql` en su editor SQL.
2. Copia `.env.example` a `.env.local`. Introduce URL y clave pública de Supabase; la clave service role debe permanecer privada. Nunca subas este archivo a GitHub.
3. Ejecuta `npm run seed` para cargar el catálogo inicial (no sobrescribe un catálogo ya creado).
4. En Supabase Authentication crea tu usuario y configura su correo en `ADMIN_EMAIL`. Entra por `/admin`. Deshabilita altas públicas y configura MFA y políticas de contraseña en Supabase antes de producción.
5. Para IA configura `OPENAI_API_KEY` en el servidor. Su uso puede generar cargos: esta versión no crea ni contrata cuentas. La extracción no sustituye la revisión humana. La API recibe el documento enviado por el cliente; se recomienda ocultar datos personales irrelevantes.
6. Reinicia la aplicación. Prueba una solicitud con datos de prueba, comprueba su aparición en administración y su recibo privado.

En cloud, las llamadas requieren acceso a tu dominio Supabase `PROYECTO.supabase.co` y, para IA, `api.openai.com`. Solicita esos destinos en la configuración del entorno sin eliminar otros dominios existentes. Los secretos deben introducirse de forma segura en los ajustes, nunca en el chat.

## Validación
`npm test` prueba precios, redondeos, compatibilidad, financiamiento, formularios, firmas de archivos y PDF. `npm run test:e2e` ejecuta los ocho casos de navegador, con la app ya iniciada en el puerto 3000 y Chromium en `/usr/bin/chromium` (ajusta `playwright.config.ts` para tu equipo). `npm run typecheck` verifica TypeScript. `npm run build` prepara la versión de producción. `npm start` ejecuta esa versión. Las pruebas de integración requieren tu proyecto Supabase de pruebas; no se declaran ejecutadas sin él.

## Implementado
- Diseño adaptable, navegación, siete paquetes y flujo de tres pasos que conserva la selección.
- Datos y consentimiento, recibo con vista previa, validación de tamaño/MIME/firma, captura manual, estimación y avisos técnicos.
- Motor de cálculo compartido y recálculo obligatorio en servidor con catálogo vigente.
- Persistencia Supabase, recibos privados, identificador único por intento y restricción única contra duplicados. Si se pierde la respuesta de un envío ya guardado, se informa que existe; no se vuelve a insertar ni se revela un enlace privado nuevo.
- Administración con autenticación Supabase, autorización de correo en servidor, consulta, búsqueda, estados, resumen de ventas, catálogo configurable y eliminación de datos/recibos. Auditoría de cambios de catálogo y estados.
- Extracción de CFE con respuesta estructurada, tiempos de espera, rechazo de lecturas de baja confianza y captura manual si falla. Por seguridad esta versión conserva el consumo como declarado y pendiente de revisión; no afirma verificación de IA.
- PDF preliminar con cálculos, condiciones, cuotas y enlace privado mediante token aleatorio cuyo hash se almacena. RLS bloquea acceso directo de clientes a tablas; bucket privado.

## Pendiente antes de producción y siguientes entregas
- Probar contra Supabase real: aislamiento entre clientes, almacenamiento, fallos transitorios, concurrencia, autenticación y eliminación. Validar IA con recibos CFE reales anonimizados y diferentes periodos.
- Pruebas adicionales en dispositivos físicos. Se ejecutaron seis comprobaciones E2E en Chromium con viewport de escritorio y emulación móvil; no equivalen a pruebas en teléfonos físicos.
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
Se ejecutaron 9 pruebas unitarias/funcionales y 6 casos E2E (3 por tamaño de pantalla), TypeScript y compilación de producción. Las pruebas de acceso confirman rechazo de solicitudes no autenticadas en demostración; el aislamiento con una base de datos real sigue pendiente. No se ejecutaron pruebas de persistencia ni IA real sin credenciales.

## Validación de fichas técnicas
Pasaron las 9 pruebas existentes, TypeScript y los 8 casos E2E en escritorio y emulación móvil, incluyendo las cuatro respuestas PDF y el cambio de ficha por inversor. Los PDF conservan los bytes de los originales proporcionados. La compilación de producción se verificó con `npm run build -- --webpack`: Turbopack falla en este entorno al intentar abrir un puerto interno (`Operation not permitted`). Para repetir toda la suite, iniciar una instancia nueva o esperar la ventana del límite de solicitudes; las ejecuciones consecutivas comparten ese contador. No se validaron servicios externos reales ni se publicó la aplicación.
