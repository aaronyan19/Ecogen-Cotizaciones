'use client';
import {useEffect, useRef, useState} from 'react';
import {X, Check, MessageCircle} from 'lucide-react';
import {type Catalog, mxn, financingNotice} from '@/lib/catalog';
import {customerQuote} from '@/lib/customer-quote';
import {validateFile} from '@/lib/validation';
import {QuoteDatasheets} from './datasheets';
import {quoteWhatsAppUrl, whatsappContact} from '@/lib/whatsapp';

export default function QuoteBuilder({catalog:c, panels, onChoose, onClose,demo}:{demo:boolean;catalog:Catalog;panels:number|null;onChoose:(n:number)=>void;onClose:()=>void}) {
 const [months,setMonths]=useState(0),[name,setName]=useState(''),[message,setMessage]=useState(''),[busy,setBusy]=useState(false);
 const [wires,setWires]=useState<0|1|2>(0),[file,setFile]=useState<File|null>(null),[consent,setConsent]=useState(false),[saved,setSaved]=useState(false);
 const requestId=useRef('');
 const upload=useRef<HTMLInputElement>(null);
 const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const d=dialog.current;d?.showModal();return()=>d?.close();},[]);
 const quote=panels===null?null:customerQuote(panels,months,c,wires);
 function shareWhatsApp(){
  if(panels===null||!quote)return;
  if(name.trim().length<3||!consent){setMessage('Completa tu nombre y acepta el aviso de privacidad para continuar por WhatsApp.');return;}
  const url=quoteWhatsAppUrl({name,panels,wires,months},c);
  window.open(url,'_blank','noopener,noreferrer');
  setMessage('Confirma el envío en WhatsApp. Si quieres compartir el PDF o tu recibo, adjúntalos allí manualmente.');
 }
 async function download(){
  if(panels===null||!quote)return;if(name.trim().length<3){setMessage('Escribe tu nombre completo para preparar la cotización.');return;}
  setBusy(true);setMessage('');
  try {
   const r=await fetch('/api/pdf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({panels,kw:quote.kw,wires,months,name:name.trim()})});
   if(!r.ok)throw new Error('No fue posible generar el PDF. Intenta de nuevo.');
   const url=URL.createObjectURL(await r.blob());const a=document.createElement('a');a.href=url;a.download='ECOGEN-cotizacion.pdf';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }catch(e){setMessage((e as Error).message);}finally{setBusy(false);}
 }
 async function save(){
  if(!quote||panels===null)return;
  if(name.trim().length<3||!consent){setMessage('Completa tu nombre y acepta el aviso de privacidad para enviar la solicitud.');return;}
  setBusy(true);setMessage('');
  try{
   if(!requestId.current)requestId.current=crypto.randomUUID();
   const fd=new FormData();fd.set('quote',JSON.stringify({name:name.trim(),consent,panels,kw:quote.kw,wires,months,consumption:null,requestId:requestId.current}));if(file)fd.set('file',file);
   const r=await fetch('/api/quotes',{method:'POST',body:fd});const data=await r.json();if(!r.ok)throw new Error(data.error);
   setSaved(true);setMessage('Solicitud guardada: '+data.number);
  }catch(e){setMessage((e as Error).message);}finally{setBusy(false);}
 }
 return <dialog className="modal simple-quote" ref={dialog} onCancel={onClose} aria-labelledby="quote-title">
  <div className="modal-head"><div><div className="eyebrow">FÁCIL, CLARO Y SIN COMPROMISO</div><h2 id="quote-title">Arma tu cotización</h2></div><button aria-label="Cerrar" onClick={onClose}><X/></button></div>
  <h3>¿Cuántos paneles quieres?</h3><p>Elige un paquete para ver el precio. El inversor adecuado ya está incluido.</p>
  <div className="panel-options" role="group" aria-label="Número de paneles">{c.packages.map(p=><button key={p.panels} aria-pressed={panels===p.panels} onClick={()=>{onChoose(p.panels);setMessage('');}}><strong>{p.panels}</strong><span>paneles</span>{panels===p.panels&&<Check size={16} aria-hidden="true"/>}</button>)}</div>
  <label className="simple-label">Nombre completo *<input autoComplete="name" maxLength={120} required value={name} onChange={e=>setName(e.target.value)} placeholder="¿Cómo te llamas?"/></label>
  <label className="simple-label">¿Cuentas con servicio eléctrico de 220 V?<select value={wires} onChange={e=>setWires(Number(e.target.value) as 0|1|2)}><option value={0}>No estoy seguro</option><option value={2}>Sí, cuento con 220 V</option><option value={1}>No cuento con 220 V</option></select></label>
  <label className="simple-label">Adjuntar recibo de CFE (opcional)<input ref={upload} type="file" accept="image/jpeg,image/png,application/pdf" onChange={e=>{const f=e.target.files?.[0];if(!f)return;try{validateFile(f);setFile(f);setMessage('');}catch(err){setMessage((err as Error).message);e.target.value='';}}}/><small>Foto JPG o PNG, o PDF · máximo 10 MB. No necesitas adjuntarlo para cotizar.</small></label>
  {file&&<div className="file-preview"><span>{file.name}</span><button onClick={()=>{setFile(null);if(upload.current)upload.current.value='';}}>Eliminar archivo</button></div>}
  {quote&&panels!==null?<>
   <p className="included-inverter"><Check size={18} aria-hidden="true"/> Inversor de {quote.kw} kW incluido · selección automática</p>
   <label className="simple-label">¿Cómo quieres pagar?<select value={months} onChange={e=>setMonths(Number(e.target.value))}>{c.financing.map(f=><option key={f.months} value={f.months}>{f.months?`${f.months} meses · ${f.bps/100}% de recargo`:'Contado'}</option>)}</select></label>
   <h3>Tu cotización{name.trim()?` para ${name.trim()}`:''}</h3><div className="summary" aria-live="polite"><div><span>{panels} paneles de 630 W + inversor de {quote.kw} kW</span><b>{mxn(quote.pricing.base)}</b></div>{quote.pricing.electrical>0&&<div><span>Revisión y aumento a 220 V</span><b>{mxn(quote.pricing.electrical)}</b></div>}{months>0&&<><div><span>Recargo de financiamiento ({quote.pricing.bps/100}%)</span><b>{mxn(quote.pricing.total-quote.pricing.cash)}</b></div><div><span>{months-1} mensualidades de {mxn(quote.pricing.installment)}<br/>Última mensualidad: {mxn(quote.pricing.last)}</span></div></>}<div className="total"><span>Total {months?'financiado':'de contado'}</span><b>{mxn(quote.pricing.total)}</b></div></div>
   {months>0&&<p className="notice">{financingNotice}</p>}
   <p className="quote-conditions">{c.conditions} {wires===0?'Servicio eléctrico pendiente de revisión; posible cargo de $2,000 MXN no incluido.':wires===1?'Incluye $2,000 MXN por revisión y aumento a 220 V, sujeto a revisión técnica.':'Servicio de 220 V declarado por el cliente, pendiente de verificación.'}</p>
   <QuoteDatasheets kw={quote.kw}/>
   <label className="check"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/> Acepto el <a href="/privacidad" target="_blank" rel="noopener noreferrer">aviso de privacidad</a> para compartir mi cotización con ECOGEN y, si guardo mi solicitud, el recibo que adjunte.</label>
   <button className="whatsapp-cta" disabled={busy} onClick={shareWhatsApp}><MessageCircle size={20} aria-hidden="true"/> Enviar cotización por WhatsApp</button>
   <p className="whatsapp-help">Se abrirá WhatsApp para ECOGEN al {whatsappContact.displayPhone} con tu cotización escrita. Pulsa Enviar en WhatsApp para compartirla. El PDF y el recibo no se adjuntan automáticamente; puedes descargarlos o seleccionarlos y adjuntarlos en el chat.</p>
   {demo&&<p className="notice">Modo demostración: puedes consultar y descargar tu cotización, o abrir WhatsApp para enviarla tú. El guardado de solicitudes y recibos no está disponible.</p>}
   <button className="text-button" disabled={busy||saved} onClick={save}>{saved?'Solicitud guardada':'Guardar mi solicitud y recibo'}</button>
   <button className="text-button" disabled={busy} onClick={download}>{busy?'Preparando PDF…':'Descargar mi cotización en PDF'}</button>
  </>:<p className="empty-quote" role="status">Selecciona el número de paneles para comenzar tu cotización.</p>}
 {message&&<p role="status" className="notice">{message}</p>}
 </dialog>;
}
