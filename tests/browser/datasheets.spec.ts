import {test, expect} from '@playwright/test';

test('fichas públicas y selección de inversor durante la cotización', async ({page, request}) => {
 await page.goto('/');
 const equipment = page.locator('#equipos');
 const links = equipment.getByRole('link', {name: /Ver ficha técnica/});
 await expect(links).toHaveCount(4);
 for (const link of await links.all()) {
  await expect(link).toHaveAttribute('target', '_blank');
  const response = await request.get((await link.getAttribute('href'))!);
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/pdf');
  expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-');
 }
 await page.getByRole('button', {name: 'Cotiza tu sistema solar', exact: true}).click();
 await page.getByLabel('Nombre completo').fill('Cliente Prueba');
 await page.getByLabel('WhatsApp *').fill('6141234567');
 await page.getByRole('checkbox').check();
 await page.getByRole('button', {name: 'Continuar', exact: true}).click();
 const sheets = page.getByRole('region', {name: 'Fichas técnicas de tu sistema'});
 await expect(sheets.getByRole('link', {name: /Panel GCL/})).toBeVisible();
 for (const [panels, model] of [['4', '3600'], ['8', '5000'], ['16', '10000']]) {
  await page.getByLabel('Paquete elegido').selectOption(panels);
  await expect(sheets.getByRole('link', {name: /Growatt/})).toHaveAttribute('href', `/fichas-tecnicas/growatt-min-${model}tl-x2.pdf`);
  await expect(sheets.getByRole('link')).toHaveCount(2);
 }
 await page.getByLabel('Paquete elegido').selectOption('14');
 await expect(sheets).toContainText('Ficha técnica del inversor de 6 kW pendiente');
 await expect(sheets.getByRole('link')).toHaveCount(1);
 await page.getByRole('combobox', {name: 'Inversor', exact: true}).selectOption('10');
 await page.getByRole('button', {name: 'Continuar', exact: true}).click();
 await expect(sheets.getByRole('link', {name: /10000TL-X2/})).toBeVisible();
 await expect(page.locator('.modal')).toContainText('14 paneles de 630 W · inversor 10 kW');
});
