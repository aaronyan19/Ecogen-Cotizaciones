import {test,expect} from '@playwright/test';
test('fichas públicas y del inversor incluido en cada paquete',async({page,request})=>{
 await page.goto('/');
 const links=page.locator('#equipos').getByRole('link',{name:/Ver ficha técnica/});
 await expect(links).toHaveCount(4);
 for(const link of await links.all()){
  await expect(link).toHaveAttribute('target','_blank');
  const response=await request.get((await link.getAttribute('href'))!);
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/pdf');
  expect((await response.body()).subarray(0,5).toString()).toBe('%PDF-');
 }
 await page.getByRole('button',{name:'Cotiza tu sistema solar',exact:true}).click();
 const dialog=page.getByRole('dialog');
 await dialog.getByRole('button',{name:'4 paneles',exact:true}).click();
 await dialog.locator('summary').click();
 const sheets=dialog.getByRole('region',{name:'Fichas técnicas de tu sistema'});
 await expect(sheets.getByRole('link',{name:/Panel GCL/})).toBeVisible();
 for(const [panels,model] of [[4,'3600'],[6,'3600'],[8,'5000'],[10,'5000'],[12,'5000'],[16,'10000']]){
  await dialog.getByRole('button',{name:`${panels} paneles`,exact:true}).click();
  await expect(sheets.getByRole('link',{name:/Growatt/})).toHaveAttribute('href',`/fichas-tecnicas/growatt-min-${model}tl-x2.pdf`);
 }
 await dialog.getByRole('button',{name:'14 paneles',exact:true}).click();
 await expect(sheets).toContainText('Ficha técnica del inversor de 6 kW pendiente');
 await expect(sheets.getByRole('link')).toHaveCount(1);
 expect(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth)).toBeTruthy();
});
