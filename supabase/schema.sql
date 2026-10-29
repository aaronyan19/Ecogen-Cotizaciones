-- Ejecutar en el editor SQL de un proyecto Supabase nuevo.
create extension if not exists pgcrypto;
create table public.settings(id text primary key, value jsonb not null);
create table public.quotes(
 id uuid primary key default gen_random_uuid(), number text unique not null,
 request_id uuid unique not null, access_hash text unique not null,
 created_at timestamptz not null default now(), customer jsonb not null,
 configuration jsonb not null, pricing jsonb not null, catalog_snapshot jsonb not null,
 recommendation jsonb, receipt_path text, review_notes text,
 status text not null default 'nueva' check(status in ('nueva','pendiente','contactado','negociacion','vendida','cancelada')),
 consent_at timestamptz not null
);
create table public.audit_log(id bigint generated always as identity primary key, created_at timestamptz default now(), action text not null, entity_id text, details jsonb);
alter table public.settings enable row level security;
alter table public.quotes enable row level security;
alter table public.audit_log enable row level security;
-- Sin políticas para anon/authenticated: todas las operaciones pasan por el servidor.
revoke all on public.settings,public.quotes,public.audit_log from anon,authenticated;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('receipts','receipts',false,10485760,array['image/jpeg','image/png','application/pdf']) on conflict(id) do nothing;
create function public.update_catalog(new_value jsonb) returns void language plpgsql security invoker set search_path=public as $$
begin update settings set value=new_value where id='catalog'; insert into audit_log(action,entity_id,details) values('catalog_updated','catalog',new_value); end; $$;
create function public.set_quote_status(quote_id uuid,new_status text) returns void language plpgsql security invoker set search_path=public as $$
begin update quotes set status=new_status where id=quote_id; insert into audit_log(action,entity_id,details) values('status_updated',quote_id::text,jsonb_build_object('status',new_status)); end; $$;
revoke execute on function public.update_catalog(jsonb),public.set_quote_status(uuid,text) from public,anon,authenticated;
grant execute on function public.update_catalog(jsonb),public.set_quote_status(uuid,text) to service_role;
