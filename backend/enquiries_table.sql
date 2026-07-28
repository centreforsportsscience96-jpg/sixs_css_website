create table if not exists enquiries (
  id bigint generated always as identity primary key,
  full_name text not null,
  email text not null,
  phone text not null,
  location text not null,
  source text not null,
  message text not null,
  created_at timestamptz not null default now()
);

grant all on table enquiries to service_role;
grant usage, select on sequence enquiries_id_seq to service_role;

-- The contact form submits directly from the browser using the Supabase anon key,
-- so anon needs insert access. RLS stays on so anon can only insert, never read/update/delete.
alter table enquiries enable row level security;

grant insert on table enquiries to anon;
grant usage on sequence enquiries_id_seq to anon;

create policy "Allow public enquiry submissions"
  on enquiries
  for insert
  to anon
  with check (true);
