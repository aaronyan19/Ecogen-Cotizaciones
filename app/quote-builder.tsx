'use client';
import {useEffect, useRef, useState} from 'react';
import {X, Check, MessageCircle} from 'lucide-react';
import {type Catalog, mxn, financingNotice} from '@/lib/catalog';
import {customerQuote, whatsappQuote} from '@/lib/customer-quote';
import {QuoteDatasheets} from './datasheets';

export default function QuoteBuilder({catalog:c, panels, onChoose, onClose}:{catalog:Catalog;panels:number|null;onChoose:(n:number)=>void;onClose:()=>void}) {
 const [months,setMonths]=useState(0),[name,setName]=useState(''),[message,setMessage]=useState(''),[busy,setBusy]=useState(false);
 const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const d=dialog.current;d?.showModal();return()=>d?.close();},[]);
 const quote=panels===null?null:customerQuote(panels,months,c);
 async function download(){
  if(panels===null||!quote)return;
  setBusy(true);setMessage('');
  try {
   const r=await fetch('/api/pdf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({panels,kw:quote.kw,wires:0,months})});
   if(!r.ok)throw new Error('No fue posible generar el PDF. Intenta de nuevo.');
   const url=URL.createObjectURL(await r.blob());const a=document.createElement('a');a.href=url;a.download='ECOGEN-cotizacion.pdf';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }catch(e){setMessage((e as Error).message);}finally{setBusy(false);}
 }
 return <dialog className="modal simple-quote" ref={dialog} onCancel={onClose} aria-labelledby="quote-title">
  <div className="modal-head"><div><div className="eyebrow">FÁCIL, CLARO Y SIN COMPROMISO</div><h2 id="quote-title">Arma tu cotización</h2></div><button aria-label="Cerrar" onClick={onClose}><X/></button></div>
  <h3>¿Cuántos paneles quieres?</h3><p>Elige un paquete para ver el precio. El inversor adecuado ya está incluido.</p>
  <div className="panel-options" role="group" aria-label="Número de paneles">{c.packages.map(p=><button key={p.panels} aria-pressed={panels===p.panels} onClick={()=>{onChoose(p.panels);setMessage('');}}><strong>{p.panels}</strong><span>paneles</span>{panels===p.panels&&<Check size={16} aria-hidden="true"/>}</button>)}</div>
  {quote&&panels!==null?<>
   <p className="included-inverter"><Check size={18} aria-hidden="true"/> Inversor de {quote.kw} kW incluido · selección automática</p>
   <label className="simple-label">¿Cómo quieres pagar?<select value={months} onChange={e=>setMonths(Number(e.target.value))}>{c.financing.map(f=><option key={f.months} value={f.months}>{f.months?`${f.months} meses · ${f.bps/100}% de recargo`:'Contado'}</option>)}</select></label>
   <div className="summary" aria-live="polite"><div><span>{panels} paneles de 630 W + inversor de {quote.kw} kW</span><b>{mxn(quote.pricing.cash)}</b></div>{months>0&&<><div><span>Recargo de financiamiento ({quote.pricing.bps/100}%)</span><b>{mxn(quote.pricing.total-quote.pricing.cash)}</b></div><div><span>{months-1} mensualidades de {mxn(quote.pricing.installment)}<br/>Última mensualidad: {mxn(quote.pricing.last)}</span></div></>}<div className="total"><span>Total {months?'financiado':'de contado'}</span><b>{mxn(quote.pricing.total)}</b></div></div>
   {months>0&&<p className="notice">{financingNotice}</p>}
   <p className="quote-conditions">{c.conditions} La revisión eléctrica está pendiente; las posibles adecuaciones se cotizan por separado.</p>
   <details className="quote-equipment"><summary>Ver fichas técnicas de los equipos</summary><QuoteDatasheets kw={quote.kw}/></details>
   <label className="simple-label">Tu nombre (opcional)<input autoComplete="name" maxLength={120} value={name} onChange={e=>setName(e.target.value)} placeholder="¿Cómo te llamas?"/></label>
   <a className="whatsapp-cta" href={whatsappQuote(panels,months,name,c)} target="_blank" rel="noopener noreferrer"><MessageCircle size={20} aria-hidden="true"/>Enviar cotización a ECOGEN Solar</a>
   <p className="whatsapp-help">Se abrirá WhatsApp con tu cotización preparada para el +52 614 284 7477. Pulsa «Enviar» en WhatsApp para compartirla. No se envía hasta que lo confirmes allí. <a href="/privacidad" target="_blank" rel="noopener noreferrer">Aviso de privacidad</a>.</p>
   <button className="text-button" disabled={busy} onClick={download}>{busy?'Preparando PDF…':'Descargar mi cotización en PDF'}</button>
   {message&&<p role="status" className="notice">{message}</p>}
  </>:<p className="empty-quote" role="status">Selecciona el número de paneles para comenzar tu cotización.</p>}
 </dialog>;
}
