import {test} from 'node:test';
import assert from 'node:assert/strict';
import {customerQuote, whatsappQuote} from '../lib/customer-quote';

test('cada paquete lleva exactamente su inversor incluido y su precio de contado',()=>{
 for(const [panels,kw,cash] of [[4,3.6,3190000],[6,3.6,3890000],[8,5,4890000],[10,5,6090000],[12,5,6890000],[14,6,7990000],[16,10,8990000]]){
  const q=customerQuote(panels,0);
  assert.equal(q.kw,kw);assert.equal(q.pricing.total,cash);assert.equal(q.pricing.inverter,0);assert.equal(q.pricing.electrical,0);
 }
 assert.throws(()=>customerQuote(0,0));assert.throws(()=>customerQuote(5,0));
});

test('WhatsApp recibe el destino correcto y los mismos totales y cuotas que la cotización',()=>{
 const url=new URL(whatsappQuote(8,6,'Ana & José'));
 assert.equal(url.origin,'https://wa.me');assert.equal(url.pathname,'/526142847477');
 const message=url.searchParams.get('text')!;
 for(const text of ['Ana & José','8 de 630 W','5 kW','$48,900.00','$50,367.00','5 mensualidades de $8,394.50','última de $8,394.50'])assert(message.includes(text),text);
 assert(!new URL(whatsappQuote(4,0,'')).searchParams.get('text')!.includes('Nombre:'));
});
