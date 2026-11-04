-- Wishlylist — database setup for Supabase
-- Paste this whole file into Supabase → SQL Editor → New query → Run.
-- Safe to run once on a new project.

create extension if not exists pgcrypto;

-- ───────────── Tables ─────────────

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.lists (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  kind text not null check (kind in ('private','family','friends','public')),
  created_at timestamptz not null default now()
);

create table if not exists public.list_members (
  list_id uuid not null references public.lists(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','member')),
  joined_at timestamptz not null default now(),
  primary key (list_id, user_id)
);

create table if not exists public.invites (
  token text primary key default replace(gen_random_uuid()::text, '-', ''),
  list_id uuid not null references public.lists(id) on delete cascade,
  created_by uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '14 days'
);

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references public.lists(id) on delete cascade,
  kind text not null check (kind in ('place','buy','service','movie','book')),
  type text not null default 'other',
  status text not null default 'want' check (status in ('want','visited')),
  name text not null check (char_length(name) between 1 and 200),
  details jsonb not null default '{}'::jsonb,
  image_path text,
  added_by uuid default auth.uid() references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists items_list_idx on public.items(list_id);
create index if not exists members_user_idx on public.list_members(user_id);
create index if not exists invites_list_idx on public.invites(list_id);

-- ───────────── Helper functions (bypass RLS safely) ─────────────

create or replace function public.is_member(l uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from list_members where list_id = l and user_id = auth.uid());
$$;

create or replace function public.is_list_owner(l uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from lists where id = l and owner_id = auth.uid());
$$;

create or replace function public.is_public_list(l uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from lists where id = l and kind = 'public');
$$;

create or replace function public.shares_list(u uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from list_members a join list_members b on a.list_id = b.list_id
    where a.user_id = auth.uid() and b.user_id = u);
$$;

-- ───────────── Triggers ─────────────

-- New sign-up → profile + a private list called "My list"
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, display_name)
  values (new.id, coalesce(nullif(trim(new.raw_user_meta_data->>'display_name'), ''), split_part(new.email, '@', 1)));
  insert into lists (owner_id, name, kind) values (new.id, 'My list', 'private');
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- New list → its owner becomes a member
create or replace function public.handle_new_list() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into list_members (list_id, user_id, role) values (new.id, new.owner_id, 'owner')
  on conflict do nothing;
  return new;
end $$;

drop trigger if exists on_list_created on public.lists;
create trigger on_list_created after insert on public.lists
  for each row execute function public.handle_new_list();

-- Owner can't change; a private list stays private (and a shared list can't become private)
create or replace function public.guard_list_update() returns trigger
language plpgsql as $$
begin
  if new.owner_id <> old.owner_id then raise exception 'owner cannot change'; end if;
  if (old.kind = 'private') <> (new.kind = 'private') then
    raise exception 'private lists cannot be shared, and shared lists cannot become private';
  end if;
  return new;
end $$;

drop trigger if exists on_list_update on public.lists;
create trigger on_list_update before update on public.lists
  for each row execute function public.guard_list_update();

-- Items: keep updated_at fresh, and never let anyone fake who added it
create or replace function public.touch_item() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  if tg_op = 'UPDATE' then new.added_by := old.added_by; new.created_at := old.created_at; end if;
  return new;
end $$;

drop trigger if exists on_item_write on public.items;
create trigger on_item_write before insert or update on public.items
  for each row execute function public.touch_item();

-- ───────────── Invite links ─────────────

-- Anyone holding the link can see what they're joining
create or replace function public.invite_info(t text)
returns table (list_id uuid, list_name text, list_kind text, owner_name text, valid boolean)
language sql stable security definer set search_path = public as $$
  select l.id, l.name, l.kind, coalesce(p.display_name, ''), (i.expires_at > now())
  from invites i join lists l on l.id = i.list_id
  left join profiles p on p.id = l.owner_id
  where i.token = t;
$$;

-- A signed-in user accepts the invite and joins the list
create or replace function public.accept_invite(t text) returns uuid
language plpgsql security definer set search_path = public as $$
declare l uuid;
begin
  if auth.uid() is null then raise exception 'sign in first'; end if;
  select i.list_id into l from invites i join lists x on x.id = i.list_id
   where i.token = t and i.expires_at > now() and x.kind <> 'private';
  if l is null then raise exception 'invite link is invalid or expired'; end if;
  insert into list_members (list_id, user_id, role) values (l, auth.uid(), 'member')
  on conflict do nothing;
  return l;
end $$;

-- ───────────── Row-level security ─────────────

alter table public.profiles     enable row level security;
alter table public.lists        enable row level security;
alter table public.list_members enable row level security;
alter table public.invites      enable row level security;
alter table public.items        enable row level security;

-- profiles: see yourself and people you share a list with
drop policy if exists "profiles read" on public.profiles;
create policy "profiles read" on public.profiles for select
  using (id = auth.uid() or public.shares_list(id));
drop policy if exists "profiles update self" on public.profiles;
create policy "profiles update self" on public.profiles for update
  using (id = auth.uid()) with check (id = auth.uid());

-- lists: members see their lists; anyone sees public lists; only the owner changes them
drop policy if exists "lists read" on public.lists;
create policy "lists read" on public.lists for select
  using (kind = 'public' or owner_id = auth.uid() or public.is_member(id));
drop policy if exists "lists create" on public.lists;
create policy "lists create" on public.lists for insert
  with check (owner_id = auth.uid());
drop policy if exists "lists update" on public.lists;
create policy "lists update" on public.lists for update
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop policy if exists "lists delete" on public.lists;
create policy "lists delete" on public.lists for delete
  using (owner_id = auth.uid());

-- members: members see each other; you can leave; the owner can remove people
drop policy if exists "members read" on public.list_members;
create policy "members read" on public.list_members for select
  using (public.is_member(list_id));
drop policy if exists "members leave or remove" on public.list_members;
create policy "members leave or remove" on public.list_members for delete
  using (role <> 'owner' and (user_id = auth.uid() or public.is_list_owner(list_id)));

-- invites: only the list owner creates, sees and deletes them; never for private lists
drop policy if exists "invites read" on public.invites;
create policy "invites read" on public.invites for select
  using (public.is_list_owner(list_id));
drop policy if exists "invites create" on public.invites;
create policy "invites create" on public.invites for insert
  with check (created_by = auth.uid() and public.is_list_owner(list_id)
              and not exists (select 1 from public.lists where id = list_id and kind = 'private'));
drop policy if exists "invites delete" on public.invites;
create policy "invites delete" on public.invites for delete
  using (public.is_list_owner(list_id));

-- items: members read and edit; anyone can read items of a public list
drop policy if exists "items read" on public.items;
create policy "items read" on public.items for select
  using (public.is_member(list_id) or public.is_public_list(list_id));
drop policy if exists "items create" on public.items;
create policy "items create" on public.items for insert
  with check (public.is_member(list_id) and added_by = auth.uid());
drop policy if exists "items update" on public.items;
create policy "items update" on public.items for update
  using (public.is_member(list_id)) with check (public.is_member(list_id));
drop policy if exists "items delete" on public.items;
create policy "items delete" on public.items for delete
  using (public.is_member(list_id));

-- ───────────── Permissions ─────────────

grant usage on schema public to anon, authenticated;
grant select on public.lists, public.items to anon;
grant select, insert, update, delete on public.lists, public.items, public.list_members, public.invites to authenticated;
grant select, update on public.profiles to authenticated;
grant execute on function public.invite_info(text) to anon, authenticated;
grant execute on function public.accept_invite(text) to authenticated;
revoke execute on function public.accept_invite(text) from anon, public;

-- ───────────── Photos (Storage) ─────────────

insert into storage.buckets (id, name, public)
values ('item-images', 'item-images', true)
on conflict (id) do nothing;

drop policy if exists "photos upload own folder" on storage.objects;
create policy "photos upload own folder" on storage.objects for insert to authenticated
  with check (bucket_id = 'item-images' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "photos change own" on storage.objects;
create policy "photos change own" on storage.objects for update to authenticated
  using (bucket_id = 'item-images' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "photos delete own" on storage.objects;
create policy "photos delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'item-images' and (storage.foldername(name))[1] = auth.uid()::text);

-- ───────────── Live updates (family sees changes instantly) ─────────────

do $$ begin
  alter publication supabase_realtime add table public.items;
exception when others then null;
end $$;
