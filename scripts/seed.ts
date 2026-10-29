import {createClient} from '@supabase/supabase-js';
import {catalog} from '../lib/catalog';
const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
if(!url||!key)throw new Error('Configura Supabase en .env.local antes de cargar el catálogo.');
const c=createClient(url,key,{auth:{persistSession:false}});
const {error}=await c.from('settings').upsert({id:'catalog',value:catalog},{onConflict:'id',ignoreDuplicates:true});if(error)throw new Error('No se pudo cargar el catálogo. Ejecuta primero schema.sql.');console.log('Catálogo preparado sin sobrescribir valores existentes.');
