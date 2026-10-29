import {NextResponse} from 'next/server';
import {createHash} from 'node:crypto';
import {db,currentCatalog,rateLimit} from '@/lib/server';
import {calculate} from '@/lib/pricing';
import {makePdf} from '@/lib/pdf';
function output(b:Uint8Array){return new Response(Buffer.from(b),{headers:{'Content-Type':'application/pdf','Content-Disposition':'attachment; filename="ECOGEN-cotizacion.pdf"','Cache-Control':'no-store','Referrer-Policy':'no-referrer'}});}
export async function POST(req:Request){try{rateLimit(req);const config=await req.json();const c=await currentCatalog();return output(await makePdf({number:'VISTA PREVIA - NO GUARDADA',configuration:config,pricing:calculate(config,c),catalog_snapshot:c}));}catch{return NextResponse.json({error:'Configuración inválida.'},{status:400});}}
export async function GET(req:Request){try{rateLimit(req);const token=new URL(req.url).searchParams.get('token');if(!token||!/^[a-f0-9]{64}$/.test(token))throw new Error();const client=db();if(!client)throw new Error();const {data,error}=await client.from('quotes').select('*').eq('access_hash',createHash('sha256').update(token).digest('hex')).single();if(error||!data)throw new Error();return output(await makePdf(data));}catch{return NextResponse.json({error:'Cotización no disponible o acceso inválido.'},{status:404});}}
