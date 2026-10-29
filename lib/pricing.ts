import {catalog, type Catalog} from './catalog';
export function recommend(value:number){ if(!Number.isFinite(value)||value<=0)throw new Error('Introduce un consumo válido.'); const estimated=Math.ceil(value/360)*2; return {estimated,panels:Math.max(4,estimated),custom:estimated>16}; }
export function compatible(panels:number,kw:number,c:Catalog=catalog){const i=c.inverters.find(i=>i.kw===kw);return !!i&&(i.max===null?panels===14&&kw===6:panels<=i.max);}
export function calculate(input:{panels:number;kw:number;wires:number;months:number},c:Catalog=catalog){
 const p=c.packages.find(p=>p.panels===input.panels);const f=c.financing.find(f=>f.months===input.months);
 if(!p||!f||![0,1,2].includes(input.wires)||!compatible(input.panels,input.kw,c))throw new Error('Configuración no permitida.');
 const inverter=Math.ceil(Math.max(0,input.kw-p.base))*c.extraKwCents;const electrical=input.wires===1?c.upgradeCents:0;const cash=p.price+inverter+electrical;const total=Math.round(cash*(10000+f.bps)/10000);const count=f.months||1;const installment=Math.floor(total/count);const last=total-installment*(count-1);
 return {base:p.price,inverter,electrical,cash,total,months:f.months,bps:f.bps,installment,last,review:input.wires===0||input.kw===6||input.kw<p.base};
}
