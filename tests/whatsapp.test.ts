import {test} from 'node:test';
import assert from 'node:assert/strict';
import {catalog,mxn} from '../lib/catalog';
import {customerQuote} from '../lib/customer-quote';
import {quoteWhatsAppUrl,whatsappContact} from '../lib/whatsapp';

const input={name:'Ana Pérez',panels:8,wires:1 as const,months:6};
const message=(url:string)=>new URL(url).searchParams.get('text')!;
function line(text:string,label:string){
 const result=text.split('\n').find(value=>value.startsWith(label));
 assert(result,`Falta ${label} en la cotización de WhatsApp`);
 return result;
}

test('WhatsApp usa el destinatario indicado y conserva el nombre codificado sin agregar parámetros',()=>{
 assert.deepEqual(whatsappContact,{phone:'526141774155',displayPhone:'+52 614 177 4155',url:'https://wa.me/526141774155'});
 const url=new URL(quoteWhatsAppUrl({...input,name:'  María José & Hijos /#  '}));
 assert.equal(url.protocol,'https:');
 assert.equal(url.hostname,'wa.me');
 assert.equal(url.pathname,'/526141774155');
 assert.equal(url.hash,'');
 assert.deepEqual([...url.searchParams.keys()],['text']);
 assert.equal(line(message(url.href),'Nombre:'),'Nombre: María José & Hijos /#');
});

test('mensaje refleja paneles, inversor, aumento a 220 V y total financiado vigente',()=>{
 const text=message(quoteWhatsAppUrl(input));
 assert.match(line(text,'Paneles:'),/8/);
 assert.match(line(text,'Inversor incluido:'),/5\s*kW/);
 assert.match(line(text,'Servicio de 220 V:'),/no/i);
 assert(text.includes(mxn(200000)),'Incluye el cargo eléctrico de $2,000 MXN');
 assert(line(text,'Subtotal de contado:').includes(mxn(5090000)));
 assert(line(text,'Forma de pago:').includes('6'));
 assert(line(text,'Total:').includes(mxn(5242700)));
 assert(text.includes(mxn(873783)),'Incluye la mensualidad calculada en centavos');
 assert(line(text,'Última mensualidad:').includes(mxn(873785)));
 assert.match(text,/preliminar/i);
});

test('todos los plazos y paquetes corresponden a la cotización calculada',()=>{
 for(const p of catalog.packages)for(const f of catalog.financing){
  const text=message(quoteWhatsAppUrl({...input,panels:p.panels,wires:2,months:f.months}));
  const {kw,pricing}=customerQuote(p.panels,f.months,catalog,2);
  assert(line(text,'Inversor incluido:').includes(`${kw} kW`));
  assert(line(text,'Subtotal de contado:').includes(mxn(pricing.cash)));
  assert(line(text,'Total:').includes(mxn(pricing.total)));
  if(f.months){
   assert(line(text,'Forma de pago:').includes(String(f.months)));
   assert(text.includes(mxn(pricing.installment)));
   assert(line(text,'Última mensualidad:').includes(mxn(pricing.last)));
  }else assert.match(line(text,'Forma de pago:'),/contado/i);
 }
});

test('servicio eléctrico desconocido conserva el aviso de revisión y cargo no incluido',()=>{
 const text=message(quoteWhatsAppUrl({...input,wires:0,months:0}));
 assert.match(text,/pendiente.*revisi[oó]n|revisi[oó]n.*pendiente/i);
 assert.match(text,/\$2,000(?:\.00)?/);
 assert.match(text,/no incluido/i);
 assert(line(text,'Subtotal de contado:').includes(mxn(4890000)));
 assert(line(text,'Total:').includes(mxn(4890000)));
});

test('rechaza nombres inválidos, paquetes inexistentes y plazos no disponibles',()=>{
 for(const name of ['', '   ', 'ab', 'a'.repeat(121)])assert.throws(()=>quoteWhatsAppUrl({...input,name}));
 assert.doesNotThrow(()=>quoteWhatsAppUrl({...input,name:'Ana'}));
 assert.doesNotThrow(()=>quoteWhatsAppUrl({...input,name:'a'.repeat(120)}));
 for(const panels of [0,7,18,NaN])assert.throws(()=>quoteWhatsAppUrl({...input,panels}));
 for(const months of [-1,9,NaN])assert.throws(()=>quoteWhatsAppUrl({...input,months}));
});

test('usa el catálogo suministrado para inversor, precio, cargo y financiamiento',()=>{
 const custom=structuredClone(catalog);
 const selected=custom.packages.find(p=>p.panels===8)!;
 selected.price=5000000;selected.base=10;
 custom.upgradeCents=350000;
 custom.financing.find(f=>f.months===6)!.bps=500;
 const text=message(quoteWhatsAppUrl(input,custom));
 assert(line(text,'Inversor incluido:').includes('10 kW'));
 assert(line(text,'Subtotal de contado:').includes(mxn(5350000)));
 assert(line(text,'Total:').includes(mxn(5617500)));
 assert(line(text,'Última mensualidad:').includes(mxn(936250)));
 assert(text.includes(mxn(350000)));
 assert.equal(catalog.packages.find(p=>p.panels===8)!.price,4890000);
});
