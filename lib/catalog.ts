export const catalog = {
 packages: [{panels:4,price:3190000,base:3.6},{panels:6,price:3890000,base:3.6},{panels:8,price:4890000,base:5},{panels:10,price:6090000,base:5},{panels:12,price:6890000,base:5},{panels:14,price:7990000,base:6},{panels:16,price:8990000,base:10}],
 inverters:[{kw:3.6,max:8},{kw:5,max:12},{kw:6,max:null},{kw:10,max:22}],
 financing:[{months:0,bps:0},{months:3,bps:0},{months:6,bps:300},{months:12,bps:1200}],
 upgradeCents:200000, extraKwCents:120000,
 conditions:'Cotización preliminar sujeta a validación técnica. Materiales, instalación, garantías, vigencia y condiciones definitivas pendientes de confirmación por ECOGEN.'
};
export type Catalog = typeof catalog;
export const mxn=(c:number)=>new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(c/100);
export const financingNotice='El financiamiento se realiza exclusivamente mediante tarjeta de crédito. La disponibilidad de meses y promociones depende de la tarjeta y del banco emisor. La autorización y disponibilidad del financiamiento se verifican presencialmente mediante nuestra terminal bancaria.';
