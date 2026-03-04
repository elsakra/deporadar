-- DepoRadar Supabase Schema
-- Run this in the Supabase SQL Editor

-- profiles: extends Supabase Auth
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  firm_name text,
  stripe_customer_id text,
  subscription_status text default 'free' check (subscription_status in ('free','pro','team')),
  plan_type text default 'free',
  session_count int default 0,
  team_id uuid,
  attorney_affirmed boolean default false,
  created_at timestamptz default now()
);

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- sessions
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  matter text,
  deponent text,
  mode text default 'text' check (mode in ('text','audio')),
  started_at timestamptz default now(),
  ended_at timestamptz,
  retention_days int default 30,
  store_transcript boolean default true,
  notes text,
  digest_json jsonb,
  digest_markdown text,
  created_at timestamptz default now()
);

create index if not exists idx_sessions_user on sessions(user_id);

-- transcript_lines
create table if not exists transcript_lines (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade not null,
  seq int not null,
  speaker text,
  text text not null,
  role text default 'answering',
  created_at timestamptz default now()
);

create index if not exists idx_tlines_session on transcript_lines(session_id, seq);

-- bookmarks
create table if not exists bookmarks (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade not null,
  tag text not null,
  note text,
  transcript_line_id uuid references transcript_lines(id),
  excerpt_text text,
  created_at timestamptz default now()
);

create index if not exists idx_bookmarks_session on bookmarks(session_id);

-- radar_suggestions
create table if not exists radar_suggestions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade not null,
  payload jsonb not null,
  dismissed boolean default false,
  created_at timestamptz default now()
);

create index if not exists idx_radar_session on radar_suggestions(session_id);

-- RLS Policies

alter table profiles enable row level security;
alter table sessions enable row level security;
alter table transcript_lines enable row level security;
alter table bookmarks enable row level security;
alter table radar_suggestions enable row level security;

-- profiles: users can read/update their own
create policy "Users read own profile" on profiles for select using (auth.uid() = id);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);

-- sessions: users CRUD own sessions
create policy "Users read own sessions" on sessions for select using (auth.uid() = user_id);
create policy "Users create sessions" on sessions for insert with check (auth.uid() = user_id);
create policy "Users update own sessions" on sessions for update using (auth.uid() = user_id);
create policy "Users delete own sessions" on sessions for delete using (auth.uid() = user_id);

-- transcript_lines: via session ownership
create policy "Users read own lines" on transcript_lines for select
  using (exists (select 1 from sessions where sessions.id = transcript_lines.session_id and sessions.user_id = auth.uid()));
create policy "Users insert own lines" on transcript_lines for insert
  with check (exists (select 1 from sessions where sessions.id = transcript_lines.session_id and sessions.user_id = auth.uid()));

-- bookmarks: via session ownership
create policy "Users read own bookmarks" on bookmarks for select
  using (exists (select 1 from sessions where sessions.id = bookmarks.session_id and sessions.user_id = auth.uid()));
create policy "Users create bookmarks" on bookmarks for insert
  with check (exists (select 1 from sessions where sessions.id = bookmarks.session_id and sessions.user_id = auth.uid()));
create policy "Users delete own bookmarks" on bookmarks for delete
  using (exists (select 1 from sessions where sessions.id = bookmarks.session_id and sessions.user_id = auth.uid()));

-- radar_suggestions: via session ownership
create policy "Users read own suggestions" on radar_suggestions for select
  using (exists (select 1 from sessions where sessions.id = radar_suggestions.session_id and sessions.user_id = auth.uid()));
create policy "Users insert suggestions" on radar_suggestions for insert
  with check (exists (select 1 from sessions where sessions.id = radar_suggestions.session_id and sessions.user_id = auth.uid()));
create policy "Users update own suggestions" on radar_suggestions for update
  using (exists (select 1 from sessions where sessions.id = radar_suggestions.session_id and sessions.user_id = auth.uid()));
