# Principle-Centered Planner - Environment Setup

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: For server-side operations requiring higher privileges
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## How to Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once the project is created, go to **Settings** → **API**
3. Copy the **Project URL** → paste as `NEXT_PUBLIC_SUPABASE_URL`
4. Copy the **anon public** key → paste as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Database Setup

After setting up your Supabase project:

1. Go to the **SQL Editor** in your Supabase dashboard
2. Copy the contents of `supabase/schema.sql`
3. Run the SQL to create all tables and policies
