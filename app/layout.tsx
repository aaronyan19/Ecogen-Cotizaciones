import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'ECOGEN Solar | Tu energía, tu futuro',description:'Cotiza tu sistema solar en Chihuahua. Paneles de 630 W, opciones de contado y financiamiento.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}</body></html>}
