# Daily Review Assistant — Plan

> An assistant that reviews your day. Every night it tells you what went well and what didn't. Every Sunday it gives you a plan to improve the coming week.

## Goal
Track habits, tasks, and a daily plan; an AI coach writes a nightly review and a Sunday weekly plan from that data.

## Core features (MVP)
1. **Week strip** — Mon–Sun with completion checks and a "tasks completed x/y" ring.
2. **Habits** — define habits with target (e.g. Water 2L, Exercise 30 min, Sleep 8h, Meditation, Reading); daily check-in with quantity.
3. **Today's plan** — time-blocked schedule (time, title, color category).
4. **Today's tasks** — checklist with times.
5. **Weekly goal** — one focus statement with progress bar.
6. **Quick notes** — short notes for the day.
7. **Nightly review** (~21:30) — Claude reads today's habits/tasks/plan/notes and writes: what went well, what didn't, one suggestion for tomorrow.
8. **Sunday weekly plan** — Claude reviews the week's stats and reviews, proposes next week's goal, habit adjustments, and a draft weekly plan.
9. **Stats** — habit streaks and completion rates.

## Later
- Optional evening mood/energy journal prompt.
- Calendar import to auto-fill the daily plan.
- Push notifications / email delivery of reviews.

## Stack
| Layer | Choice |
|---|---|
| App | Next.js + TypeScript + Tailwind + shadcn/ui (dark, warm-orange accents) |
| Auth/DB | Supabase (Auth, Postgres) |
| AI | Claude API (`claude-sonnet-5-5`) |
| Jobs | Vercel Cron (hourly, per-user local time) → nightly review / Sunday plan |
| Hosting | Vercel |

## Data model
- `habits(id, user_id, name, icon, target_value, unit, active)`
- `habit_logs(id, habit_id, date, value, done)`
- `tasks(id, user_id, date, time, title, done)`
- `plan_blocks(id, user_id, date, start_time, title, category)`
- `notes(id, user_id, date, content)`
- `weekly_goals(id, user_id, week_start, statement, progress)`
- `reviews(id, user_id, kind[daily|weekly], period_start, content_md)`

## Milestones
1. **Setup** — scaffold, dark theme, sidebar (Home, Weekly plan, Habits, Stats, Notes, Settings).
2. **Habits + tasks + plan** — CRUD and today view.
3. **Dashboard** — week strip, ring, widgets.
4. **Nightly review** — cron + prompt + review card/history.
5. **Weekly plan** — Sunday job + "accept plan" to pre-fill next week.
6. **Stats + polish** — streak charts, deploy.

## Risks
- Reviews are only as good as logged data → make check-ins fast (one tap) and the review tolerant of missing data.
