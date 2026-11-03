import {type Catalog, catalog} from './catalog';
import {calculate} from './pricing';


export function customerQuote(panels:number, months:number, c:Catalog=catalog,wires:0|1|2=0) {
 const kw=c.packages.find(p=>p.panels===panels)?.base;
 if (!kw) throw new Error('Elige un paquete de paneles disponible.');
 return {kw, pricing:calculate({panels,kw,months,wires},c)};
}
