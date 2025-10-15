-- Create templates table
create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null,
  difficulty text not null,
  tags text[] default array[]::text[],
  preview_url text,
  github_url text,
  demo_url text,
  submitted_by uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create evaluations table
create table if not exists public.evaluations (
  id uuid primary key default gen_random_uuid(),
  template_id uuid references public.templates(id) on delete cascade not null,
  evaluator_id uuid references auth.users(id) on delete cascade not null,
  code_quality_score integer check (code_quality_score >= 1 and code_quality_score <= 10),
  design_score integer check (design_score >= 1 and design_score <= 10),
  functionality_score integer check (functionality_score >= 1 and functionality_score <= 10),
  documentation_score integer check (documentation_score >= 1 and documentation_score <= 10),
  performance_score integer check (performance_score >= 1 and performance_score <= 10),
  overall_score integer check (overall_score >= 1 and overall_score <= 10),
  feedback text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(template_id, evaluator_id)
);

-- Create profiles table for user management
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text default 'user' check (role in ('user', 'evaluator', 'admin')),
  bio text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.templates enable row level security;
alter table public.evaluations enable row level security;
alter table public.profiles enable row level security;

-- Templates policies
create policy "Anyone can view templates"
  on public.templates for select
  using (true);

create policy "Authenticated users can insert templates"
  on public.templates for insert
  with check (auth.uid() = submitted_by);

create policy "Users can update their own templates"
  on public.templates for update
  using (auth.uid() = submitted_by);

create policy "Users can delete their own templates"
  on public.templates for delete
  using (auth.uid() = submitted_by);

-- Evaluations policies
create policy "Anyone can view evaluations"
  on public.evaluations for select
  using (true);

create policy "Evaluators can insert evaluations"
  on public.evaluations for insert
  with check (
    auth.uid() = evaluator_id and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('evaluator', 'admin')
    )
  );

create policy "Evaluators can update their own evaluations"
  on public.evaluations for update
  using (
    auth.uid() = evaluator_id and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('evaluator', 'admin')
    )
  );

create policy "Evaluators can delete their own evaluations"
  on public.evaluations for delete
  using (
    auth.uid() = evaluator_id and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('evaluator', 'admin')
    )
  );

-- Profiles policies
create policy "Anyone can view profiles"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can delete their own profile"
  on public.profiles for delete
  using (auth.uid() = id);

-- Create indexes for better performance
create index if not exists templates_category_idx on public.templates(category);
create index if not exists templates_difficulty_idx on public.templates(difficulty);
create index if not exists templates_submitted_by_idx on public.templates(submitted_by);
create index if not exists evaluations_template_id_idx on public.evaluations(template_id);
create index if not exists evaluations_evaluator_id_idx on public.evaluations(evaluator_id);
