# Template Evaluation Academy - Complete System Specification
## Context Engineering Document v1.0

> **Purpose**: This document serves as a complete blueprint for replicating the Template Evaluation Academy system. It captures every aspect of the architecture, features, workflows, business rules, and implementation details.

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Architecture](#system-architecture)
3. [Database Schema](#database-schema)
4. [Feature Inventory](#feature-inventory)
5. [User Workflows](#user-workflows)
6. [Business Rules & Validation](#business-rules--validation)
7. [UI/UX Design System](#uiux-design-system)
8. [API & Data Layer](#api--data-layer)
9. [Security & Compliance](#security--compliance)
10. [Integration Specifications](#integration-specifications)
11. [Deployment & Operations](#deployment--operations)
12. [Component Library](#component-library)

---

## 1. Executive Summary

### 1.1 System Overview

The **Template Evaluation Academy** is a comprehensive full-stack web application built to facilitate template submission, evaluation, and learning. It combines:

- **Template Management**: Submit, version, and manage templates
- **Evaluation System**: Multi-criteria scoring with calibration and normalization
- **Gamification**: XP, levels, badges, achievements, and certifications
- **Marketplace**: Buy/sell templates with Stripe integration
- **Learning Platform**: Courses, quizzes, and certification paths
- **Social Features**: Comments, reactions, sharing, collections
- **Analytics**: Performance monitoring, user insights, revenue tracking
- **Developer Tools**: API keys, webhooks, and programmatic access

### 1.2 Technology Stack

**Frontend**:
- Next.js 15 (App Router)
- React 19
- TypeScript (strict mode)
- Tailwind CSS v4
- shadcn/ui components
- Radix UI primitives

**Backend**:
- Next.js Server Actions
- Next.js Route Handlers (API routes)
- Supabase (PostgreSQL + Auth + Realtime)

**Infrastructure**:
- Vercel (hosting & deployment)
- Supabase (database & auth)
- Stripe (payments)
- Upstash Redis (caching & rate limiting)
- Vercel Blob (file storage)

**Key Libraries**:
- `@supabase/ssr` - Supabase client with SSR support
- `@vercel/analytics` - Analytics tracking
- `recharts` - Data visualization
- `zod` - Schema validation
- `date-fns` - Date manipulation

### 1.3 Core Principles

1. **Server-First Architecture**: Prefer server components and server actions
2. **Type Safety**: Strict TypeScript with runtime validation
3. **Performance**: Optimized queries, caching, and lazy loading
4. **Accessibility**: WCAG 2.1 AA compliance minimum
5. **Security**: RLS policies, input validation, rate limiting
6. **User Experience**: Studio-grade UI inspired by Vercel/Linear/Supabase

---

## 2. System Architecture

### 2.1 Application Structure

\`\`\`
template-academy/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Auth-protected routes
│   ├── actions/                  # Server actions
│   ├── api/                      # API route handlers
│   ├── page.tsx                  # Dashboard (homepage)
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── ui/                       # shadcn/ui primitives
│   ├── dashboard/                # Dashboard-specific components
│   └── [feature]/                # Feature-specific components
├── lib/                          # Utility libraries
│   ├── supabase/                 # Supabase clients & utilities
│   ├── stripe/                   # Stripe utilities
│   └── utils.ts                  # General utilities
├── scripts/                      # Database scripts (SQL)
├── public/                       # Static assets
└── middleware.ts                 # Next.js middleware
\`\`\`

### 2.2 Data Flow Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  (React Components, Client-Side State, User Interactions)   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Server Components                       │
│         (Data Fetching, Initial Rendering, SEO)             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Server Actions                          │
│        (Mutations, Form Handling, Business Logic)           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Supabase Client                         │
│         (Database Queries, Auth, Realtime, RLS)             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                       │
│              (74 Tables, RLS Policies, Indexes)             │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### 2.3 Authentication Flow

\`\`\`
User Login Request
       ↓
Supabase Auth (Email/Password)
       ↓
JWT Token Generated
       ↓
Middleware Validates Token
       ↓
Session Refreshed (if needed)
       ↓
User Redirected to Dashboard
       ↓
RLS Policies Enforce Access Control
\`\`\`

**Implementation**:
- Server-side: `createServerClient()` from `@/lib/supabase/server`
- Client-side: `createBrowserClient()` from `@/lib/supabase/client`
- Middleware: Token refresh via `updateSession()` in `lib/supabase/middleware.ts`

### 2.4 Supabase Client Patterns

**Server Components & Actions**:
\`\`\`typescript
import { createServerClient } from "@/lib/supabase/server"

export async function ServerComponent() {
  const supabase = await createServerClient()
  const { data } = await supabase.from("templates").select("*")
  return <div>{/* render data */}</div>
}
\`\`\`

**Client Components**:
\`\`\`typescript
"use client"
import { createBrowserClient } from "@/lib/supabase/client"

export function ClientComponent() {
  const supabase = createBrowserClient()
  // Use supabase for client-side queries
}
\`\`\`

**Middleware**:
\`\`\`typescript
import { createServerClient } from "@supabase/ssr"
// Token refresh and session management
\`\`\`

---

## 3. Database Schema

### 3.1 Schema Overview

**Total Tables**: 74
**Key Relationships**: Foreign keys, RLS policies, indexes
**Database**: PostgreSQL (via Supabase)

### 3.2 Core Tables

#### 3.2.1 Users & Profiles

**`profiles`**
\`\`\`sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT DEFAULT 'user',
  experience_level TEXT,
  interests TEXT[],
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**Purpose**: Extended user profile information beyond Supabase auth.users

**Relationships**:
- `id` → `auth.users(id)` (one-to-one)
- Referenced by: templates, evaluations, comments, etc.

**RLS Policies**:
- Users can read all profiles
- Users can only update their own profile

---

#### 3.2.2 Templates

**`templates`**
\`\`\`sql
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  difficulty TEXT,
  tags TEXT[],
  submitted_by UUID REFERENCES profiles(id),
  demo_url TEXT,
  github_url TEXT,
  preview_url TEXT,
  current_version TEXT,
  version_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**Purpose**: Core template submissions

**Relationships**:
- `submitted_by` → `profiles(id)`
- Referenced by: evaluations, template_versions, template_analytics, etc.

**Indexes**:
- `idx_templates_submitted_by` on `submitted_by`
- `idx_templates_category` on `category`
- `idx_templates_created_at` on `created_at`

---

#### 3.2.3 Evaluations

**`evaluations`**
\`\`\`sql
CREATE TABLE evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES templates(id) ON DELETE CASCADE,
  evaluator_id UUID REFERENCES profiles(id),
  code_quality_score INTEGER CHECK (code_quality_score BETWEEN 1 AND 10),
  design_score INTEGER CHECK (design_score BETWEEN 1 AND 10),
  functionality_score INTEGER CHECK (functionality_score BETWEEN 1 AND 10),
  documentation_score INTEGER CHECK (documentation_score BETWEEN 1 AND 10),
  performance_score INTEGER CHECK (performance_score BETWEEN 1 AND 10),
  overall_score INTEGER CHECK (overall_score BETWEEN 1 AND 10),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**Purpose**: Multi-criteria template evaluations

**Scoring Criteria**:
1. Code Quality (1-10)
2. Design (1-10)
3. Functionality (1-10)
4. Documentation (1-10)
5. Performance (1-10)
6. Overall Score (1-10)

**Business Rules**:
- Evaluators cannot evaluate their own templates
- Scores must be justified if < 4 or > 9
- Minimum evaluation time: 5 minutes

---

### 3.3 Gamification Tables

#### 3.3.1 Leaderboard

**`leaderboard`**
\`\`\`sql
CREATE TABLE leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) UNIQUE,
  rank INTEGER,
  score INTEGER DEFAULT 0,
  badges INTEGER DEFAULT 0,
  completed_modules INTEGER DEFAULT 0,
  completion_rate INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**Purpose**: Track user rankings and progress

**Ranking Logic**:
- Score = XP from evaluations + template submissions + achievements
- Updated in real-time via triggers
- Supports time-based filtering (daily, weekly, monthly, all-time)

---

#### 3.3.2 Achievements

**`achievements`**
\`\`\`sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT,
  points_required INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**`user_achievements`**
\`\`\`sql
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  achievement_id UUID REFERENCES achievements(id),
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);
\`\`\`

**Achievement Categories**:
- Evaluation milestones (10, 50, 100 evaluations)
- Template submissions (5, 20, 50 templates)
- Community engagement (comments, reactions)
- Learning progress (courses completed)

---

#### 3.3.3 Certifications

**`certification_levels`**
\`\`\`sql
CREATE TABLE certification_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  badge_color TEXT,
  requirements_score INTEGER,
  requirements_evaluations INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**`user_certifications`**
\`\`\`sql
CREATE TABLE user_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  level_id UUID REFERENCES certification_levels(id),
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true
);
\`\`\`

**Certification Levels**:
1. **Bronze**: 100 score, 10 evaluations
2. **Silver**: 500 score, 50 evaluations
3. **Gold**: 1000 score, 100 evaluations
4. **Platinum**: 2500 score, 250 evaluations

---

### 3.4 Marketplace Tables

#### 3.4.1 Listings & Purchases

**`marketplace_listings`**
\`\`\`sql
CREATE TABLE marketplace_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES templates(id),
  seller_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  license_type TEXT,
  is_active BOOLEAN DEFAULT true,
  total_sales INTEGER DEFAULT 0,
  total_revenue_cents INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**`template_purchases`**
\`\`\`sql
CREATE TABLE template_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES marketplace_listings(id),
  buyer_id UUID REFERENCES profiles(id),
  seller_id UUID REFERENCES profiles(id),
  price_cents INTEGER NOT NULL,
  platform_fee_cents INTEGER,
  seller_payout_cents INTEGER,
  stripe_payment_intent_id TEXT,
  license_key TEXT UNIQUE,
  purchased_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**Revenue Split**:
- Platform fee: 15%
- Seller payout: 85%

---

### 3.5 Social Features Tables

#### 3.5.1 Comments & Reactions

**`comments`**
\`\`\`sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES templates(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  parent_id UUID REFERENCES comments(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**`comment_reactions`**
\`\`\`sql
CREATE TABLE comment_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  reaction_type TEXT, -- 'like', 'helpful', 'insightful'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comment_id, user_id, reaction_type)
);
\`\`\`

---

#### 3.5.2 Social Sharing

**`social_shares`**
\`\`\`sql
CREATE TABLE social_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES templates(id),
  user_id UUID REFERENCES profiles(id),
  platform TEXT, -- 'twitter', 'linkedin', 'facebook', 'reddit'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**`social_share_counts`** (Materialized View)
\`\`\`sql
CREATE MATERIALIZED VIEW social_share_counts AS
SELECT 
  template_id,
  COUNT(*) FILTER (WHERE platform = 'twitter') as twitter_shares,
  COUNT(*) FILTER (WHERE platform = 'linkedin') as linkedin_shares,
  COUNT(*) FILTER (WHERE platform = 'facebook') as facebook_shares,
  COUNT(*) FILTER (WHERE platform = 'reddit') as reddit_shares,
  COUNT(*) as total_shares
FROM social_shares
GROUP BY template_id;
\`\`\`

---

### 3.6 Analytics Tables

#### 3.6.1 Template Analytics

**`template_analytics`**
\`\`\`sql
CREATE TABLE template_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES templates(id),
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  generations INTEGER DEFAULT 0,
  favorites INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  avg_rating NUMERIC,
  UNIQUE(template_id, date)
);
\`\`\`

**Purpose**: Daily aggregated metrics per template

---

#### 3.6.2 Performance Monitoring

**`performance_metrics`**
\`\`\`sql
CREATE TABLE performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES templates(id),
  metric_type TEXT, -- 'lcp', 'fid', 'cls', 'ttfb'
  value NUMERIC,
  device_type TEXT, -- 'mobile', 'desktop'
  url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**`uptime_checks`**
\`\`\`sql
CREATE TABLE uptime_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES templates(id),
  checked_at TIMESTAMPTZ DEFAULT NOW(),
  is_up BOOLEAN,
  response_time INTEGER, -- milliseconds
  status_code INTEGER
);
\`\`\`

---

### 3.7 Learning Platform Tables

#### 3.7.1 Courses & Progress

**`training_courses`**
\`\`\`sql
CREATE TABLE training_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  duration_minutes INTEGER,
  order_index INTEGER,
  is_required BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**`user_course_progress`**
\`\`\`sql
CREATE TABLE user_course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  course_id UUID REFERENCES training_courses(id),
  completed BOOLEAN DEFAULT false,
  quiz_score INTEGER,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);
\`\`\`

---

### 3.8 Resources Library Tables

**`resources`**
\`\`\`sql
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  type TEXT, -- 'guide', 'tutorial', 'tool', 'template'
  category TEXT,
  difficulty TEXT, -- 'beginner', 'intermediate', 'advanced'
  tags TEXT[],
  url TEXT,
  author_id UUID REFERENCES profiles(id),
  duration INTEGER, -- minutes
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  bookmarks INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**`resource_likes`**
\`\`\`sql
CREATE TABLE resource_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(resource_id, user_id)
);
\`\`\`

**`resource_bookmarks`**
\`\`\`sql
CREATE TABLE resource_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(resource_id, user_id)
);
\`\`\`

---

### 3.9 Developer Tools Tables

#### 3.9.1 API Keys

**`api_keys`**
\`\`\`sql
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  key_name VARCHAR(255),
  api_key VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  rate_limit INTEGER DEFAULT 1000,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
);
\`\`\`

**`api_usage`**
\`\`\`sql
CREATE TABLE api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID REFERENCES api_keys(id),
  endpoint VARCHAR(255),
  method VARCHAR(10),
  status_code INTEGER,
  response_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

---

#### 3.9.2 Webhooks

**`webhooks`**
\`\`\`sql
CREATE TABLE webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  url VARCHAR(255) NOT NULL,
  events TEXT[], -- ['template.created', 'evaluation.completed']
  secret VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_triggered_at TIMESTAMPTZ
);
\`\`\`

**`webhook_deliveries`**
\`\`\`sql
CREATE TABLE webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id UUID REFERENCES webhooks(id),
  event_type VARCHAR(255),
  payload JSONB,
  status VARCHAR(50), -- 'pending', 'delivered', 'failed'
  attempts INTEGER DEFAULT 0,
  response_code INTEGER,
  response_body TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ
);
\`\`\`

---

### 3.10 Notifications

**`notifications`**
\`\`\`sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  type TEXT, -- 'evaluation', 'comment', 'achievement', 'system'
  title TEXT NOT NULL,
  message TEXT,
  link TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**Notification Types**:
- `evaluation`: New evaluation on your template
- `comment`: New comment or reply
- `achievement`: Achievement unlocked
- `system`: System announcements

---

### 3.11 Complete Table List

1. achievements
2. ai_suggested_tags
3. api_keys
4. api_usage
5. backups
6. certification_levels
7. collection_followers
8. collection_templates
9. collections
10. comment_reactions
11. comments
12. course_quizzes
13. creator_payouts
14. credit_transactions
15. credits
16. dispute_comments
17. dispute_reviewers
18. email_preferences
19. embed_views
20. evaluation_disputes
21. evaluation_reactions
22. evaluations
23. export_jobs
24. import_jobs
25. leaderboard
26. marketplace_listings
27. notifications
28. onboarding_progress
29. performance_alerts
30. performance_metrics
31. performance_summary (view)
32. practice_evaluations
33. profiles
34. recommendation_scores
35. reputation_history
36. resource_bookmarks
37. resource_likes
38. resources
39. revenue_analytics
40. social_share_counts (view)
41. social_shares
42. subscription_plans
43. subscriptions
44. template_analytics
45. template_licenses
46. template_purchases
47. template_quality_scores
48. template_similarities
49. template_test_summary (view)
50. template_tests
51. template_versions
52. template_votes
53. templates
54. training_courses
55. transactions
56. uptime_checks
57. user_achievements
58. user_certifications
59. user_cohorts
60. user_course_progress
61. user_events
62. user_interactions
63. user_preferences
64. user_recommendations
65. user_reputation
66. user_sessions
67. user_trust_scores
68. webhook_deliveries
69. webhooks
70. workspace_activity
71. workspace_invitations
72. workspace_members
73. workspace_templates
74. workspaces

---

## 4. Feature Inventory

### 4.1 Core Features

#### 4.1.1 Template Management
- **Submit Templates**: Form with title, description, category, tags, URLs
- **Version Control**: Track template versions with changelogs
- **Update Templates**: Edit existing templates
- **Delete Templates**: Soft delete with cascade handling
- **Template Gallery**: Browse, filter, search templates
- **Template Details**: View full template information
- **Template Comparison**: Side-by-side comparison of templates

#### 4.1.2 Evaluation System
- **Submit Evaluations**: Multi-criteria scoring (6 dimensions)
- **View Evaluations**: See all evaluations for a template
- **Evaluation Disputes**: Challenge unfair evaluations
- **Practice Evaluations**: Practice with AI feedback
- **Evaluator Calibration**: Benchmark evaluations for consistency
- **Score Normalization**: Statistical outlier detection

#### 4.1.3 User Profiles
- **Profile Creation**: Display name, avatar, bio, interests
- **Profile Viewing**: Public profile pages
- **Profile Editing**: Update profile information
- **Experience Levels**: Beginner, Intermediate, Advanced, Expert
- **Reputation System**: Track user reputation scores

#### 4.1.4 Dashboard
- **Overview Stats**: Templates, evaluations, users count
- **Recent Activity**: Latest templates and evaluations
- **Quick Actions**: Submit template, evaluate, view profile
- **Notifications**: Real-time notification dropdown
- **Progress Tracking**: XP, level, next achievement

### 4.2 Gamification Features

#### 4.2.1 Leaderboard System
- **Global Leaderboard**: All-time rankings
- **Time-Based Leaderboards**: Daily, weekly, monthly
- **Category Leaderboards**: By template category
- **Real-Time Updates**: Live rank changes
- **User Profiles**: Click to view user details

#### 4.2.2 Achievements & Badges
- **Achievement Categories**: Evaluation, submission, community
- **Badge Display**: Visual badges on profiles
- **Achievement Notifications**: Real-time unlock notifications
- **Progress Tracking**: See progress toward next achievement

#### 4.2.3 Certifications
- **Certification Levels**: Bronze, Silver, Gold, Platinum
- **Certificate Generation**: PDF certificates with unique IDs
- **Certificate Verification**: Public verification page
- **Certificate Expiration**: Renewable certifications

### 4.3 Marketplace Features

#### 4.3.1 Template Marketplace
- **Browse Listings**: Filter by price, category, rating
- **Purchase Templates**: Stripe checkout integration
- **License Management**: Unique license keys per purchase
- **Seller Dashboard**: View sales, revenue, analytics

#### 4.3.2 Payments & Payouts
- **Stripe Integration**: Secure payment processing
- **Revenue Split**: 85% seller, 15% platform
- **Payout Management**: Automated seller payouts
- **Transaction History**: View all purchases and sales

### 4.4 Social Features

#### 4.4.1 Comments & Discussions
- **Comment on Templates**: Threaded discussions
- **Reply to Comments**: Nested comment threads
- **Comment Reactions**: Like, helpful, insightful
- **Comment Moderation**: Flag inappropriate content

#### 4.4.2 Social Sharing
- **Share Templates**: Twitter, LinkedIn, Facebook, Reddit
- **Share Tracking**: Count shares per platform
- **Social Previews**: Open Graph meta tags
- **Embed Templates**: Embeddable template previews

#### 4.4.3 Collections
- **Create Collections**: Curated template collections
- **Add to Collection**: Save templates to collections
- **Follow Collections**: Subscribe to collection updates
- **Public/Private Collections**: Control visibility

### 4.5 Learning Platform

#### 4.5.1 Training Courses
- **Course Library**: Browse available courses
- **Course Content**: Rich text lessons
- **Course Quizzes**: Test knowledge
- **Progress Tracking**: Track completion status
- **Certificates**: Earn certificates upon completion

#### 4.5.2 Practice Evaluations
- **Practice Mode**: Evaluate sample templates
- **AI Feedback**: Get feedback on evaluation quality
- **Score Comparison**: Compare to expert evaluations
- **Skill Improvement**: Track evaluation accuracy over time

### 4.6 Resources Library

#### 4.6.1 Resource Types
- **Guides**: Step-by-step tutorials
- **Tutorials**: Video and text tutorials
- **Tools**: Useful development tools
- **Templates**: Starter templates

#### 4.6.2 Resource Features
- **Browse Resources**: Filter by type, category, difficulty
- **Like Resources**: Upvote helpful resources
- **Bookmark Resources**: Save for later
- **View Count**: Track resource popularity
- **Featured Resources**: Highlighted top resources

### 4.7 Analytics & Insights

#### 4.7.1 Template Analytics
- **View Tracking**: Daily view counts
- **Generation Tracking**: Track template usage
- **Rating Analytics**: Average ratings over time
- **Share Analytics**: Social share metrics

#### 4.7.2 Performance Monitoring
- **Core Web Vitals**: LCP, FID, CLS, TTFB
- **Uptime Monitoring**: Check template availability
- **Performance Alerts**: Notify on performance issues
- **Device Breakdown**: Mobile vs desktop metrics

#### 4.7.3 User Analytics
- **User Events**: Track user actions
- **Session Tracking**: Monitor user sessions
- **Cohort Analysis**: User retention by cohort
- **Revenue Analytics**: MRR, churn, LTV

### 4.8 Developer Tools

#### 4.8.1 API Access
- **API Keys**: Generate and manage API keys
- **API Documentation**: Interactive API docs
- **Rate Limiting**: 1000 requests/hour default
- **Usage Tracking**: Monitor API usage

#### 4.8.2 Webhooks
- **Webhook Configuration**: Set up webhook endpoints
- **Event Subscriptions**: Subscribe to events
- **Webhook Logs**: View delivery history
- **Retry Logic**: Automatic retry on failure

### 4.9 Admin Features

#### 4.9.1 Content Moderation
- **Review Flagged Content**: Moderate comments, templates
- **User Management**: Ban/suspend users
- **Dispute Resolution**: Resolve evaluation disputes
- **System Announcements**: Send notifications to all users

#### 4.9.2 System Management
- **Database Backups**: Automated backups
- **Import/Export**: Bulk template operations
- **Analytics Dashboard**: System-wide metrics
- **Performance Monitoring**: System health checks

---

## 5. User Workflows

### 5.1 New User Onboarding

\`\`\`
1. User signs up (email/password)
   ↓
2. Email verification sent
   ↓
3. User verifies email
   ↓
4. Redirect to onboarding flow
   ↓
5. Complete profile (name, avatar, interests)
   ↓
6. Select experience level
   ↓
7. Choose interests/categories
   ↓
8. View welcome dashboard
   ↓
9. Suggested first actions:
   - Browse templates
   - Take first course
   - Submit first template
\`\`\`

**Implementation**:
- `onboarding_progress` table tracks completion
- `profiles.onboarding_completed` flag
- Redirect logic in middleware

---

### 5.2 Template Submission Workflow

\`\`\`
1. User clicks "Submit Template"
   ↓
2. Fill out submission form:
   - Title (required)
   - Description (required)
   - Category (required)
   - Difficulty (required)
   - Tags (optional)
   - Demo URL (optional)
   - GitHub URL (optional)
   - Preview URL (optional)
   ↓
3. Automated quality checks:
   - Broken link detection
   - Security scanning
   - Code quality analysis
   ↓
4. Submit for review
   ↓
5. Template enters evaluation queue
   ↓
6. Notification sent to evaluators
   ↓
7. Template appears in browse gallery
\`\`\`

**Quality Gates**:
- Required fields validation
- URL format validation
- Duplicate detection
- Security scanning (no exposed secrets)

---

### 5.3 Evaluation Workflow

\`\`\`
1. Evaluator browses templates
   ↓
2. Select template to evaluate
   ↓
3. Review template:
   - View demo
   - Check code (GitHub)
   - Read documentation
   ↓
4. Fill evaluation form:
   - Code Quality (1-10)
   - Design (1-10)
   - Functionality (1-10)
   - Documentation (1-10)
   - Performance (1-10)
   - Overall Score (1-10)
   - Written Feedback
   ↓
5. Justification required if:
   - Any score < 4
   - Any score > 9
   ↓
6. Submit evaluation
   ↓
7. Score normalization applied
   ↓
8. Template author notified
   ↓
9. Evaluator earns XP
\`\`\`

**Business Rules**:
- Cannot evaluate own templates
- Minimum 5 minutes evaluation time
- Blind evaluation (can't see other scores)
- Inter-rater reliability checks

---

### 5.4 Marketplace Purchase Workflow

\`\`\`
1. User browses marketplace
   ↓
2. Select template listing
   ↓
3. View listing details:
   - Price
   - License type
   - Preview
   - Reviews
   ↓
4. Click "Purchase"
   ↓
5. Redirect to Stripe Checkout
   ↓
6. Complete payment
   ↓
7. Stripe webhook confirms payment
   ↓
8. License key generated
   ↓
9. Purchase recorded in database
   ↓
10. Buyer receives:
    - Email with license key
    - Access to template files
    - Receipt
    ↓
11. Seller receives:
    - Notification of sale
    - 85% payout (scheduled)
\`\`\`

**Payment Flow**:
- Stripe Checkout Session
- Webhook: `checkout.session.completed`
- License key generation
- Automated payout scheduling

---

### 5.5 Certification Workflow

\`\`\`
1. User completes required courses
   ↓
2. User accumulates required XP
   ↓
3. User completes required evaluations
   ↓
4. System checks certification eligibility
   ↓
5. Certification unlocked notification
   ↓
6. User claims certification
   ↓
7. Certificate PDF generated:
   - User name
   - Certification level
   - Unique certificate ID
   - Issue date
   - Expiration date (if applicable)
   ↓
8. Certificate available for download
   ↓
9. Public verification page created
\`\`\`

**Certification Requirements**:
- **Bronze**: 100 XP, 10 evaluations
- **Silver**: 500 XP, 50 evaluations
- **Gold**: 1000 XP, 100 evaluations
- **Platinum**: 2500 XP, 250 evaluations

---

### 5.6 Dispute Resolution Workflow

\`\`\`
1. Template author disputes evaluation
   ↓
2. Fill dispute form:
   - Reason for dispute
   - Evidence (URLs, screenshots)
   - Explanation
   ↓
3. Dispute enters review queue
   ↓
4. 3 independent reviewers assigned
   ↓
5. Each reviewer votes:
   - Uphold evaluation
   - Overturn evaluation
   - Partial adjustment
   ↓
6. Majority vote determines outcome
   ↓
7. If overturned:
   - Evaluation removed/adjusted
   - Evaluator notified
   - Author notified
   ↓
8. If upheld:
   - Evaluation stands
   - Author notified
   ↓
9. Dispute closed
\`\`\`

**Dispute Rules**:
- 7-day window to dispute
- Maximum 3 disputes per template
- Reviewers must have 500+ XP
- Reviewers cannot be involved parties

---

## 6. Business Rules & Validation

### 6.1 Evaluation Standards & Consistency Rules

#### 6.1.1 Calibration Requirements
- **Mandatory calibration sessions** for new evaluators
- Must evaluate 5 benchmark templates before evaluating real submissions
- Benchmark templates have known "correct" scores
- Must achieve 85% agreement with benchmark scores

#### 6.1.2 Inter-Rater Reliability
- Minimum 85% agreement between evaluators
- If agreement < 85%, trigger re-evaluation
- Statistical analysis of evaluator consistency
- Evaluators with low consistency receive training

#### 6.1.3 Blind Evaluation System
- Evaluators don't see other scores until submission
- Prevents anchoring bias
- Scores revealed after all evaluations complete

#### 6.1.4 Score Justification
- Required for scores < 4 or > 9
- Minimum 50 characters explanation
- Reviewed by moderators for quality

#### 6.1.5 Conflict of Interest
- Cannot evaluate own templates
- Cannot evaluate templates from same organization
- Must declare conflicts before evaluation

#### 6.1.6 Minimum Evaluation Time
- 5 minutes minimum per template
- Tracked via client-side timer
- Submissions under 5 minutes flagged for review

#### 6.1.7 Score Normalization
- Z-score normalization across evaluators
- Prevents harsh/lenient evaluator bias
- Adjusted scores displayed to users

**Implementation**:
\`\`\`typescript
// Score normalization function
function normalizeScore(
  rawScore: number,
  evaluatorMean: number,
  evaluatorStdDev: number,
  globalMean: number,
  globalStdDev: number
): number {
  const zScore = (rawScore - evaluatorMean) / evaluatorStdDev
  return Math.round(zScore * globalStdDev + globalMean)
}
\`\`\`

---

### 6.2 Template Submission Quality Gates

#### 6.2.1 Automated Pre-Submission Checks
- **Broken link detection**: Verify all URLs are accessible
- **Missing documentation**: Ensure README exists
- **Security vulnerabilities**: Scan for exposed secrets
- **Code quality**: Run linting and formatting checks
- **Dependency audit**: Check for vulnerable dependencies

#### 6.2.2 Required Components
- README.md with:
  - Project description
  - Setup instructions
  - Usage examples
  - Dependencies list
- LICENSE file
- Demo URL (live preview)
- GitHub repository (public)

#### 6.2.3 Code Quality Thresholds
- ESLint: 0 errors, < 10 warnings
- Prettier: All files formatted
- Test coverage: > 50% (if tests present)

#### 6.2.4 Accessibility Compliance
- WCAG 2.1 AA minimum
- Lighthouse Accessibility score > 90
- Keyboard navigation support
- Screen reader compatibility

#### 6.2.5 Performance Benchmarks
- Lighthouse Performance > 80
- Lighthouse Accessibility > 90
- First Contentful Paint < 2s
- Time to Interactive < 3s

#### 6.2.6 Security Scanning
- No exposed API keys
- No vulnerable dependencies (critical/high)
- No hardcoded secrets
- HTTPS for all external resources

#### 6.2.7 Plagiarism Detection
- Code similarity analysis
- Attribution verification
- Originality score > 70%

**Implementation**:
\`\`\`typescript
// Quality gate checks
async function runQualityGates(template: Template) {
  const checks = await Promise.all([
    checkBrokenLinks(template.urls),
    scanSecurity(template.github_url),
    checkAccessibility(template.demo_url),
    checkPerformance(template.demo_url),
    detectPlagiarism(template.github_url),
  ])
  
  return {
    passed: checks.every(c => c.passed),
    checks,
  }
}
\`\`\`

---

### 6.3 Community & Content Moderation Rules

#### 6.3.1 Code of Conduct
- **Tier 1 Violations** (Warning):
  - Minor rudeness
  - Off-topic comments
  - Spam (first offense)
  
- **Tier 2 Violations** (Temporary Ban):
  - Repeated Tier 1 violations
  - Harassment
  - Spam (repeated)
  
- **Tier 3 Violations** (Permanent Ban):
  - Hate speech
  - Threats
  - Doxxing
  - Illegal content

#### 6.3.2 Comment Moderation
- **Constructive feedback only**
- No personal attacks
- No profanity
- No promotional spam
- Must be relevant to template

#### 6.3.3 Spam Detection
- Rate limiting: 10 comments/hour
- Content analysis for spam patterns
- Link spam detection
- Duplicate comment detection

#### 6.3.4 Appeal Process
- 14-day window to appeal
- Submit appeal form with explanation
- Reviewed by 2 independent moderators
- Decision final after appeal

#### 6.3.5 Attribution Requirements
- Credit original authors for derivative works
- Link to original source
- Specify modifications made
- Respect original license

#### 6.3.6 Licensing Compliance
- Verify license compatibility
- Ensure license file present
- Check third-party asset licenses
- Validate commercial use permissions

#### 6.3.7 DMCA Takedown
- Submit DMCA notice
- Content removed within 24 hours
- Counter-notice process available
- Restore if counter-notice valid

---

### 6.4 Quality Assurance & Maintenance Rules

#### 6.4.1 Quarterly Re-Evaluation
- Templates re-evaluated every 3 months
- Check for outdated dependencies
- Verify demo URL still works
- Update quality scores

#### 6.4.2 Deprecation Warnings
- Dependencies > 6 months old flagged
- Warning displayed on template page
- Author notified to update
- Template hidden if > 12 months old

#### 6.4.3 Breaking Change Notifications
- Authors notified of breaking changes
- 30-day grace period to update
- Template marked "outdated" after grace period

#### 6.4.4 Version Compatibility Matrix
- Track compatible framework versions
- Display compatibility badges
- Warn users of incompatibilities

#### 6.4.5 Automated Testing Requirements
- Unit tests (recommended)
- Integration tests (recommended)
- E2E tests (optional)
- CI/CD pipeline (recommended)

#### 6.4.6 Documentation Freshness
- Last updated date displayed
- Flag if > 3 months old
- Author notified to review

#### 6.4.7 Response Time SLAs
- Critical issues: 24 hours
- High priority: 48 hours
- Medium priority: 7 days
- Low priority: 30 days

---

### 6.5 Scoring Calibration & Normalization

#### 6.5.1 Statistical Outlier Detection
- Flag scores > 2 standard deviations from mean
- Require re-evaluation if outlier
- Track evaluator consistency

#### 6.5.2 Evaluator Performance Metrics
- **Consistency score**: Agreement with other evaluators
- **Completion rate**: % of evaluations completed
- **Feedback quality**: Helpfulness ratings

#### 6.5.3 Mandatory Re-Evaluation
- Triggered when scores diverge significantly
- Requires 3rd independent evaluation
- Median score used if still divergent

#### 6.5.4 Weighted Scoring
- Evaluators with higher consistency get higher weight
- Track record influences score weight
- New evaluators have lower weight

#### 6.5.5 Benchmark Template Re-Evaluation
- Benchmark templates re-evaluated quarterly
- Ensures standards remain consistent
- Adjusts for grade inflation/deflation

#### 6.5.6 Score Distribution Analysis
- Monitor for grade inflation
- Target distribution: Normal curve
- Adjust if distribution skewed

---

### 6.6 Data Privacy & Security Rules

#### 6.6.1 PII Scrubbing
- Remove PII from submissions
- Sanitize comments and feedback
- Anonymize analytics data

#### 6.6.2 GDPR/CCPA Compliance
- Right to access data
- Right to deletion
- Right to portability
- Consent management

#### 6.6.3 Secure Credential Handling
- No hardcoded secrets
- Environment variables only
- Secrets rotation policy

#### 6.6.4 Rate Limiting
- API: 1000 requests/hour
- Comments: 10/hour
- Evaluations: 20/day
- Template submissions: 5/day

#### 6.6.5 Audit Logging
- All admin actions logged
- User actions logged (anonymized)
- Logs retained for 2 years

#### 6.6.6 Data Retention
- Evaluations: 2 years
- Comments: Indefinite (unless deleted)
- Analytics: 1 year
- Logs: 2 years

#### 6.6.7 Right to Deletion
- User can request account deletion
- Data deleted within 30 days
- Anonymize instead of delete for integrity

---

### 6.7 Intellectual Property & Attribution

#### 6.7.1 Clear Licensing Requirements
- Must specify license (MIT, Apache, GPL, etc.)
- License file required
- Commercial use disclosure

#### 6.7.2 Attribution Chain Tracking
- Track forks and derivatives
- Display attribution chain
- Link to original source

#### 6.7.3 Copyright Verification
- Verify author owns copyright
- Check for plagiarism
- Validate third-party assets

#### 6.7.4 Open Source License Compatibility
- Check license compatibility
- Warn of incompatible licenses
- Suggest compatible alternatives

#### 6.7.5 Commercial Use Disclosure
- Clearly state if commercial use allowed
- Display license restrictions
- Link to license details

#### 6.7.6 Third-Party Asset Licensing
- Verify all assets licensed
- Check image/font licenses
- Validate icon library licenses

---

### 6.8 Performance & Scalability Standards

#### 6.8.1 Maximum Bundle Size
- Initial load < 500KB
- Code splitting required
- Lazy loading for images

#### 6.8.2 Time to Interactive
- TTI < 3 seconds on 3G
- Measured via Lighthouse
- Fails if > 5 seconds

#### 6.8.3 Core Web Vitals Thresholds
- LCP < 2.5s (good)
- FID < 100ms (good)
- CLS < 0.1 (good)

#### 6.8.4 Database Query Optimization
- No N+1 queries
- Use indexes for common queries
- Limit result sets

#### 6.8.5 CDN Usage
- Static assets served via CDN
- Images optimized and cached
- Fonts preloaded

#### 6.8.6 Lazy Loading
- Images lazy loaded
- Components code-split
- Routes lazy loaded

#### 6.8.7 Caching Strategy
- Static assets: 1 year
- API responses: 5 minutes
- Database queries: 1 minute

---

### 6.9 Accessibility & Inclusivity Rules

#### 6.9.1 Keyboard Navigation
- All interactive elements accessible
- Logical tab order
- Skip links provided

#### 6.9.2 Screen Reader Compatibility
- Semantic HTML
- ARIA labels where needed
- Alt text for images

#### 6.9.3 Color Contrast Ratios
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- Measured via automated tools

#### 6.9.4 Alternative Text
- All images have alt text
- Decorative images: empty alt
- Complex images: detailed description

#### 6.9.5 Focus Indicators
- Visible focus indicators
- High contrast focus rings
- Never remove focus styles

#### 6.9.6 No Color-Only Information
- Use icons + color
- Patterns for charts
- Text labels for status

#### 6.9.7 Internationalization Support
- i18n ready
- RTL support
- Locale-aware formatting

---

### 6.10 Documentation & Support Standards

#### 6.10.1 Comprehensive README
- Project description
- Quick start guide
- Installation instructions
- Usage examples
- API documentation

#### 6.10.2 API Documentation
- Endpoint descriptions
- Request/response examples
- Error codes
- Rate limits

#### 6.10.3 Troubleshooting Section
- Common issues
- Solutions
- FAQ
- Support contact

#### 6.10.4 Contributing Guidelines
- How to contribute
- Code style guide
- Pull request process
- Issue templates

#### 6.10.5 Changelog Maintenance
- Semantic versioning
- Breaking changes highlighted
- Migration guides
- Release notes

#### 6.10.6 Architecture Decision Records
- Document major decisions
- Explain rationale
- Track alternatives considered

#### 6.10.7 Video Tutorials
- Setup walkthrough
- Feature demonstrations
- Best practices
- Common pitfalls

---

## 7. UI/UX Design System

### 7.1 Design Philosophy

**Inspiration**: Vercel, Linear, Supabase, Braintrust
**Aesthetic**: Studio-grade, minimal, professional
**Principles**:
- Clarity over cleverness
- Consistency over creativity
- Performance over polish
- Accessibility always

### 7.2 Color System

#### 7.2.1 Light Theme

\`\`\`css
:root {
  /* Backgrounds */
  --background: hsl(0 0% 100%);           /* Pure white */
  --card: hsl(0 0% 100%);                 /* White cards */
  --popover: hsl(0 0% 100%);              /* White popovers */
  
  /* Foregrounds */
  --foreground: hsl(222.2 84% 4.9%);      /* Near black */
  --card-foreground: 23 23 23;            /* Dark gray */
  --muted-foreground: 115 115 115;        /* Medium gray */
  
  /* Primary (Blue) */
  --primary: hsl(221.2 83.2% 53.3%);      /* Vercel blue */
  --primary-foreground: 255 255 255;      /* White text */
  
  /* Secondary (Light gray) */
  --secondary: hsl(210 40% 96%);          /* Very light gray */
  --secondary-foreground: 23 23 23;       /* Dark text */
  
  /* Muted (Light gray) */
  --muted: hsl(210 40% 96%);              /* Very light gray */
  
  /* Accent (Light gray) */
  --accent: hsl(210 40% 96%);             /* Very light gray */
  --accent-foreground: 23 23 23;          /* Dark text */
  
  /* Destructive (Red) */
  --destructive: hsl(0 84.2% 60.2%);      /* Red */
  --destructive-foreground: 255 255 255;  /* White text */
  
  /* Borders */
  --border: hsl(214.3 31.8% 91.4%);       /* Light gray border */
  --input: hsl(214.3 31.8% 91.4%);        /* Light gray input */
  --ring: hsl(221.2 83.2% 53.3%);         /* Blue focus ring */
  
  /* Charts */
  --chart-1: hsl(221.2 83.2% 53.3%);      /* Blue */
  --chart-2: hsl(212 95% 68%);            /* Light blue */
  --chart-3: hsl(216 92% 60%);            /* Medium blue */
  --chart-4: hsl(210 98% 78%);            /* Lighter blue */
  --chart-5: hsl(212 97% 87%);            /* Lightest blue */
}
\`\`\`

#### 7.2.2 Dark Theme

\`\`\`css
.dark {
  /* Backgrounds */
  --background: 0 0 0;                    /* Pure black */
  --card: 10 10 10;                       /* Near black */
  --popover: 10 10 10;                    /* Near black */
  
  /* Foregrounds */
  --foreground: 250 250 250;              /* Near white */
  --card-foreground: 250 250 250;         /* Near white */
  --muted-foreground: 163 163 163;        /* Medium gray */
  
  /* Primary (White) */
  --primary: 250 250 250;                 /* Near white */
  --primary-foreground: 0 0 0;            /* Black text */
  
  /* Secondary (Dark gray) */
  --secondary: 23 23 23;                  /* Dark gray */
  --secondary-foreground: 250 250 250;    /* Light text */
  
  /* Muted (Dark gray) */
  --muted: 23 23 23;                      /* Dark gray */
  
  /* Accent (Dark gray) */
  --accent: 23 23 23;                     /* Dark gray */
  --accent-foreground: 250 250 250;       /* Light text */
  
  /* Destructive (Red) */
  --destructive: 248 113 113;             /* Light red */
  --destructive-foreground: 250 250 250;  /* Light text */
  
  /* Borders */
  --border: 39 39 42;                     /* Dark gray border */
  --input: 39 39 42;                      /* Dark gray input */
  --ring: 212 212 216;                    /* Light gray ring */
  
  /* Charts */
  --chart-1: 96 165 250;                  /* Blue */
  --chart-2: 168 85 247;                  /* Purple */
  --chart-3: 74 222 128;                  /* Green */
  --chart-4: 251 191 36;                  /* Yellow */
  --chart-5: 248 113 113;                 /* Red */
}
\`\`\`

### 7.3 Typography

#### 7.3.1 Font Families

\`\`\`typescript
// layout.tsx
import { Inter, JetBrains_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})
\`\`\`

**Usage**:
- `font-sans`: Body text, headings, UI elements (Inter)
- `font-mono`: Code blocks, technical content (JetBrains Mono)

#### 7.3.2 Type Scale

\`\`\`css
/* Headings */
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }    /* 36px */
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }  /* 30px */
.text-2xl { font-size: 1.5rem; line-height: 2rem; }       /* 24px */
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }    /* 20px */
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }   /* 18px */

/* Body */
.text-base { font-size: 1rem; line-height: 1.5rem; }      /* 16px */
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }   /* 14px */
.text-xs { font-size: 0.75rem; line-height: 1rem; }       /* 12px */
\`\`\`

#### 7.3.3 Font Weights

\`\`\`css
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
\`\`\`

#### 7.3.4 Line Heights

\`\`\`css
.leading-tight { line-height: 1.25; }
.leading-snug { line-height: 1.375; }
.leading-normal { line-height: 1.5; }
.leading-relaxed { line-height: 1.625; }
.leading-loose { line-height: 2; }
\`\`\`

**Best Practices**:
- Body text: `leading-relaxed` (1.625)
- Headings: `leading-tight` (1.25)
- UI elements: `leading-normal` (1.5)

### 7.4 Spacing System

**Tailwind Spacing Scale** (based on 4px):

\`\`\`
0   = 0px
1   = 4px
2   = 8px
3   = 12px
4   = 16px
5   = 20px
6   = 24px
8   = 32px
10  = 40px
12  = 48px
16  = 64px
20  = 80px
24  = 96px
32  = 128px
\`\`\`

**Common Patterns**:
- Card padding: `p-6` (24px)
- Section spacing: `space-y-8` (32px)
- Button padding: `px-4 py-2` (16px/8px)
- Input padding: `px-3 py-2` (12px/8px)

### 7.5 Layout Patterns

#### 7.5.1 Container

\`\`\`tsx
<div className="container mx-auto px-4 max-w-7xl">
  {/* Content */}
</div>
\`\`\`

**Breakpoints**:
- `max-w-7xl`: 1280px (default)
- `max-w-6xl`: 1152px
- `max-w-5xl`: 1024px

#### 7.5.2 Grid Layouts

\`\`\`tsx
{/* 3-column grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>

{/* Responsive grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
\`\`\`

#### 7.5.3 Flexbox Layouts

\`\`\`tsx
{/* Horizontal stack */}
<div className="flex items-center gap-4">
  <Icon />
  <span>Label</span>
</div>

{/* Vertical stack */}
<div className="flex flex-col gap-2">
  <h3>Title</h3>
  <p>Description</p>
</div>

{/* Space between */}
<div className="flex items-center justify-between">
  <span>Left</span>
  <span>Right</span>
</div>
\`\`\`

### 7.6 Component Patterns

#### 7.6.1 Cards

\`\`\`tsx
<Card className="hover-lift">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
  <CardFooter>
    {/* Actions */}
  </CardFooter>
</Card>
\`\`\`

#### 7.6.2 Buttons

\`\`\`tsx
{/* Primary */}
<Button>Primary Action</Button>

{/* Secondary */}
<Button variant="secondary">Secondary Action</Button>

{/* Outline */}
<Button variant="outline">Outline Action</Button>

{/* Ghost */}
<Button variant="ghost">Ghost Action</Button>

{/* Destructive */}
<Button variant="destructive">Delete</Button>

{/* With icon */}
<Button>
  <Icon className="mr-2 h-4 w-4" />
  Action
</Button>
\`\`\`

#### 7.6.3 Forms

\`\`\`tsx
<form className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="name">Name</Label>
    <Input id="name" placeholder="Enter name" />
  </div>
  
  <div className="space-y-2">
    <Label htmlFor="email">Email</Label>
    <Input id="email" type="email" placeholder="Enter email" />
  </div>
  
  <Button type="submit">Submit</Button>
</form>
\`\`\`

### 7.7 Responsive Design

**Breakpoints**:
\`\`\`css
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
\`\`\`

**Mobile-First Approach**:
\`\`\`tsx
<div className="
  text-sm md:text-base lg:text-lg
  p-4 md:p-6 lg:p-8
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
">
  {/* Content */}
</div>
\`\`\`

### 7.8 Animation & Transitions

\`\`\`css
/* Hover lift */
.hover-lift {
  @apply transition-transform duration-200 hover:-translate-y-0.5;
}

/* Fade in */
.fade-in {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide in */
.slide-in {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
\`\`\`

### 7.9 Accessibility Patterns

#### 7.9.1 Focus Styles

\`\`\`css
:focus-visible {
  @apply outline-none ring-2 ring-ring ring-offset-2 ring-offset-background;
}
\`\`\`

#### 7.9.2 Screen Reader Only

\`\`\`tsx
<span className="sr-only">Screen reader text</span>
\`\`\`

#### 7.9.3 ARIA Labels

\`\`\`tsx
<button aria-label="Close dialog">
  <X className="h-4 w-4" />
</button>
\`\`\`

---

## 8. API & Data Layer

### 8.1 Server Actions

**Location**: `app/actions/`

#### 8.1.1 Template Actions

\`\`\`typescript
// app/actions/templates.ts
"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function submitTemplate(formData: FormData) {
  const supabase = createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")
  
  const template = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
    difficulty: formData.get("difficulty") as string,
    tags: JSON.parse(formData.get("tags") as string),
    demo_url: formData.get("demo_url") as string,
    github_url: formData.get("github_url") as string,
    submitted_by: user.id,
  }
  
  const { data, error } = await supabase
    .from("templates")
    .insert(template)
    .select()
    .single()
  
  if (error) throw error
  
  revalidatePath("/templates")
  return data
}

export async function updateTemplate(id: string, updates: Partial<Template>) {
  const supabase = createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")
  
  const { data, error } = await supabase
    .from("templates")
    .update(updates)
    .eq("id", id)
    .eq("submitted_by", user.id)
    .select()
    .single()
  
  if (error) throw error
  
  revalidatePath(`/templates/${id}`)
  return data
}

export async function deleteTemplate(id: string) {
  const supabase = createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")
  
  const { error } = await supabase
    .from("templates")
    .delete()
    .eq("id", id)
    .eq("submitted_by", user.id)
  
  if (error) throw error
  
  revalidatePath("/templates")
}
\`\`\`

### 8.2 API Routes

**Location**: `app/api/`

#### 8.2.1 REST API

\`\`\`typescript
// app/api/v1/templates/route.ts
import { createServerClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createServerClient()
  
  // Verify API key
  const apiKey = request.headers.get("x-api-key")
  if (!apiKey) {
    return NextResponse.json({ error: "API key required" }, { status: 401 })
  }
  
  const { data: keyData } = await supabase
    .from("api_keys")
    .select("*")
    .eq("api_key", apiKey)
    .eq("is_active", true)
    .single()
  
  if (!keyData) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
  }
  
  // Rate limiting check
  const usage = await checkRateLimit(keyData.id)
  if (usage > keyData.rate_limit) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
  }
  
  // Fetch templates
  const { data, error } = await supabase
    .from("templates")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100)
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  // Log API usage
  await logApiUsage(keyData.id, request)
  
  return NextResponse.json({ data })
}
\`\`\`

### 8.3 Data Fetching Patterns

#### 8.3.1 Server Component Data Fetching

\`\`\`typescript
// app/templates/page.tsx
import { createServerClient } from "@/lib/supabase/server"

export default async function TemplatesPage() {
  const supabase = await createServerClient()
  
  const { data: templates } = await supabase
    .from("templates")
    .select(`
      *,
      profiles:submitted_by (
        display_name,
        avatar_url
      )
    `)
    .order("created_at", { ascending: false })
  
  return <TemplateGrid templates={templates} />
}
\`\`\`

#### 8.3.2 Client Component Data Fetching

\`\`\`typescript
"use client"

import { createBrowserClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"

export function TemplateList() {
  const [templates, setTemplates] = useState([])
  const supabase = createBrowserClient()
  
  useEffect(() => {
    async function fetchTemplates() {
      const { data } = await supabase
        .from("templates")
        .select("*")
        .order("created_at", { ascending: false })
      
      setTemplates(data || [])
    }
    
    fetchTemplates()
  }, [])
  
  return <div>{/* Render templates */}</div>
}
\`\`\`

#### 8.3.3 Realtime Subscriptions

\`\`\`typescript
"use client"

import { createBrowserClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"

export function RealtimeTemplates() {
  const [templates, setTemplates] = useState([])
  const supabase = createBrowserClient()
  
  useEffect(() => {
    // Initial fetch
    supabase
      .from("templates")
      .select("*")
      .then(({ data }) => setTemplates(data || []))
    
    // Subscribe to changes
    const channel = supabase
      .channel("templates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "templates" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setTemplates(prev => [payload.new, ...prev])
          } else if (payload.eventType === "UPDATE") {
            setTemplates(prev => 
              prev.map(t => t.id === payload.new.id ? payload.new : t)
            )
          } else if (payload.eventType === "DELETE") {
            setTemplates(prev => prev.filter(t => t.id !== payload.old.id))
          }
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])
  
  return <div>{/* Render templates */}</div>
}
\`\`\`

### 8.4 Caching Strategy

#### 8.4.1 Next.js Cache

\`\`\`typescript
// Static data (revalidate every hour)
export const revalidate = 3600

// Dynamic data (no cache)
export const dynamic = "force-dynamic"

// Partial prerendering
export const experimental_ppr = true
\`\`\`

#### 8.4.2 Redis Cache (Upstash)

\`\`\`typescript
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env["UPSTASH-KV_REDIS_URL"]!,
  token: process.env["UPSTASH-KV_KV_REST_API_TOKEN"]!,
})

export async function getCachedTemplates() {
  const cached = await redis.get("templates:all")
  if (cached) return cached
  
  const templates = await fetchTemplates()
  await redis.set("templates:all", templates, { ex: 300 }) // 5 min
  
  return templates
}
\`\`\`

### 8.5 Error Handling

\`\`\`typescript
// Server action error handling
export async function submitTemplate(formData: FormData) {
  try {
    // ... action logic
  } catch (error) {
    console.error("[v0] Template submission error:", error)
    
    if (error instanceof Error) {
      return { error: error.message }
    }
    
    return { error: "An unexpected error occurred" }
  }
}

// API route error handling
export async function GET(request: NextRequest) {
  try {
    // ... route logic
  } catch (error) {
    console.error("[v0] API error:", error)
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
\`\`\`

---

## 9. Security & Compliance

### 9.1 Authentication

**Provider**: Supabase Auth
**Method**: Email/Password (default)

#### 9.1.1 Sign Up Flow

\`\`\`typescript
// Server action
export async function signUp(email: string, password: string) {
  const supabase = createBrowserClient()
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  
  if (error) throw error
  return data
}
\`\`\`

#### 9.1.2 Sign In Flow

\`\`\`typescript
export async function signIn(email: string, password: string) {
  const supabase = createBrowserClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  return data
}
\`\`\`

#### 9.1.3 Session Management

\`\`\`typescript
// middleware.ts
import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          response.cookies.set({ name, value: "", ...options })
        },
      },
    }
  )
  
  await supabase.auth.getUser()
  
  return response
}
\`\`\`

### 9.2 Row Level Security (RLS)

#### 9.2.1 Profiles Table

\`\`\`sql
-- Users can read all profiles
CREATE POLICY "Profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);
\`\`\`

#### 9.2.2 Templates Table

\`\`\`sql
-- Everyone can view templates
CREATE POLICY "Templates are viewable by everyone"
ON templates FOR SELECT
USING (true);

-- Authenticated users can insert templates
CREATE POLICY "Authenticated users can insert templates"
ON templates FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own templates
CREATE POLICY "Users can update own templates"
ON templates FOR UPDATE
USING (auth.uid() = submitted_by);

-- Users can delete their own templates
CREATE POLICY "Users can delete own templates"
ON templates FOR DELETE
USING (auth.uid() = submitted_by);
\`\`\`

#### 9.2.3 Evaluations Table

\`\`\`sql
-- Everyone can view evaluations
CREATE POLICY "Evaluations are viewable by everyone"
ON evaluations FOR SELECT
USING (true);

-- Authenticated users can insert evaluations
CREATE POLICY "Authenticated users can insert evaluations"
ON evaluations FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' AND
  auth.uid() != (SELECT submitted_by FROM templates WHERE id = template_id)
);

-- Users can update their own evaluations
CREATE POLICY "Users can update own evaluations"
ON evaluations FOR UPDATE
USING (auth.uid() = evaluator_id);
\`\`\`

### 9.3 Input Validation

#### 9.3.1 Zod Schemas

\`\`\`typescript
import { z } from "zod"

export const templateSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  category: z.enum(["web", "mobile", "desktop", "other"]),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  tags: z.array(z.string()).min(1).max(10),
  demo_url: z.string().url().optional(),
  github_url: z.string().url().optional(),
})

export const evaluationSchema = z.object({
  template_id: z.string().uuid(),
  code_quality_score: z.number().int().min(1).max(10),
  design_score: z.number().int().min(1).max(10),
  functionality_score: z.number().int().min(1).max(10),
  documentation_score: z.number().int().min(1).max(10),
  performance_score: z.number().int().min(1).max(10),
  overall_score: z.number().int().min(1).max(10),
  feedback: z.string().min(50).max(2000),
})
\`\`\`

#### 9.3.2 Server-Side Validation

\`\`\`typescript
export async function submitTemplate(formData: FormData) {
  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    // ... other fields
  }
  
  const validated = templateSchema.safeParse(rawData)
  
  if (!validated.success) {
    return { error: validated.error.flatten() }
  }
  
  // Proceed with validated data
  const template = validated.data
  // ...
}
\`\`\`

### 9.4 Rate Limiting

#### 9.4.1 API Rate Limiting

\`\`\`typescript
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env["UPSTASH-KV_REDIS_URL"]!,
  token: process.env["UPSTASH-KV_KV_REST_API_TOKEN"]!,
})

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 h"),
})

export async function checkRateLimit(identifier: string) {
  const { success, limit, reset, remaining } = await ratelimit.limit(identifier)
  
  if (!success) {
    throw new Error("Rate limit exceeded")
  }
  
  return { limit, reset, remaining }
}
\`\`\`

#### 9.4.2 Action Rate Limiting

\`\`\`typescript
// Comment rate limit: 10/hour
const commentRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 h"),
})

// Evaluation rate limit: 20/day
const evaluationRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 d"),
})

// Template submission rate limit: 5/day
const templateRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 d"),
})
\`\`\`

### 9.5 Data Sanitization

\`\`\`typescript
import DOMPurify from "isomorphic-dompurify"

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br"],
    ALLOWED_ATTR: ["href"],
  })
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove angle brackets
    .slice(0, 1000) // Limit length
}
\`\`\`

### 9.6 CSRF Protection

**Built-in**: Next.js Server Actions have CSRF protection by default

### 9.7 XSS Prevention

- All user input sanitized
- React escapes by default
- DOMPurify for rich text
- Content Security Policy headers

### 9.8 SQL Injection Prevention

- Supabase uses parameterized queries
- No raw SQL from user input
- All queries use Supabase client

---

## 10. Integration Specifications

### 10.1 Supabase Integration

**Purpose**: Database, authentication, realtime subscriptions

#### 10.1.1 Environment Variables

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
\`\`\`

#### 10.1.2 Client Setup

\`\`\`typescript
// lib/supabase/client.ts
import { createBrowserClient as createClient } from "@supabase/ssr"

export function createBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
\`\`\`

\`\`\`typescript
// lib/supabase/server.ts
import { createServerClient as createClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createServerClient() {
  const cookieStore = await cookies()
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component - ignore
          }
        },
      },
    }
  )
}
\`\`\`

### 10.2 Stripe Integration

**Purpose**: Payment processing, subscriptions, marketplace

#### 10.2.1 Environment Variables

\`\`\`env
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
\`\`\`

#### 10.2.2 Checkout Session

\`\`\`typescript
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function createCheckoutSession(
  listingId: string,
  userId: string
) {
  const listing = await getListingById(listingId)
  
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: listing.title,
            description: listing.description,
          },
          unit_amount: listing.price_cents,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_URL}/marketplace/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/marketplace/listings/${listingId}`,
    metadata: {
      listing_id: listingId,
      buyer_id: userId,
      seller_id: listing.seller_id,
    },
  })
  
  return session
}
\`\`\`

#### 10.2.3 Webhook Handler

\`\`\`typescript
// app/api/webhooks/stripe/route.ts
import { headers } from "next/headers"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get("stripe-signature")!
  
  let event: Stripe.Event
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return new Response("Webhook signature verification failed", {
      status: 400,
    })
  }
  
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    
    // Create purchase record
    await createPurchase({
      listing_id: session.metadata!.listing_id,
      buyer_id: session.metadata!.buyer_id,
      seller_id: session.metadata!.seller_id,
      price_cents: session.amount_total!,
      stripe_payment_intent_id: session.payment_intent as string,
    })
  }
  
  return new Response(JSON.stringify({ received: true }))
}
\`\`\`

### 10.3 Upstash Redis Integration

**Purpose**: Caching, rate limiting, session storage

#### 10.3.1 Environment Variables

\`\`\`env
UPSTASH-KV_REDIS_URL=https://xxx.upstash.io
UPSTASH-KV_KV_REST_API_TOKEN=xxx
\`\`\`

#### 10.3.2 Redis Client

\`\`\`typescript
import { Redis } from "@upstash/redis"

export const redis = new Redis({
  url: process.env["UPSTASH-KV_REDIS_URL"]!,
  token: process.env["UPSTASH-KV_KV_REST_API_TOKEN"]!,
})

// Cache example
export async function getCachedData(key: string) {
  return await redis.get(key)
}

export async function setCachedData(
  key: string,
  value: any,
  expirationSeconds: number
) {
  await redis.set(key, value, { ex: expirationSeconds })
}
\`\`\`

---

## 11. Deployment & Operations

### 11.1 Deployment Platform

**Platform**: Vercel
**Framework**: Next.js 15
**Node Version**: 20.x

### 11.2 Environment Setup

#### 11.2.1 Required Environment Variables

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Upstash Redis
UPSTASH-KV_REDIS_URL=
UPSTASH-KV_KV_REST_API_TOKEN=

# App
NEXT_PUBLIC_URL=https://your-domain.com
\`\`\`

### 11.3 Build Configuration

\`\`\`javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["your-supabase-project.supabase.co"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
}

export default nextConfig
\`\`\`

### 11.4 Database Migrations

**Process**:
1. Write SQL script in `scripts/` directory
2. Version scripts: `001_initial.sql`, `002_add_notifications.sql`
3. Run via Supabase SQL editor or CLI
4. Never edit existing scripts, create new versioned scripts

### 11.5 Monitoring

#### 11.5.1 Vercel Analytics

\`\`\`typescript
// app/layout.tsx
import { Analytics } from "@vercel/analytics/next"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
\`\`\`

#### 11.5.2 Error Tracking

\`\`\`typescript
// lib/error-tracking.ts
export function logError(error: Error, context?: Record<string, any>) {
  console.error("[v0] Error:", error, context)
  
  // Send to error tracking service (e.g., Sentry)
  // sentry.captureException(error, { extra: context })
}
\`\`\`

### 11.6 Performance Optimization

#### 11.6.1 Image Optimization

\`\`\`tsx
import Image from "next/image"

<Image
  src="/images/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority
/>
\`\`\`

#### 11.6.2 Code Splitting

\`\`\`tsx
import dynamic from "next/dynamic"

const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <Spinner />,
})
\`\`\`

#### 11.6.3 Database Query Optimization

\`\`\`typescript
// Use select() to fetch only needed columns
const { data } = await supabase
  .from("templates")
  .select("id, title, description")
  .limit(10)

// Use indexes for common queries
// CREATE INDEX idx_templates_category ON templates(category);
\`\`\`

---

## 12. Component Library

### 12.1 shadcn/ui Components

**Installed Components**:
- accordion
- alert
- avatar
- badge
- button
- card
- checkbox
- dialog
- dropdown-menu
- form
- input
- label
- popover
- select
- separator
- sheet
- skeleton
- table
- tabs
- textarea
- toast
- tooltip

### 12.2 Custom Components

#### 12.2.1 Dashboard Components

**`DashboardShell`**
\`\`\`tsx
export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {children}
    </div>
  )
}
\`\`\`

**`DashboardHeader`**
\`\`\`tsx
export function DashboardHeader({ user, profile }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {profile?.display_name || user.email}
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your templates
        </p>
      </div>
      <Avatar>
        <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
        <AvatarFallback>{profile?.display_name?.[0]}</AvatarFallback>
      </Avatar>
    </div>
  )
}
\`\`\`

#### 12.2.2 Template Components

**`TemplateCard`**
\`\`\`tsx
export function TemplateCard({ template }) {
  return (
    <Card className="hover-lift">
      <CardHeader>
        <CardTitle>{template.title}</CardTitle>
        <CardDescription>{template.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Badge>{template.category}</Badge>
          <Badge variant="outline">{template.difficulty}</Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href={`/templates/${template.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
\`\`\`

#### 12.2.3 Form Components

**`TemplateForm`**
\`\`\`tsx
export function TemplateForm() {
  return (
    <form action={submitTemplate} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" required />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select name="category">
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="web">Web</SelectItem>
            <SelectItem value="mobile">Mobile</SelectItem>
            <SelectItem value="desktop">Desktop</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button type="submit">Submit Template</Button>
    </form>
  )
}
\`\`\`

---

## Appendix A: File Structure

\`\`\`
template-academy/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── actions/
│   │   ├── templates.ts
│   │   ├── evaluations.ts
│   │   └── generations.ts
│   ├── api/
│   │   ├── v1/
│   │   │   └── templates/
│   │   ├── webhooks/
│   │   │   └── stripe/
│   │   └── developer/
│   ├── templates/
│   │   ├── [id]/
│   │   ├── compare/
│   │   └── page.tsx
│   ├── leaderboard/
│   ├── resources/
│   ├── marketplace/
│   ├── profile/
│   ├── analytics/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   ├── dashboard/
│   ├── templates/
│   ├── forms/
│   └── [feature]/
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── stripe/
│   └── utils.ts
├── scripts/
│   └── [sql-scripts]
├── public/
├── middleware.ts
├── next.config.mjs
├── package.json
├── tsconfig.json
└── tailwind.config.ts
\`\`\`

---

## Appendix B: Key Metrics

### Performance Targets
- Lighthouse Performance: > 90
- Lighthouse Accessibility: > 95
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Cumulative Layout Shift: < 0.1

### Scalability Targets
- Support 10,000+ concurrent users
- Handle 1M+ templates
- Process 100K+ evaluations/day
- 99.9% uptime

### User Engagement Targets
- 70% user retention (30 days)
- 50% completion rate (onboarding)
- 30% active evaluators
- 20% marketplace conversion

---

## Appendix C: Glossary

**Template**: A code project submission
**Evaluation**: Multi-criteria assessment of a template
**XP**: Experience points earned through actions
**Leaderboard**: Ranking of users by score
**Achievement**: Unlockable milestone
**Certification**: Earned credential
**Marketplace**: Buy/sell templates
**Collection**: Curated set of templates
**Resource**: Educational content
**RLS**: Row Level Security (database access control)

---

## Conclusion

This document provides a complete specification for replicating the Template Evaluation Academy system. It covers:

✅ **Architecture**: Tech stack, data flow, authentication
✅ **Database**: 74 tables with relationships and RLS policies
✅ **Features**: 50+ features across 9 major categories
✅ **Workflows**: Step-by-step user journeys
✅ **Business Rules**: 10 comprehensive rule categories
✅ **Design System**: Colors, typography, components
✅ **API Layer**: Server actions, routes, data fetching
✅ **Security**: Auth, RLS, validation, rate limiting
✅ **Integrations**: Supabase, Stripe, Upstash
✅ **Deployment**: Vercel setup, monitoring, optimization

**Total System Complexity**:
- 74 database tables
- 50+ features
- 100+ components
- 20+ API endpoints
- 10 business rule categories
- 1000+ lines of SQL
- 10,000+ lines of TypeScript

This specification enables complete system replication with full context of architecture, features, and implementation details.

---

**Document Version**: 1.0
**Last Updated**: 2025-01-21
**Maintained By**: v0 AI Assistant
**License**: MIT
