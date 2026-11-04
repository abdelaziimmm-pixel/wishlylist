-- Wishlylist update 2: screenshot reading (daily limit) and iPhone sharing. Run once in Supabase → SQL Editor.

create table if not exists public.lookup_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null default current_date,
  count int not null default 0,
  primary key (user_id, day)
);
alter table public.lookup_usage enable row level security;   -- no policies: only the function below touches it

create or replace function public.use_lookup(max_per_day int) returns int
language plpgsql security definer set search_path = public as $$
declare c int;
begin
  if auth.uid() is null then raise exception 'sign in first'; end if;
  insert into lookup_usage (user_id, day, count) values (auth.uid(), current_date, 1)
  on conflict (user_id, day) do update set count = lookup_usage.count + 1
  returning count into c;
  if c > max_per_day then raise exception 'daily limit reached'; end if;
  return c;
end $$;

revoke execute on function public.use_lookup(int) from anon, public;
grant execute on function public.use_lookup(int) to authenticated;

-- iPhone sharing: each person's private share key (used by their Shortcut) and the list it adds to
create table if not exists public.share_keys (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  token text not null unique default replace(gen_random_uuid()::text, '-', ''),
  list_id uuid references public.lists(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.share_keys enable row level security;
drop policy if exists "share key own read" on public.share_keys;
create policy "share key own read" on public.share_keys for select using (user_id = auth.uid());
drop policy if exists "share key own create" on public.share_keys;
create policy "share key own create" on public.share_keys for insert with check (user_id = auth.uid());
drop policy if exists "share key own change" on public.share_keys;
create policy "share key own change" on public.share_keys for update
  using (user_id = auth.uid()) with check (user_id = auth.uid() and (list_id is null or public.is_member(list_id)));
drop policy if exists "share key own delete" on public.share_keys;
create policy "share key own delete" on public.share_keys for delete using (user_id = auth.uid());
grant select, insert, update, delete on public.share_keys to authenticated;

-- daily limit when the server adds on someone's behalf (server-only)
create or replace function public.use_lookup_for(u uuid, max_per_day int) returns int
language plpgsql security definer set search_path = public as $$
declare c int;
begin
  insert into lookup_usage (user_id, day, count) values (u, current_date, 1)
  on conflict (user_id, day) do update set count = lookup_usage.count + 1
  returning count into c;
  if c > max_per_day then raise exception 'daily limit reached'; end if;
  return c;
end $$;
revoke execute on function public.use_lookup_for(uuid, int) from anon, authenticated, public;
grant execute on function public.use_lookup_for(uuid, int) to service_role;
