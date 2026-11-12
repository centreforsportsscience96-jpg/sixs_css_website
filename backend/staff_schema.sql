-- =============================================================================
-- Centre For Sports Science - Staff Members Schema & Photo Storage Policies
-- Run this script once in the Supabase Dashboard SQL Editor (requires notices_schema.sql
-- helpers `public.is_admin()` and `public.touch_updated_at()`).
-- =============================================================================

-- Ensure shared timestamp helper exists if executed independently
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 1. Staff Members table
create table if not exists public.staff_members (
  id bigint generated always as identity primary key,
  name text not null check (char_length(trim(name)) between 2 and 120),
  designation text not null check (char_length(trim(designation)) between 2 and 150),
  department text not null default 'Sports Physiotherapy' check (char_length(trim(department)) between 2 and 100),
  bio text not null check (char_length(trim(bio)) between 1 and 5000),
  photo_url text,
  display_order integer not null default 0,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.staff_members
  add column if not exists department text not null default 'Sports Physiotherapy';

drop trigger if exists staff_members_touch_updated_at on public.staff_members;
create trigger staff_members_touch_updated_at
  before update on public.staff_members
  for each row
  execute function public.touch_updated_at();

-- Explicit table and sequence privileges required by Supabase API roles
grant select on table public.staff_members to anon, authenticated;
grant insert, update, delete on table public.staff_members to authenticated;
grant all on table public.staff_members to service_role;
grant usage, select on sequence public.staff_members_id_seq to authenticated, service_role;

alter table public.staff_members enable row level security;

drop policy if exists "Public can read staff members" on public.staff_members;
create policy "Public can read staff members"
  on public.staff_members
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can manage staff members" on public.staff_members;
create policy "Admins can manage staff members"
  on public.staff_members
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 2. Public Storage Bucket for Staff Profile Photos
insert into storage.buckets (id, name, public)
values ('staff-photos', 'staff-photos', true)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "Public can view staff photos" on storage.objects;
create policy "Public can view staff photos"
  on storage.objects
  for select
  to public
  using (bucket_id = 'staff-photos');

drop policy if exists "Admins can upload staff photos" on storage.objects;
create policy "Admins can upload staff photos"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'staff-photos'
    and public.is_admin()
  );

drop policy if exists "Admins can update staff photos" on storage.objects;
create policy "Admins can update staff photos"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'staff-photos'
    and public.is_admin()
  );

drop policy if exists "Admins can delete staff photos" on storage.objects;
create policy "Admins can delete staff photos"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'staff-photos'
    and public.is_admin()
  );

