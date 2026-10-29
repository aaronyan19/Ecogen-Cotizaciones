# ECOGEN Solar
Aplicación Next.js/TypeScript en español, MXN, para Chihuahua. Usar el checkout existente; no crear worktrees salvo solicitud explícita.

- Precios centralizados en lib/catalog.ts y catálogo persistente con instantánea por cotización.
- Dinero en centavos enteros. Paneles = ceil(consumo/360)*2; mínimo comercial cuatro, más de 16 requiere propuesta personalizada.
- Aumento eléctrico de un hilo: 200000 centavos; desconocido requiere revisión.
- Inversor adicional = ceil(max(0,elegido-base))*120000. No descuentos automáticos.
- 6 kW: solo paquete de 14 y revisión; no inventar capacidad máxima.
- Nunca inventar lectura CFE, garantías, modelos, fotos propias ni confirmaciones de almacenamiento.
- Claves privadas solo en servidor. Recibos privados; nunca exponer service role al navegador.
- No publicar ni contratar servicios sin autorización. No enviar mensajes a clientes automáticamente.
- Ejecutar npm test, npm run typecheck y npm run build antes de dar una versión por validada.
- Mantener README y pendientes honestos. Integraciones externas sin credenciales no se consideran probadas.
