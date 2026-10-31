import {test,expect} from '@playwright/test';

test('cotiza solo al elegir paneles, asigna inversor y prepara WhatsApp',async({page})=>{
 await page.goto('/');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.getByRole('button',{name:'Quiero mi cotización',exact:true}).click();
 const dialog=page.getByRole('dialog');
 await expect(dialog.getByRole('status')).toContainText('Selecciona el número de paneles');
 await expect(dialog.locator('.summary')).toHaveCount(0);
 await expect(dialog.getByRole('link',{name:'Enviar cotización a ECOGEN Solar'})).toHaveCount(0);
 await expect(dialog.getByRole('textbox')).toHaveCount(0);
 for(const [panels,kw,price] of [[4,3.6,'$31,900.00'],[6,3.6,'$38,900.00'],[8,5,'$48,900.00'],[10,5,'$60,900.00'],[12,5,'$68,900.00'],[14,6,'$79,900.00'],[16,10,'$89,900.00']]){
  await dialog.getByRole('button',{name:`${panels} paneles`,exact:true}).click();
  await expect(dialog.locator('.included-inverter')).toContainText(`Inversor de ${kw} kW incluido`);
  await expect(dialog.locator('.total')).toContainText(String(price));
  await expect(dialog.getByRole('button',{pressed:true})).toHaveCount(1);
 }
 await dialog.getByRole('button',{name:'8 paneles',exact:true}).click();
 await dialog.getByLabel('¿Cómo quieres pagar?').selectOption('6');
 await expect(dialog.locator('.total')).toContainText('$50,367.00');
 await dialog.getByLabel('Tu nombre (opcional)').fill('Ana & José');
 const link=dialog.getByRole('link',{name:'Enviar cotización a ECOGEN Solar'});
 const url=new URL((await link.getAttribute('href'))!);
 expect(url.pathname).toBe('/526142847477');
 expect(url.searchParams.get('text')).toContain('Ana & José');
 expect(url.searchParams.get('text')).toContain('$50,367.00');
 await expect(dialog).toContainText('Pulsa «Enviar» en WhatsApp');
 const promise=page.waitForEvent('download');
 await dialog.getByRole('button',{name:'Descargar mi cotización en PDF'}).click();
 expect((await promise).suggestedFilename()).toBe('ECOGEN-cotizacion.pdf');
 await dialog.getByRole('button',{name:'Cerrar',exact:true}).click();
 await page.getByRole('button',{name:'Cotiza tu sistema solar',exact:true}).click();
 await expect(dialog.locator('.summary')).toHaveCount(0);
 await expect(dialog.getByRole('button',{pressed:true})).toHaveCount(0);
 await page.keyboard.press('Escape');
 await expect(dialog).toHaveCount(0);
 await page.locator('.package').first().getByRole('button',{name:'Elegir este sistema'}).click();
 await expect(page.getByRole('dialog').locator('.total')).toContainText('$31,900.00');
});

test('rutas privadas rechazan acceso y configuración incompatible',async({request})=>{
 expect((await request.get('/api/admin')).status()).toBe(401);
 expect((await request.get('/api/pdf?token='+'a'.repeat(64))).status()).toBe(404);
 expect((await request.post('/api/pdf',{data:{panels:16,kw:3.6,wires:0,months:0}})).status()).toBe(400);
});
