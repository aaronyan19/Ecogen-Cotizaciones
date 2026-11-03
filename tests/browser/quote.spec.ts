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
 await d.getByRole('button',{name:'Enviar mi cotización y recibo'}).click();
 expect(await page.evaluate(()=>(window as unknown as {submitted:unknown}).submitted)).toMatchObject({filename:'recibo.pdf',quote:{name:'Cliente Prueba',panels:4}});
 await expect(d.getByRole('status')).toContainText('no se guardó ni envió');
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
