export const dynamic='force-dynamic';
export default function Privacy(){
 const responsible=process.env.PRIVACY_RESPONSIBLE_NAME;
 const address=process.env.PRIVACY_ADDRESS;
 const email=process.env.PRIVACY_EMAIL;
 const retention=process.env.PRIVACY_RETENTION;
 const complete=responsible&&address&&email&&retention;
 return <main className="document"><a href="/">← Volver a ECOGEN Solar</a>
 <h1 style={{fontSize:38}}>Aviso de privacidad</h1>
 <p>Última actualización: 3 de noviembre de 2026.</p>
 {!complete&&<p role="alert" className="warning">Aviso pendiente de completar: ECOGEN debe identificar al responsable, su domicilio, el correo para ejercer derechos y el plazo de conservación antes de recibir datos reales. Este texto requiere revisión legal para la operación concreta del negocio.</p>}
 <h2>Responsable del tratamiento</h2>
 <p>{responsible||'Nombre legal del responsable: pendiente de proporcionar por ECOGEN.'}</p>
 <p>Domicilio: {address||'pendiente de proporcionar por ECOGEN.'}</p>
 <p>Contacto de privacidad: {email||'pendiente de proporcionar por ECOGEN.'}</p>
 <h2>Datos que solicitamos</h2>
 <p>Nombre, teléfono o WhatsApp, correo electrónico opcional, consumo eléctrico, disponibilidad de servicio de 220 V y configuración de la cotización. Si decides adjuntar tu recibo CFE, este puede incluir nombre, domicilio, número de servicio y otros identificadores. El recibo es opcional: puedes continuar sin él y ocultar información innecesaria antes de compartirlo. No solicitamos datos bancarios ni documentos de identidad.</p>
 <h2>Para qué se utilizan</h2>
 <p>Preparar y revisar tu cotización, evaluar las condiciones técnicas declaradas y contactarte para atender y dar seguimiento a tu solicitud. La información no acredita una inspección técnica ni la aceptación de un contrato. El consentimiento del formulario se refiere a estas finalidades; no autoriza campañas de publicidad ajenas a tu solicitud.</p>
 <h2>Análisis opcional del recibo con IA</h2>
 <p>Únicamente al pulsar «Analizar recibo con IA», y con tu consentimiento, se envía el documento al servicio OpenAI configurado para extraer consumo y características del suministro. No necesitas utilizar IA para cotizar. El documento puede contener datos personales: ocúltalos cuando no sean necesarios. El análisis es preliminar y requiere verificación humana. La aplicación solicita que la respuesta no se almacene en el historial del servicio; esto no constituye una garantía sobre todos los registros o plazos del proveedor.</p>
 <h2>Proveedores y acceso a la información</h2>
 <p>Cuando estén configurados, se utilizan Vercel para alojar la aplicación y Supabase para autenticación, base de datos y archivos. Su infraestructura y la de OpenAI pueden procesar información fuera de México conforme a sus condiciones. El personal autorizado de ECOGEN accede a las solicitudes para atenderlas. No se ofrece venta de tus datos ni publicación de recibos. Cualquier comunicación a terceros distinta de los servicios necesarios o de una obligación legal debe revisarse y contar con la base jurídica correspondiente.</p>
 <h2>Conservación y eliminación</h2>
 <p>{retention||'ECOGEN aún debe definir y comunicar un plazo de conservación de cotizaciones y recibos.'} La eliminación debe considerar los archivos y registros asociados, obligaciones legales aplicables y los periodos de respaldo de los proveedores. No se afirma que exista borrado automático.</p>
 <h2>Tus derechos y cómo ejercerlos</h2>
 <p>Puedes solicitar acceso, rectificación, cancelación u oposición (derechos ARCO), revocar tu consentimiento o limitar el uso y divulgación de tus datos mediante el contacto de privacidad indicado arriba. Identifica tu solicitud o folio, el derecho que deseas ejercer y un medio para recibir respuesta. Se solicitará únicamente la información necesaria para verificar tu identidad; no envíes identificaciones ni recibos por canales no verificados. Las solicitudes se atenderán conforme a la legislación mexicana aplicable. La revocación no tiene efectos retroactivos y algunas obligaciones legales pueden impedir una eliminación inmediata.</p>
 <h2>Seguridad y enlaces privados</h2>
 <p>La aplicación contempla controles de acceso y recibos privados. Su eficacia depende también de la configuración de los servicios y de la protección de las cuentas administrativas. Ningún sistema garantiza seguridad absoluta. No compartas tu enlace privado de cotización: quien lo tenga puede consultar su PDF.</p>
 <h2>Navegación y servicios externos</h2>
 <p>La página carga una imagen de demostración desde Unsplash, que puede recibir tu dirección IP y datos técnicos de conexión. Los proveedores de alojamiento pueden registrar información técnica para operar y proteger el servicio. El acceso administrativo utiliza autenticación. Este aviso no implica consentimiento para incorporar rastreadores publicitarios; cualquier incorporación requiere actualizar la información y los controles correspondientes.</p>
 <h2>Cambios al aviso</h2>
 <p>Las actualizaciones se publicarán en esta misma página con su fecha. Si cambian las finalidades o las condiciones que requieren consentimiento, deberá solicitarse nuevamente cuando corresponda.</p>
 </main>;
}
