import {FileText, ArrowUpRight} from 'lucide-react';
import {panelDatasheet, inverterDatasheets} from '@/lib/datasheets';

export function DatasheetLink({sheet}: {sheet: {title: string; href: string}}) {
 return <a className="datasheet-link" href={sheet.href} target="_blank" rel="noopener noreferrer">
  <FileText size={17} aria-hidden="true"/>
  <span>{sheet.title}<small>Ver ficha técnica · PDF · abre en otra pestaña</small></span>
  <ArrowUpRight size={16} aria-hidden="true"/>
 </a>;
}

export function QuoteDatasheets({kw}: {kw: number}) {
 const inverter = inverterDatasheets.find(sheet => sheet.kw === kw);
 return <section className="quote-datasheets" aria-label="Fichas técnicas de tu sistema">
  <h3>Fichas técnicas de tu sistema</h3>
  <p>Consulta los equipos de referencia sin perder tu cotización. Los modelos definitivos se confirman durante la revisión técnica.</p>
  <DatasheetLink sheet={panelDatasheet}/>
  {inverter ? <DatasheetLink sheet={inverter}/> : <p className="notice">Ficha técnica del inversor de {kw} kW pendiente de confirmación.</p>}
 </section>;
}
