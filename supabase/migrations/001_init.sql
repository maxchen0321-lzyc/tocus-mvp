create extension if not exists pgcrypto;

create type stance_type as enum ('supporting', 'opposing');
create type stance_phase as enum ('initial', 'final');
create type comment_parent_type as enum ('topic', 'article');

create table if not exists topics (
  id text primary key,
  title text not null,
  tag text not null,
  happened_at date not null,
  summary text not null,
  context text not null,
  created_at timestamptz not null default now()
);

create table if not exists articles (
  id text primary key,
  topic_id text not null references topics(id) on delete cascade,
  stance stance_type not null,
  title text not null,
  content text not null,
  author text,
  created_at timestamptz not null default now()
);

create table if not exists collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null,
  anonymous_id text not null,
  topic_id text not null references topics(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists stances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null,
  anonymous_id text not null,
  topic_id text not null references topics(id) on delete cascade,
  value integer not null,
  phase stance_phase not null,
  created_at timestamptz not null default now()
);

create table if not exists comments (
  id uuid primary key,
  parent_type comment_parent_type not null,
  parent_id text not null,
  user_id uuid null,
  anonymous_id text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null,
  anonymous_id text not null,
  name text not null,
  topic_id text null,
  article_id text null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_collections_user on collections(user_id);
create index if not exists idx_collections_anon on collections(anonymous_id);
create index if not exists idx_stances_topic on stances(topic_id);
create index if not exists idx_comments_parent on comments(parent_type, parent_id);
create index if not exists idx_events_name on events(name);

alter table topics enable row level security;
alter table articles enable row level security;
alter table collections enable row level security;
alter table stances enable row level security;
alter table comments enable row level security;
alter table events enable row level security;

create policy "public read topics" on topics for select using (true);
create policy "public read articles" on articles for select using (true);

create policy "public insert collections" on collections for insert with check (true);
create policy "public read collections" on collections for select using (true);
create policy "public delete collections" on collections for delete using (true);

create policy "public insert stances" on stances for insert with check (true);
create policy "public read stances" on stances for select using (true);

create policy "public insert comments" on comments for insert with check (true);
create policy "public read comments" on comments for select using (true);

create policy "public insert events" on events for insert with check (true);
create policy "public read events" on events for select using (true);
