# Seguridad y privacidad operativa

El código reduce riesgos; no garantiza ausencia de ataques ni cumplimiento legal por sí solo.

## Antes de recibir datos reales

- Completar en Vercel `PRIVACY_RESPONSIBLE_NAME`, `PRIVACY_ADDRESS`, `PRIVACY_EMAIL` y `PRIVACY_RETENTION` con información real. Son datos públicos del aviso. Revisar jurídicamente el aviso y las condiciones comerciales para la operación mexicana concreta.
- Usar contraseñas únicas y MFA en GitHub, Vercel y Supabase. Dar acceso al proyecto solo a quienes lo necesiten. Proteger la rama de producción y revisar cambios antes de desplegar.
- Mantener `SUPABASE_SERVICE_ROLE_KEY` y `OPENAI_API_KEY` exclusivamente en variables de servidor. Nunca usar prefijos `NEXT_PUBLIC_` para secretos, incluirlos en el repositorio ni compartirlos por chat. Rotar cualquier clave expuesta.
- Aplicar y verificar `supabase/schema.sql` en un proyecto nuevo. En proyectos existentes revisar cambios mediante migraciones; no ejecutar a ciegas el esquema de creación. Confirmar RLS activada y ausencia de permisos/políticas de lectura o escritura para anon y authenticated en quotes, settings y audit_log. El bucket receipts debe ser privado, sin políticas públicas. Probar las denegaciones con un cliente anónimo y otro autenticado no administrador contra la instancia real.
- Configurar `ADMIN_EMAIL` con el correo exacto de una cuenta confirmada de Supabase Auth, desactivar registros públicos si no se necesitan y configurar límites de autenticación. La API verifica el usuario con Supabase y su correo confirmado antes de realizar operaciones. MFA en el panel del proveedor no equivale a MFA en el formulario /admin; este último requiere una implementación adicional antes de exigir segundo factor en ese formulario.
- Activar reglas de firewall y límites de solicitudes y carga en Vercel. El límite por IP del código reside en memoria, depende de cabeceras del proxy de confianza y no protege de forma distribuida ni limita el tráfico facturable entre instancias. El control de content-length no reemplaza un límite de cuerpo en la plataforma. Verificar los límites reales de carga del plan de Vercel antes de ofrecer archivos de 10 MB.
- Definir y ejecutar conservación/borrado de solicitudes, recibos y respaldos conforme al aviso. No existe tarea automática de conservación. Verificar recuperación de backups y mantener un procedimiento para incidentes y solicitudes ARCO.
- La comprobación de MIME, tamaño y firma de archivos no es un antivirus. Para operación con documentos reales, incorporar un servicio de análisis de archivos y restringir el acceso de operadores.

## Controles presentes

Recálculo de precios en servidor; validación del formulario y archivos; consentimiento para la solicitud y validación de consentimiento en la API de IA; token aleatorio de PDF almacenado como hash; recibos privados según el esquema y enlaces administrativos de 60 segundos; autorización administrativa en servidor; cabeceras nosniff, anti-iframe, política de referente y restricciones de permisos; no-store en API. El enlace del PDF es una credencial de acceso: no compartirlo. La CSP agregada es parcial y no sustituye una política estricta contra XSS.

## Verificación

`npm test`, `npm run typecheck`, `npm run build -- --webpack`, iniciar servidor y `npm run test:e2e`. Las pruebas sin credenciales comprueban modo demostración, rechazo de cambios administrativos anónimos y cabeceras; no acreditan aislamiento ni permisos de una base de datos real. `npm audit --omit=dev` consulta avisos conocidos, no certifica seguridad completa.
