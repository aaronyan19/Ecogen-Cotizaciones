import {type Catalog, catalog, mxn} from './catalog';
import {calculate} from './pricing';

export const businessWhatsapp = '526142847477';
const includedInverters: Record<number, number> = {4:3.6,6:3.6,8:5,10:5,12:5,14:6,16:10};

export function customerQuote(panels:number, months:number, c:Catalog=catalog) {
 const kw=includedInverters[panels];
 if (!kw) throw new Error('Elige un paquete de paneles disponible.');
 return {kw, pricing:calculate({panels,kw,months,wires:0},c)};
}

export function whatsappQuote(panels:number, months:number, name:string, c:Catalog=catalog) {
 const {kw,pricing:p}=customerQuote(panels,months,c);
 const lines=['Hola ECOGEN Solar, quiero solicitar una cotización.',
  ...(name.trim() ? [`Nombre: ${name.trim().slice(0,120)}`] : []),
  `Paneles: ${panels} de 630 W`, `Inversor incluido: ${kw} kW`,
  `Precio de contado: ${mxn(p.cash)}`,
  months ? `Pago: ${months} meses · recargo ${p.bps/100}%` : 'Pago: contado',
  `Total: ${mxn(p.total)}`,
  ...(months ? [`${months-1} mensualidades de ${mxn(p.installment)} y una última de ${mxn(p.last)}.`] : []),
  'Cotización preliminar sujeta a revisión técnica y condiciones de ECOGEN. Revisión eléctrica pendiente; posibles adecuaciones no incluidas.',
 ];
 return `https://wa.me/${businessWhatsapp}?text=${encodeURIComponent(lines.join('\n'))}`;
}
