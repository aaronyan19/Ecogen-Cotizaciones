import {test,expect} from '@playwright/test';
test('cotizador simple: siete paquetes, 220 V, plazos y PDF sin teléfono ni recibo obligatorio',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Cotiza tu sistema solar',exact:true}).click();
 const d=page.getByRole('dialog');
 await expect(d.locator('.summary')).toHaveCount(0);
 await expect(d.getByRole('textbox')).toHaveCount(1);
 await d.getByLabel('Nombre completo').fill('Ana Pérez');
 for(const [n,total] of [[4,'$31,900.00'],[6,'$38,900.00'],[8,'$48,900.00'],[10,'$60,900.00'],[12,'$68,900.00'],[14,'$79,900.00'],[16,'$89,900.00']]){
  await d.getByRole('button',{name:`${n} paneles`,exact:true}).click();await expect(d.locator('.total')).toContainText(String(total));
 }
 await d.getByRole('button',{name:'8 paneles',exact:true}).click();
 await d.getByLabel('¿Cuentas con servicio eléctrico de 220 V?').selectOption('1');
 await expect(d.locator('.total')).toContainText('$50,900.00');
 for(const [months,total] of [['3','$50,900.00'],['6','$52,427.00'],['12','$57,008.00'],['0','$50,900.00']]){
  await d.getByLabel('¿Cómo quieres pagar?').selectOption(months);await expect(d.locator('.total')).toContainText(total);
 }
 await d.getByLabel('¿Cuentas con servicio eléctrico de 220 V?').selectOption('2');await expect(d.locator('.total')).toContainText('$48,900.00');
 const download=page.waitForEvent('download');await d.getByRole('button',{name:'Descargar mi cotización en PDF'}).click();expect((await download).suggestedFilename()).toBe('ECOGEN-cotizacion.pdf');
 expect(await d.evaluate(el=>el.scrollWidth<=el.clientWidth)).toBeTruthy();
});
test('recibo opcional PDF o foto incluido en solicitud sin contacto obligatorio',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Cotiza tu sistema solar',exact:true}).click();const d=page.getByRole('dialog');
 await d.getByRole('button',{name:'4 paneles',exact:true}).click();await d.getByLabel('Nombre completo').fill('Cliente Prueba');
 const upload=d.getByLabel('Adjuntar recibo de CFE (opcional)');
 await upload.setInputFiles({name:'recibo.png',mimeType:'image/png',buffer:Buffer.from([137,80,78,71,13,10,26,10])});await expect(d.getByText('recibo.png',{exact:true})).toBeVisible();
 await d.getByRole('button',{name:'Eliminar archivo'}).click();
 await upload.setInputFiles({name:'recibo.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.7 demo')});
 await d.getByRole('checkbox').check();
 await page.evaluate(()=>{const original=window.fetch;window.fetch=async(input,init)=>{if(input==='/api/quotes'&&init?.body instanceof FormData){const f=init.body.get('file');(window as unknown as {submitted:unknown}).submitted={quote:JSON.parse(String(init.body.get('quote'))),filename:f instanceof File?f.name:null};}return original(input,init);};});
 await d.getByRole('button',{name:'Guardar mi solicitud y recibo'}).click();
 expect(await page.evaluate(()=>(window as unknown as {submitted:unknown}).submitted)).toMatchObject({filename:'recibo.pdf',quote:{name:'Cliente Prueba',panels:4}});
 await expect(d.getByRole('status')).toContainText('no se guardó ni envió');
});

test('WhatsApp prepara la cotización actual al nuevo número con consentimiento y sin subir el recibo',async({page})=>{
 await page.addInitScript(()=>{
  const state=window as unknown as {whatsappOpens:{url:string;target?:string;features?:string}[]};
  state.whatsappOpens=[];
  window.open=((url?:string|URL,target?:string,features?:string)=>{state.whatsappOpens.push({url:String(url),target,features});return null;}) as typeof window.open;
 });
 let saves=0;
 await page.route('**/api/quotes',async route=>{saves++;await route.fulfill({status:500,json:{error:'No debería guardarse una solicitud al abrir WhatsApp.'}});});
 await page.goto('/');
 await expect(page.locator('footer').getByRole('link',{name:'WhatsApp: +52 614 177 4155'})).toHaveAttribute('href','https://wa.me/526141774155');
 await page.getByRole('button',{name:'Cotiza tu sistema solar',exact:true}).click();
 const d=page.getByRole('dialog');
 const share=d.getByRole('button',{name:'Enviar cotización por WhatsApp'});
 await expect(share).toHaveCount(0);
 await d.getByRole('button',{name:'14 paneles',exact:true}).click();
 await share.click();
 const opened=()=>page.evaluate(()=>(window as unknown as {whatsappOpens:{url:string;target?:string;features?:string}[]}).whatsappOpens);
 expect(await opened()).toHaveLength(0);
 await d.getByLabel('Nombre completo').fill('Ana & José #1');
 await share.click();expect(await opened()).toHaveLength(0);
 await d.getByRole('checkbox').check();
 await d.getByLabel('¿Cuentas con servicio eléctrico de 220 V?').selectOption('1');
 await d.getByLabel('¿Cómo quieres pagar?').selectOption('6');
 await d.getByLabel('Adjuntar recibo de CFE (opcional)').setInputFiles({name:'recibo-privado.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.7 demo')});
 await share.click();
 const first=(await opened())[0];
 const url=new URL(first.url);
 expect(url.origin+url.pathname).toBe('https://wa.me/526141774155');
 expect(first.target).toBe('_blank');expect(first.features).toContain('noopener');expect(first.features).toContain('noreferrer');
 const text=url.searchParams.get('text')!;
 expect(text).toContain('Ana & José #1');expect(text).toContain('Paneles: 14');expect(text).toContain('6 kW');expect(text).toContain('6 meses');expect(text).toContain('Total: $84,357.00');
 expect(text).not.toContain('recibo-privado.pdf');
 await expect(d.getByRole('status')).toContainText('Confirma el envío en WhatsApp');
 await expect(d.locator('.whatsapp-help')).toContainText('no se adjuntan automáticamente');
 await expect(d.getByText('Solicitud guardada',{exact:true})).toHaveCount(0);
 await d.getByRole('button',{name:'4 paneles',exact:true}).click();
 await d.getByLabel('¿Cuentas con servicio eléctrico de 220 V?').selectOption('2');
 await d.getByLabel('¿Cómo quieres pagar?').selectOption('0');
 await share.click();
 const second=new URL((await opened())[1].url).searchParams.get('text')!;
 expect(second).toContain('Paneles: 4');expect(second).toContain('Forma de pago: Contado');expect(second).toContain('Total: $31,900.00');expect(second).not.toContain('$84,357.00');
 await d.getByRole('checkbox').uncheck();await share.click();expect(await opened()).toHaveLength(2);
 expect(saves).toBe(0);
 expect(await d.evaluate(el=>el.scrollWidth<=el.clientWidth)).toBeTruthy();
});
test('aviso accesible y cabeceras de protección; no permite cambios administrativos anónimos',async({page,request})=>{
 const response=await page.goto('/privacidad');
 await expect(page.getByRole('heading',{name:'Aviso de privacidad',exact:true})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Tus derechos y cómo ejercerlos'})).toBeVisible();
 expect(response!.headers()['x-frame-options']).toBe('DENY');
 expect(response!.headers()['x-content-type-options']).toBe('nosniff');
 expect(response!.headers()['content-security-policy']).toContain("frame-ancestors 'none'");
 const change=await request.patch('/api/admin',{data:{action:'status',id:'00000000-0000-0000-0000-000000000000',status:'vendida'}});
 expect(change.ok()).toBe(false);
 expect(change.headers()['cache-control']).toContain('no-store');
});
