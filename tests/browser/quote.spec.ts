import {test,expect} from '@playwright/test';
test('cotización, validaciones, cuotas, PDF y fallo honesto sin base de datos',async({page})=>{
 await page.goto('/');await expect(page.getByRole('heading',{name:'El sol es de todos. El ahorro, tuyo.'})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.getByRole('button',{name:'Cotiza tu sistema solar',exact:true}).click();
 await page.getByRole('button',{name:'Continuar',exact:true}).click();await expect(page.getByRole('status')).toContainText('Completa nombre');
 await page.getByLabel('Nombre completo').fill('Cliente Prueba');await page.getByLabel('WhatsApp *').fill('6141234567');await page.getByRole('checkbox').check();
 await page.getByLabel('Primer valor debajo').fill('1098');await page.getByLabel('Hilos del servicio').selectOption('1');
 await page.getByRole('button',{name:'Continuar',exact:true}).click();await expect(page.getByText('Estimación comercial: 8 paneles.',{exact:false})).toBeVisible();
 await page.getByLabel('Forma de pago').selectOption('6');await expect(page.getByText('El financiamiento se realiza exclusivamente',{exact:false})).toBeVisible();
 await expect(page.locator('.total')).toContainText('$52,427.00');await expect(page.locator('.summary')).toContainText('Última mensualidad: $8,737.85');
 await page.getByRole('button',{name:'Continuar',exact:true}).click();const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Vista previa PDF'}).click();const download=await downloadPromise;expect(download.suggestedFilename()).toContain('.pdf');
 await page.getByRole('button',{name:'Enviar mi cotización a ECOGEN Solar'}).click();await expect(page.getByRole('status')).toContainText('no se guardó ni envió');
 await page.screenshot({path:`/tmp/ecogen-${test.info().project.name}.png`,fullPage:true});
});
test('recibo ilegible permite captura manual; no se inventa extracción',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Cotiza tu sistema solar',exact:true}).click();await page.getByRole('checkbox').check();await page.locator('input[type=file]').setInputFiles({name:'recibo.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.7\nDemo')});await page.getByRole('button',{name:'Analizar recibo con IA'}).click();await expect(page.getByRole('status')).toContainText('IA no configurada');await page.getByRole('button',{name:'Eliminar archivo'}).click();await expect(page.getByRole('button',{name:'Analizar recibo con IA'})).toHaveCount(0);
});
test('rutas privadas rechazan acceso y tokens de otras cotizaciones',async({request})=>{
 expect((await request.get('/api/admin')).status()).toBe(401);expect((await request.get('/api/pdf?token='+'a'.repeat(64))).status()).toBe(404);expect((await request.post('/api/pdf',{data:{panels:16,kw:3.6,wires:2,months:0}})).status()).toBe(400);
});
