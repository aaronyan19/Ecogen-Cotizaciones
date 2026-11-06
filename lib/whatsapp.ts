import {catalog, mxn, financingNotice, type Catalog} from './catalog';
import {customerQuote} from './customer-quote';

const phone = '526141774155';
export const whatsappContact = {
 phone,
 displayPhone: '+52 614 177 4155',
 url: `https://wa.me/${phone}`,
};

export function quoteWhatsAppUrl(input: {name: string; panels: number; wires: 0|1|2; months: number}, c: Catalog = catalog) {
 const name = input.name.trim();
 if (name.length < 3 || name.length > 120) throw new Error('Escribe tu nombre completo para preparar la cotización.');
 const {kw, pricing: p} = customerQuote(input.panels, input.months, c, input.wires);
 const lines = [
  'Hola, ECOGEN. Quiero solicitar esta cotización:',
  `Nombre: ${name}`,
  `Paneles: ${input.panels} de 630 W`,
  `Inversor incluido: ${kw} kW`,
  `Servicio de 220 V: ${input.wires === 2 ? 'Sí, declarado por el cliente' : input.wires === 1 ? 'No cuento con 220 V' : 'No estoy seguro'}`,
  `Forma de pago: ${input.months ? `${input.months} meses` : 'Contado'}`,
  `Precio del paquete: ${mxn(p.base)}`,
 ];
 if (p.electrical > 0) lines.push(`Revisión y aumento a 220 V: ${mxn(p.electrical)}`);
 lines.push(`Subtotal de contado: ${mxn(p.cash)}`);
 if (input.months) {
  lines.push(`Recargo de financiamiento (${p.bps / 100}%): ${mxn(p.total - p.cash)}`);
  lines.push(`${input.months - 1} mensualidades de ${mxn(p.installment)}`, `Última mensualidad: ${mxn(p.last)}`);
 }
 lines.push(`Total: ${mxn(p.total)}`, '', c.conditions);
 if (input.wires === 0) lines.push(`Servicio eléctrico pendiente de revisión; posible cargo de ${mxn(c.upgradeCents)} no incluido.`);
 if (input.wires === 1) lines.push('El aumento a 220 V está sujeto a revisión técnica.');
 if (input.months) lines.push(financingNotice);
 return `${whatsappContact.url}?text=${encodeURIComponent(lines.join('\n'))}`;
}
