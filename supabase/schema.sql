-- Daily Review Assistant schema. Run in the Supabase SQL editor.

create table if not exists habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  icon text not null default '✅',
  target_value numeric not null default 1,
  unit text not null default 'x',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references habits(id) on delete cascade,
  date date not null,
  value numeric not null default 0,
  done boolean not null default false,
  unique (habit_id, date)
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null default current_date,
  time text,
  title text not null,
  done boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists plan_blocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null default current_date,
  start_time text not null,
  title text not null,
  category text not null default 'Trabajo'
);

create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null default current_date,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists weekly_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  statement text not null,
  progress numeric not null default 0, -- 0..1
  unique (user_id, week_start)
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('daily', 'weekly')),
  period_start date not null,
  content_md text not null,
  created_at timestamptz not null default now(),
  unique (user_id, kind, period_start)
);

create index if not exists habit_logs_date_idx on habit_logs (date);
create index if not exists tasks_user_date_idx on tasks (user_id, date);
create index if not exists plan_blocks_user_date_idx on plan_blocks (user_id, date);

alter table habits enable row level security;
alter table habit_logs enable row level security;
alter table tasks enable row level security;
alter table plan_blocks enable row level security;
alter table notes enable row level security;
alter table weekly_goals enable row level security;
alter table reviews enable row level security;

create policy "own rows" on habits for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own rows" on tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own rows" on plan_blocks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own rows" on notes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own rows" on weekly_goals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own rows" on reviews for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "logs via habit" on habit_logs for all
  using (exists (select 1 from habits where habits.id = habit_logs.habit_id and habits.user_id = auth.uid()))
  with check (exists (select 1 from habits where habits.id = habit_logs.habit_id and habits.user_id = auth.uid()));
