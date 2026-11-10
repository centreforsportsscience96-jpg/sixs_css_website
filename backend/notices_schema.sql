-- ==============================================================================
-- Centre For Sports Science - Admin CMS & Notices Schema
-- Safe to re-run: idempotent scripts with drop/recreate policies and triggers
-- ==============================================================================

-- ============ 1. ADMIN ALLOWLIST ============
create table if not exists admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table admin_users enable row level security;
-- Intentionally no policies: clients cannot select, insert, update, or delete from this table directly.

-- Security Definer function to safely check admin status from auth.uid()
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

-- Grant execute to authenticated and anon so the client RPC can check admin status
grant execute on function public.is_admin() to authenticated, anon;

-- ============ 2. NOTICES & EVENTS TABLE ============
create table if not exists center_notices (
  id bigint generated always as identity primary key,
  title text not null check (char_length(title) between 3 and 200),
  category text not null default 'Workshop'
    check (category in ('Workshop', 'Screening Camp', 'Seminar', 'Centre Update', 'Milestone')),
  description text not null check (char_length(description) <= 5000),
  event_date date not null,
  image_url text check (image_url is null or image_url ~* '^https://'),
  is_pinned boolean not null default false,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists center_notices_event_date_idx on center_notices (event_date desc);

-- Function and trigger to keep updated_at fresh
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists center_notices_touch on center_notices;
create trigger center_notices_touch before update on center_notices
for each row execute function public.touch_updated_at();

-- Enable Row Level Security (RLS) on notices
alter table center_notices enable row level security;

-- Drop any previous policies
drop policy if exists "Allow public read" on center_notices;
drop policy if exists "Allow auth admin manage" on center_notices;
drop policy if exists "public read notices" on center_notices;
drop policy if exists "admin manage notices" on center_notices;

-- Public can read all notices (for current display and historical archives)
create policy "public read notices" on center_notices
  for select to anon, authenticated using (true);

-- Only verified admins in admin_users can insert, update, or delete notices
create policy "admin manage notices" on center_notices
  for all to authenticated using (is_admin()) with check (is_admin());

-- ============ 3. ENQUIRIES TABLE RLS ============
alter table enquiries enable row level security;

drop policy if exists "public submit enquiries" on enquiries;
drop policy if exists "Allow public enquiry submissions" on enquiries;
drop policy if exists "admin read enquiries" on enquiries;
drop policy if exists "admin delete enquiries" on enquiries;

-- Public can insert new contact enquiries from the website
create policy "public submit enquiries" on enquiries
  for insert to anon, authenticated with check (true);

-- Only verified admins can read enquiries
create policy "admin read enquiries" on enquiries
  for select to authenticated using (is_admin());

-- Only verified admins can delete enquiries
create policy "admin delete enquiries" on enquiries
  for delete to authenticated using (is_admin());

-- ============ 4. POSTER STORAGE BUCKET ============
insert into storage.buckets (id, name, public)
values ('notice-posters', 'notice-posters', true)
on conflict (id) do nothing;

drop policy if exists "admin upload posters" on storage.objects;
drop policy if exists "admin update posters" on storage.objects;
drop policy if exists "admin delete posters" on storage.objects;

create policy "admin upload posters" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'notice-posters' and public.is_admin());

create policy "admin update posters" on storage.objects
  for update to authenticated
  using (bucket_id = 'notice-posters' and public.is_admin())
  with check (bucket_id = 'notice-posters' and public.is_admin());

create policy "admin delete posters" on storage.objects
  for delete to authenticated
  using (bucket_id = 'notice-posters' and public.is_admin());

-- ==============================================================================
-- INSTRUCTIONS FOR INITIAL ADMIN SETUP:
-- In Supabase SQL editor, replace 'YOUR_ADMIN_EMAIL' with your email and run:
--
-- insert into public.admin_users (user_id)
-- select id from auth.users where email = 'YOUR_ADMIN_EMAIL'
-- on conflict do nothing;
-- ==============================================================================
