import Home from './ui';
import {currentCatalog} from '@/lib/server';
export const dynamic='force-dynamic';
export default async function Page(){return <Home initialCatalog={await currentCatalog()} demo={!process.env.SUPABASE_SERVICE_ROLE_KEY}/>}
