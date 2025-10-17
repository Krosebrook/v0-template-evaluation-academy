# 🏆 GOLDEN META-PROMPT: Template Generation Academy
## Universal Replication & Adaptation Framework for Custom GPT

---

## 🎯 EXECUTIVE SUMMARY

**Purpose**: Create a comprehensive, production-ready template generation platform that can create, score, certify, and monetize any type of digital asset (templates, code, designs, content, etc.) with enterprise-grade features including authentication, training, marketplace, analytics, and social engagement.

**Core Value Proposition**: Transform template generation into a standardized, gamified, AI-powered creation system with certification, reputation systems, and monetization capabilities.

**Target Users**: Generators (experts who create), Submitters (creators who submit), Learners (those seeking certification), Administrators (platform managers)

---

## 📋 CONTEXT ENGINEERING FRAMEWORK FOR CUSTOM GPT

### Meta-Prompt Structure (Using Advanced Techniques)

\`\`\`
[ROLE] You are an expert full-stack architect specializing in Next.js 15+, TypeScript, Supabase, Stripe, and enterprise SaaS platforms with deep expertise in template generation systems, AI-powered workflows, and gamification.

[DEPTH] Apply multi-layered reasoning:
- Layer 1: Understand the generation domain and user needs
- Layer 2: Design scalable database architecture with RLS
- Layer 3: Implement authentication and authorization flows
- Layer 4: Build generation and scoring systems
- Layer 5: Add gamification, training, and monetization
- Layer 6: Optimize for accessibility, performance, and SEO
- Layer 7: Integrate AI-powered recommendations and automation

[LYRA] (Layered Reasoning Architecture):
1. Requirements Analysis → 2. System Design → 3. Database Schema → 4. Authentication → 5. Core Features → 6. Advanced Features → 7. AI Integration → 8. Testing & Optimization

[CHAIN-OF-THOUGHT] For each feature:
- What problem does this solve?
- What are the user flows?
- What data structures are needed?
- What edge cases exist?
- How does this integrate with other features?
- What AI enhancements can improve this?

[CONSTRAINTS]
- Use Next.js 15+ App Router (no Pages Router)
- TypeScript strict mode only
- Supabase for database and auth
- Shadcn/ui components exclusively
- Tailwind CSS v4 (no custom CSS, no inline styles, no !important)
- Mobile-first responsive design (44px minimum touch targets)
- WCAG 2.1 AA accessibility compliance
- No external state management (use React Server Components + Server Actions)
- Lucide React icons only
- Graceful error handling with Alert components
\`\`\`

---

## 🏗️ SYSTEM ARCHITECTURE

### Technology Stack

**Frontend**:
- Next.js 14.2.25 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4.1.9
- Shadcn/ui (Radix UI primitives)
- Lucide React icons

**Backend**:
- Next.js API Routes
- Server Actions
- Supabase (PostgreSQL + Auth + RLS)

**Integrations**:
- Supabase Auth (Email + OAuth: Google, GitHub)
- Stripe (Payments & Subscriptions)
- Vercel Analytics

**Key Dependencies**:
\`\`\`json
{
  "@supabase/ssr": "0.7.0",
  "@supabase/supabase-js": "2.75.0",
  "react-hook-form": "^7.60.0",
  "@hookform/resolvers": "^3.10.0",
  "zod": "3.25.67",
  "recharts": "2.15.4",
  "date-fns": "4.1.0"
}
\`\`\`

---

## 🗄️ DATABASE ARCHITECTURE (22 Schemas)

### Core Tables

**1. profiles** (User Management)
\`\`\`sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT DEFAULT 'user', -- 'user', 'generator', 'admin'
  interests TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**2. templates** (Generation System)
\`\`\`sql
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  demo_url TEXT,
  github_url TEXT,
  documentation TEXT,
  tags TEXT[],
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  average_score DECIMAL(3,2),
  total_generations INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**3. evaluations** (Scoring System - tracks generated templates)
\`\`\`sql
CREATE TABLE evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES templates(id),
  generator_id UUID REFERENCES profiles(id),
  scores JSONB NOT NULL, -- {code_quality: 8, design: 9, ...}
  feedback TEXT,
  status TEXT DEFAULT 'draft', -- 'draft', 'submitted'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**4. certification_levels** (Training System)
\`\`\`sql
CREATE TABLE certification_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- 'Bronze', 'Silver', 'Gold', 'Platinum'
  requirements JSONB, -- {min_generations: 10, min_score: 85}
  badge_url TEXT,
  benefits TEXT[]
);
\`\`\`

**5. marketplace_pricing** (Monetization)
\`\`\`sql
CREATE TABLE marketplace_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES templates(id),
  price_type TEXT, -- 'free', 'one-time', 'subscription'
  price_amount INTEGER, -- in cents
  stripe_price_id TEXT
);
\`\`\`

### Additional Tables (17 more)
- **notifications** - Email & In-app notifications
- **comments** - Discussion threads
- **template_versions** - Version control
- **votes** - Community voting
- **tags** - Taxonomy system
- **test_results** - Automated testing
- **github_repos** - GitHub integration
- **api_keys** - Developer API
- **webhooks** - Event notifications
- **collections** - User playlists
- **user_certifications** - Training progress
- **courses** - Training content
- **disputes** - Resolution system
- **reputation_scores** - Trust system
- **performance_metrics** - Monitoring
- **social_shares** - Viral growth
- **recommendations** - AI-powered suggestions
- **insights** - Analytics
- **platform_metrics** - Admin analytics
- **usage_analytics** - Template tracking

---

## 🎨 UI/UX ARCHITECTURE

### Design System

**Color Palette** (Defined in globals.css):
\`\`\`css
@theme inline {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --accent: 210 40% 96.1%;
  --destructive: 0 84.2% 60.2%;
  --muted: 210 40% 96.1%;
  --border: 214.3 31.8% 91.4%;
  --radius: 0.5rem;
}
\`\`\`

**Typography**:
- Font: Geist (sans-serif) + Geist Mono (monospace)
- Scale: text-sm (14px), text-base (16px), text-lg (18px), text-xl (20px), text-2xl (24px), text-3xl (30px), text-4xl (36px)
- Line height: leading-relaxed (1.625) for body text

**Responsive Breakpoints**:
- sm: 640px (mobile landscape)
- md: 768px (tablet)
- lg: 1024px (desktop)
- xl: 1280px (large desktop)

**Component Library** (50 components):
- **Shadcn/ui**: Button, Card, Dialog, Form, Input, Select, Tabs, Alert, Badge, Progress, Slider, etc.
- **Custom**: TemplateCard, GenerationCriteria, CourseContent, ReputationBadge, UniversalPromptGenerator, etc.

**Accessibility Requirements**:
- All buttons minimum 44px height (touch-friendly)
- ARIA labels on all interactive elements
- ARIA live regions for dynamic content
- Semantic HTML (header, main, nav, article, section)
- Focus indicators (2px outline)
- Color contrast 4.5:1 minimum
- Keyboard navigation support

---

## 🔐 AUTHENTICATION SYSTEM

### Implementation Pattern

**1. Supabase Client Setup** (Singleton Pattern):
\`\`\`typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

let client: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseBrowserClient() {
  if (client) return client
  
  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  return client
}
\`\`\`

**2. Server Client Setup**:
\`\`\`typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function getSupabaseServerClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: (name, value, options) => cookieStore.set(name, value, options),
        remove: (name, options) => cookieStore.delete(name)
      }
    }
  )
}
\`\`\`

**3. Middleware for Token Refresh**:
\`\`\`typescript
// middleware.ts
import { updateSession } from '@/lib/supabase/middleware'
import { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
}
\`\`\`

**4. Auth Pages**:
- `/auth/login` - Email + OAuth (Google, GitHub) with password strength indicator
- `/auth/sign-up` - Registration with email confirmation and real-time validation
- `/auth/forgot-password` - Password reset flow with email link
- `/auth/reset-password` - New password entry with strength requirements
- `/auth/callback` - OAuth redirect handler with error handling
- `/auth/onboarding` - Post-signup profile setup (role, interests, bio)

**5. Auth Features**:
- Email/password authentication
- OAuth with Google and GitHub
- Password reset via email
- Email verification required
- Session management with automatic token refresh
- Protected routes with middleware
- Role-based access control (user, generator, admin)

---

## 📱 PAGE ARCHITECTURE (51+ Pages)

### Public Pages (No Auth Required)
1. `/` - Landing page with hero, features, stats, personas, prompt layers, CTA
2. `/browse` - Template gallery with filters and search
3. `/templates` - Template listing with sorting
4. `/templates/[id]` - Template detail view with preview
5. `/leaderboard` - Top generators and templates
6. `/why-join` - Value proposition and benefits comparison
7. `/help` - Help center with FAQs
8. `/knowledge` - Knowledge base articles
9. `/tutorials` - Tutorial library with categories
10. `/tutorials/[id]` - Individual tutorial lessons
11. `/generation-guide` - Guidelines for template generation

### Protected Pages (Auth Required)
12. `/profile` - User profile dashboard with stats
13. `/profile/settings` - Account settings and preferences
14. `/profile/[id]/reputation` - User reputation details
15. `/templates/submit` - Template submission form with validation
16. `/templates/generate/[id]` - Generation interface with criteria scoring
17. `/collections` - User collections management
18. `/collections/new` - Create new collection
19. `/collections/[id]` - Collection detail view
20. `/training` - Training hub with courses
21. `/training/certification` - Certification dashboard with progress
22. `/training/courses/[id]` - Course content with quizzes
23. `/training/tools` - Prompt engineering tools (8 tools)
24. `/training/tools/prompt-generator` - Universal prompt generator
25. `/marketplace` - Premium templates marketplace
26. `/marketplace/dashboard` - Seller dashboard with analytics
27. `/disputes` - Dispute management system
28. `/disputes/[id]` - Dispute detail and resolution
29. `/reputation` - Reputation leaderboard
30. `/recommendations` - Personalized AI recommendations
31. `/insights` - Generation insights and analytics
32. `/developer` - API documentation
33. `/library` - Personal template library
34. `/analytics` - Personal analytics dashboard
35. `/search` - Global search with filters

### Admin Pages (Admin Role Required)
36. `/admin` - Admin dashboard with platform metrics
37. `/admin/analytics` - Platform-wide analytics

### Template Management Pages
38. `/templates/[id]/update` - Edit template details
39. `/templates/[id]/versions` - Version history
40. `/templates/[id]/tests` - Automated test results
41. `/templates/[id]/performance` - Performance metrics
42. `/templates/[id]/analytics` - Usage analytics
43. `/templates/[id]/embed` - Embeddable widget code
44. `/templates/compare` - Side-by-side comparison tool
45. `/templates/results/[id]` - Generation results display

### Additional Pages
46. `/compare` - Template comparison tool
47. `/resources` - Resource library
48. `/certificate` - Certification display and sharing

---

## 🎯 CORE FEATURES (20 Systems)

### 1. Template Generation System
**User Flow**: Create → Configure → Generate → Review → Publish
**Components**: TemplateSubmissionForm, FileUpload, TagSelector, CategoryPicker
**Validation**: Zod schema with URL validation, required fields, character limits
**Database**: templates table with status tracking and version control
**Features**:
- Multi-step form with progress indicator
- Real-time validation feedback
- Auto-save drafts
- Preview before submission
- Tag suggestions based on content

### 2. Generation Scoring System
**Criteria** (6 dimensions, 1-10 scale):
- Code Quality (40%) - Clean code, best practices, maintainability
- Design & UX (20%) - Visual appeal, user experience, responsiveness
- Documentation (15%) - Completeness, clarity, examples
- Performance (10%) - Load time, optimization, efficiency
- Accessibility (10%) - WCAG compliance, keyboard navigation, screen readers
- Innovation (5%) - Uniqueness, creativity, problem-solving

**User Flow**: Select Template → Review → Score Each Criterion → Add Feedback → Submit
**Components**: GenerationCriteria, TemplatePreview, ScoreSlider, FeedbackTextarea
**Calculation**: Weighted average with minimum 3 generations for public score
**Features**:
- Slider inputs with real-time preview
- Character count for feedback (min 50, max 500)
- Evidence requirements for extreme scores (<4 or >9)
- Blind scoring (can't see other scores until submission)

### 3. Certification System
**Levels**: Bronze → Silver → Gold → Platinum
**Requirements**:
- **Bronze**: Complete 5 generations, 80% accuracy, pass quiz
- **Silver**: Complete 20 generations, 85% accuracy, advanced quiz
- **Gold**: Complete 50 generations, 90% accuracy, expert quiz
- **Platinum**: Complete 100 generations, 95% accuracy, master quiz

**Components**: CertificationBadge, ProgressTracker, CourseContent, QuizInterface
**Gamification**: XP points, achievement badges, leaderboards, streaks
**Benefits by Level**:
- Bronze: Basic badge, profile highlight
- Silver: Priority support, early access to features
- Gold: Revenue sharing, API access
- Platinum: Custom branding, dedicated account manager

### 4. Marketplace System
**Pricing Tiers**:
- **Free**: Browse and view templates, limited downloads
- **Pro** ($9/month): Unlimited downloads, access training, priority support
- **Enterprise** ($29/month): API access, custom integrations, white-label

**Revenue Sharing**: 70% creator, 30% platform
**Payment**: Stripe integration with:
- Subscriptions (monthly/annual)
- One-time purchases
- Pay-per-download
- Bundle pricing

**Features**:
- Seller dashboard with earnings analytics
- Automated payouts
- Refund management
- License key generation
- Usage tracking

### 5. Training System
**Content Types**:
- Interactive courses with progress tracking
- Video tutorials with transcripts
- Prompt engineering tools (8 specialized tools)
- Practice generations with AI feedback
- Quizzes and assessments

**8 Prompt Engineering Tools**:
1. **Chain-of-Thought Builder** - Step-by-step reasoning
2. **Meta-Prompt Optimizer** - Enhance prompt quality
3. **Multi-Framework Generator** - Multiple prompt formats
4. **Prompt Quality Checker** - Automated scoring
5. **R-I-S-E Framework Generator** - Role, Instructions, Steps, End goal
6. **Profession Selector** - 16 expert personas
7. **Universal Prompt Generator Pro** - 12-layer prompt construction
8. **Context Engineer** - Advanced context management

**16 Expert Personas**:
1. Expert Analyst
2. Creative Innovator
3. Technical Engineer
4. Business Strategist
5. Research Consultant
6. Content Creator
7. System Architect
8. Security Specialist
9. UX Designer
10. Data Scientist
11. DevOps Engineer
12. Product Manager
13. Legal Advisor
14. Ethics Specialist
15. Marketing Specialist
16. Customer Success Manager

**12 Prompt Layers**:
1. Role Definition
2. Context
3. Task
4. Format
5. Examples
6. Constraints
7. Validation
8. Tone/Style
9. Target Audience
10. Iteration Strategy
11. Dependencies & Prerequisites
12. Fallback & Error Handling

### 6. Reputation System
**Calculation** (0-1000 points):
- Generation Quality: 40% (consistency, thoroughness, accuracy)
- Template Submissions: 30% (approval rate, ratings, downloads)
- Community Contributions: 20% (comments, votes, helpful feedback)
- Consistency: 10% (regular activity, streak maintenance)

**Levels**: 
- Novice (0-249) - Learning the ropes
- Intermediate (250-499) - Building expertise
- Advanced (500-749) - Recognized contributor
- Expert (750-1000) - Platform authority

**Badges**: 
- First Generation, 10 Generations, 100 Generations
- Perfect Score, Helpful Feedback, Community Champion
- Streak Master (7, 30, 100 days)

### 7. Social Features
- **Comments**: Threaded discussions with markdown support
- **Voting**: Upvote/downvote with reputation impact
- **Reactions**: Like, love, celebrate, insightful
- **Following**: Follow users, collections, tags
- **Social Sharing**: Twitter, LinkedIn, Facebook, copy link
- **Mentions**: @username notifications
- **Activity Feed**: Real-time updates

### 8. Analytics System
**User Analytics**:
- Generation trends over time
- Score distributions by criteria
- Time spent generating
- Accuracy metrics vs. consensus
- Improvement trajectory

**Template Analytics**:
- Views, downloads, forks, stars
- Conversion funnels (view → download → use)
- Device breakdown (mobile, tablet, desktop)
- Geographic distribution
- Referral sources

**Platform Analytics** (Admin):
- User growth (DAU, MAU, retention)
- Template submissions (approval rate, categories)
- Generation completion rates
- Revenue metrics (MRR, churn, LTV)
- Feature usage heatmaps

### 9. Search & Discovery
**Features**:
- Full-text search with fuzzy matching
- Advanced filters (category, tags, score range, date)
- Sorting (newest, highest rated, most popular, trending)
- AI-powered recommendations based on:
  - User interests
  - Generation history
  - Similar user behavior
  - Trending topics

**Search Syntax**:
- `tag:react` - Filter by tag
- `category:ui` - Filter by category
- `score:>8` - Filter by score
- `author:username` - Filter by author

### 10. Collections System
**Features**:
- Create curated collections of templates
- Public/private visibility toggle
- Follow collections for updates
- Featured collections on homepage
- Collaborative collections (multiple editors)
- Collection analytics (views, followers)

**Use Cases**:
- "Best React Templates"
- "Beginner-Friendly Starters"
- "E-commerce Solutions"
- "Portfolio Inspiration"

### 11. Dispute Resolution
**Process**: 
1. Submit Dispute (with evidence)
2. Assign Peer Review Panel (3 generators)
3. Review Evidence (blind review)
4. Vote on Outcome (majority rules)
5. Resolve (upheld, overturned, partial)

**Roles**: 
- Disputer (submits dispute)
- Reviewers (3 certified generators)
- Admin (final arbiter if tied)

**Outcomes**: 
- Upheld (original score stands)
- Overturned (score adjusted)
- Partial (compromise reached)

### 12. GitHub Integration
**Features**:
- Connect GitHub repository
- Auto-sync commits and releases
- Display stars, forks, issues, PRs
- Webhook support for automatic updates
- Code quality metrics from GitHub Actions
- Contributor recognition

### 13. API & Webhooks
**REST API Endpoints**:
- `GET /api/v1/templates` - List templates
- `GET /api/v1/templates/:id` - Get template details
- `POST /api/v1/evaluations` - Submit generation
- `GET /api/v1/users/:id` - Get user profile
- `GET /api/v1/analytics` - Get analytics data

**Authentication**: API key in `Authorization` header
**Rate Limiting**: 100 requests/hour (free), 1000/hour (pro)
**Webhooks**: 
- `template.created`
- `template.updated`
- `generation.submitted`
- `certification.earned`

### 14. Automated Testing
**Tests Run on Submission**:
- Lighthouse performance audit (target: 90+)
- Accessibility scan (WCAG 2.1 AA compliance)
- Security vulnerability check (npm audit)
- Broken link detection
- Code quality analysis (ESLint, Prettier)
- Bundle size analysis (target: <500KB)

**Results Display**:
- Pass/fail status with details
- Recommendations for improvement
- Historical trend comparison

### 15. Performance Monitoring
**Metrics Tracked**:
- Core Web Vitals (LCP <2.5s, FID <100ms, CLS <0.1)
- Uptime percentage (target: 99.9%)
- API response time (target: <200ms)
- Error rate (target: <0.1%)
- Database query performance

**Alerts**:
- Email notifications for downtime
- Slack integration for critical errors
- Weekly performance reports

### 16. Template Versioning
**Features**:
- Semantic versioning (1.0.0)
- Automated changelog generation
- Migration guides for breaking changes
- Rollback capability to previous versions
- Version comparison (diff view)
- Deprecation warnings

### 17. Notification System
**Types**:
- Email notifications (configurable)
- In-app notifications (real-time)
- Push notifications (future)

**Events**:
- New generation received
- Template approved/rejected
- Certification earned
- Comment reply
- Follower activity
- Milestone achievements

**Preferences**:
- Frequency (instant, daily digest, weekly)
- Channels (email, in-app, push)
- Event types (all, important only, none)

### 18. Moderation Dashboard
**Features**:
- Content flagging system
- Automated spam detection (AI-powered)
- Moderation queue with priority sorting
- User warning system (3 strikes)
- Ban/suspend capabilities
- Appeal process

**Moderation Actions**:
- Approve/reject content
- Edit/redact inappropriate content
- Warn/suspend/ban users
- Restore deleted content
- Review appeals

### 19. Collaborative Generation
**Features**:
- Real-time generation sessions (WebSocket)
- Shared annotations and comments
- Live scoring with consensus building
- Session recording and playback
- Video conferencing integration (future)

### 20. Community Challenges
**Features**:
- Monthly themed challenges
- Community voting for winners
- Prize pools (cash, credits, swag)
- Winner galleries and showcases
- Challenge leaderboards
- Sponsor partnerships

---

## 🔒 SECURITY & COMPLIANCE

### Row Level Security (RLS) Policies

**Example: Templates Table**
\`\`\`sql
-- Anyone can view approved templates
CREATE POLICY "Anyone can view approved templates"
ON templates FOR SELECT
USING (status = 'approved');

-- Users can insert their own templates
CREATE POLICY "Users can insert own templates"
ON templates FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own templates
CREATE POLICY "Users can update own templates"
ON templates FOR UPDATE
USING (auth.uid() = user_id);

-- Admins can do anything
CREATE POLICY "Admins can do anything"
ON templates FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
\`\`\`

### Data Privacy
- PII scrubbing from all submissions
- GDPR/CCPA compliance
- Right to deletion (complete data removal)
- Data retention policies (2 years for analytics)
- Encrypted data at rest and in transit
- Regular security audits

### Authentication Security
- Email verification required
- Password strength requirements (min 8 chars, uppercase, lowercase, number, symbol)
- OAuth with Google and GitHub
- Session management with automatic token refresh
- Rate limiting on auth endpoints
- Account lockout after 5 failed attempts
- Two-factor authentication (future)

---

## 🎨 ACCESSIBILITY COMPLIANCE

### WCAG 2.1 AA Standards
- **Semantic HTML**: header, main, nav, article, section, aside, footer
- **ARIA Labels**: All interactive elements have descriptive labels
- **ARIA Live Regions**: Dynamic content updates announced to screen readers
- **Keyboard Navigation**: All features accessible via keyboard (Tab, Enter, Escape, Arrow keys)
- **Focus Indicators**: 2px solid outline on all focusable elements
- **Color Contrast**: 4.5:1 for normal text, 3:1 for large text
- **Alternative Text**: All images have descriptive alt text
- **Screen Reader**: Tested with NVDA, JAWS, VoiceOver
- **No Color Reliance**: Information not conveyed by color alone

### Mobile Accessibility
- Touch targets minimum 44x44px
- Responsive typography (16px base, scales up)
- Pinch-to-zoom enabled
- Landscape orientation support
- Reduced motion support (prefers-reduced-motion)
- High contrast mode support

---

## 📊 PERFORMANCE OPTIMIZATION

### Core Web Vitals Targets
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **TTFB** (Time to First Byte): < 600ms
- **TTI** (Time to Interactive): < 3.8s

### Optimization Techniques
- Image optimization with Next.js Image component
- Code splitting with dynamic imports
- Server-side rendering for SEO-critical pages
- Static generation where possible (ISR)
- Database query optimization (no N+1 queries)
- CDN for static assets (Vercel Edge Network)
- Lazy loading for images and components
- Prefetching for navigation links
- Service worker for offline support (future)

---

## 🚀 DEPLOYMENT & INFRASTRUCTURE

### Vercel Deployment
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Environment Variables Required:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
\`\`\`

### Database Setup
\`\`\`bash
# Run migrations in order (22 scripts)
psql -h your_host -U your_user -d your_db -f scripts/001_create_tables.sql
psql -h your_host -U your_user -d your_db -f scripts/002_create_profile_trigger.sql
# ... continue through all 22 scripts
\`\`\`

### Supabase Configuration
1. Create new Supabase project
2. Run all SQL migration scripts
3. Enable Email Auth in Authentication settings
4. Configure OAuth providers (Google, GitHub)
5. Set up email templates for auth flows
6. Configure RLS policies on all tables
7. Set up database backups (daily)

### Stripe Configuration
1. Create Stripe account
2. Set up products and pricing
3. Configure webhooks for events
4. Test with Stripe test mode
5. Enable production mode when ready

---

## 🔄 ADAPTATION FRAMEWORK

### How to Adapt for Different Domains

**Example 1: Code Review Platform**
- Replace "templates" with "code_submissions"
- Generation criteria: Code Quality, Test Coverage, Documentation, Security, Performance, Maintainability
- Add: Pull request integration, CI/CD pipeline, code diff viewer, automated linting
- Integrations: GitHub, GitLab, Bitbucket

**Example 2: Design Critique Platform**
- Replace "templates" with "design_submissions"
- Generation criteria: Visual Design, UX, Accessibility, Brand Consistency, Innovation, Usability
- Add: Figma integration, design system checker, color palette analyzer, typography audit
- Integrations: Figma, Sketch, Adobe XD

**Example 3: Content Moderation Platform**
- Replace "templates" with "content_submissions"
- Generation criteria: Accuracy, Tone, Grammar, SEO, Engagement, Originality
- Add: Plagiarism detection, readability scores, keyword analysis, sentiment analysis
- Integrations: Grammarly, Copyscape, SEMrush

**Example 4: Recipe Evaluation Platform**
- Replace "templates" with "recipe_submissions"
- Generation criteria: Taste, Presentation, Difficulty, Nutrition, Creativity, Instructions
- Add: Ingredient parser, nutrition calculator, cooking time estimator, dietary filters
- Integrations: Spoonacular API, nutrition databases

### Customization Points
1. **Domain Model**: Change entity names (templates → submissions)
2. **Generation Criteria**: Define domain-specific scoring dimensions (6-10 criteria)
3. **Integrations**: Add domain-specific tools (GitHub, Figma, CMS, APIs)
4. **Training Content**: Create domain-specific courses and certifications
5. **Marketplace**: Adjust pricing and revenue models
6. **Personas**: Customize the 16 expert personas for your domain
7. **Prompt Layers**: Adapt the 12 layers for domain-specific needs

---

## 📝 IMPLEMENTATION CHECKLIST

### Phase 1: Foundation (Week 1-2)
- [ ] Set up Next.js 15 project with TypeScript
- [ ] Configure Tailwind CSS v4 with design tokens
- [ ] Install Shadcn/ui components (Button, Card, Form, Input, etc.)
- [ ] Set up Supabase project and configure auth
- [ ] Create database schema (22 tables with RLS)
- [ ] Implement authentication system (email + OAuth)
- [ ] Build landing page with hero, features, personas, layers
- [ ] Set up middleware for token refresh

### Phase 2: Core Features (Week 3-4)
- [ ] Template submission system with validation
- [ ] Generation interface with scoring criteria
- [ ] User profiles with stats and reputation
- [ ] Admin dashboard with platform metrics
- [ ] Search and filtering with advanced options
- [ ] Comments and discussions with threading
- [ ] Voting and reactions system
- [ ] Notifications (email + in-app)

### Phase 3: Advanced Features (Week 5-6)
- [ ] Certification system with 4 levels
- [ ] Training courses with quizzes
- [ ] 8 prompt engineering tools
- [ ] Marketplace integration with Stripe
- [ ] Reputation system with badges
- [ ] Analytics dashboards (user, template, platform)
- [ ] API and webhooks for developers
- [ ] Collections system

### Phase 4: Optimization (Week 7-8)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Performance optimization (Core Web Vitals)
- [ ] SEO implementation (meta tags, structured data, sitemap)
- [ ] Mobile responsiveness testing (all pages)
- [ ] Security hardening (RLS, rate limiting, input validation)
- [ ] Testing and QA (unit, integration, e2e)
- [ ] Documentation (user guides, API docs, admin guides)
- [ ] Deployment to Vercel with monitoring

---

## 🎓 CUSTOM GPT CONFIGURATION

### GPT Instructions Template

\`\`\`
You are the Template Generation Academy AI Assistant, an expert in helping users create, score, and improve templates across any domain.

**Your Capabilities**:
1. Guide users through template generation with the 6-criteria scoring system
2. Provide feedback on template quality using the weighted scoring model
3. Help users earn certifications (Bronze, Silver, Gold, Platinum)
4. Recommend training courses and prompt engineering tools
5. Explain reputation system and how to improve scores
6. Assist with marketplace listings and pricing strategies
7. Answer questions about the platform features and workflows

**Your Personality**:
- Professional yet friendly and encouraging
- Detail-oriented and thorough in explanations
- Supportive of learning and improvement
- Objective in scoring and feedback
- Enthusiastic about template quality

**Your Knowledge Base**:
- 6 Generation Criteria (Code Quality 40%, Design 20%, Documentation 15%, Performance 10%, Accessibility 10%, Innovation 5%)
- 4 Certification Levels with requirements
- 16 Expert Personas for prompt engineering
- 12 Prompt Layers for comprehensive prompts
- 8 Prompt Engineering Tools
- Platform features and workflows

**Response Format**:
- Use markdown for formatting
- Provide specific, actionable feedback
- Include examples when helpful
- Reference relevant training materials
- Suggest next steps for improvement

**Constraints**:
- Always be objective and fair in assessments
- Encourage best practices and standards
- Promote accessibility and inclusivity
- Support continuous learning and growth
\`\`\`

### Custom Actions (API Endpoints)

\`\`\`yaml
openapi: 3.0.0
info:
  title: Template Generation Academy API
  version: 1.0.0
servers:
  - url: https://your-domain.vercel.app/api/v1
paths:
  /templates:
    get:
      summary: List templates
      parameters:
        - name: category
          in: query
          schema:
            type: string
        - name: limit
          in: query
          schema:
            type: integer
      responses:
        '200':
          description: List of templates
  /templates/{id}:
    get:
      summary: Get template details
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Template details
  /evaluations:
    post:
      summary: Submit generation
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                template_id:
                  type: string
                scores:
                  type: object
                feedback:
                  type: string
      responses:
        '201':
          description: Generation submitted
\`\`\`

---

## 🎯 SUCCESS METRICS

### User Engagement
- **DAU** (Daily Active Users): Target 1,000+
- **MAU** (Monthly Active Users): Target 10,000+
- **Average Session Duration**: Target 15+ minutes
- **Generation Completion Rate**: Target 80%+
- **Return Rate**: Target 60%+ (7-day)

### Content Quality
- **Average Template Score**: Target 7.5+/10
- **Generation Consistency**: Target 85%+ inter-rater reliability
- **Template Approval Rate**: Target 70%+
- **Dispute Resolution Time**: Target <48 hours

### Business Metrics
- **MRR** (Monthly Recurring Revenue): Track growth
- **CAC** (Customer Acquisition Cost): Optimize <$50
- **LTV** (Lifetime Value): Target >$500
- **Churn Rate**: Target <5% monthly
- **Conversion Rate**: Target 10%+ (free → paid)

### Platform Health
- **Uptime**: Target 99.9%
- **API Response Time**: Target <200ms (p95)
- **Error Rate**: Target <0.1%
- **Core Web Vitals**: All green (LCP <2.5s, FID <100ms, CLS <0.1)

---

## 🔮 FUTURE ENHANCEMENTS

### Roadmap

**Q1: AI-Powered Features**
- Automated generation suggestions using GPT-4
- Smart template recommendations based on ML
- Anomaly detection in scoring patterns
- AI-powered feedback generation
- Predictive analytics for template success

**Q2: Advanced Collaboration**
- Real-time co-generation with WebSocket
- Video conferencing integration (Zoom, Meet)
- Whiteboard for visual annotations
- Shared workspaces for teams
- Version control with branching

**Q3: Mobile Apps**
- iOS native app (Swift/SwiftUI)
- Android native app (Kotlin/Jetpack Compose)
- Offline generation mode
- Push notifications
- Mobile-optimized generation interface

**Q4: Enterprise Features**
- SSO integration (SAML, OAuth)
- Custom branding and white-label
- Advanced permissions and roles
- Audit logs and compliance reports
- Dedicated support and SLAs

**Q5: Internationalization**
- Multi-language support (10+ languages)
- RTL support (Arabic, Hebrew)
- Localized content and training
- Currency conversion for marketplace
- Regional compliance (GDPR, CCPA, etc.)

---

## 📚 DOCUMENTATION STRUCTURE

### For Developers
- **Architecture Overview**: System design, tech stack, data flow
- **API Documentation**: Endpoints, authentication, rate limits, examples
- **Database Schema**: Tables, relationships, RLS policies
- **Component Library**: Shadcn/ui components, custom components, usage
- **Deployment Guide**: Vercel setup, environment variables, CI/CD

### For Users
- **Getting Started**: Account creation, onboarding, first generation
- **Generation Guidelines**: Criteria explanations, scoring tips, best practices
- **Training Materials**: Courses, tutorials, prompt engineering tools
- **FAQ**: Common questions, troubleshooting, support
- **Video Tutorials**: Screen recordings, walkthroughs, demos

### For Administrators
- **Admin Dashboard Guide**: Metrics, moderation, user management
- **Moderation Guidelines**: Content policies, warning system, appeals
- **Analytics Interpretation**: KPIs, trends, actionable insights
- **User Management**: Roles, permissions, bans, deletions

---

## 🎬 CONCLUSION

This golden meta-prompt provides a **complete blueprint** for building a production-ready template generation platform. It combines:

✅ **Exact Replication**: All 51+ pages, 50 components, 22 database tables specified
✅ **Adaptable Framework**: Clear customization points for different domains
✅ **Best Practices**: TypeScript, accessibility, performance, security
✅ **Advanced Techniques**: Lyra, Depth, Chain-of-Thought reasoning
✅ **Enterprise Features**: Marketplace, API, analytics, training
✅ **User Experience**: Mobile-first, accessible, intuitive
✅ **AI Integration**: 16 personas, 12 layers, 8 prompt tools
✅ **Custom GPT Ready**: Instructions, actions, knowledge base

**To Use This Prompt for Custom GPT**:
1. Copy the entire meta-prompt
2. Paste into Custom GPT instructions
3. Configure custom actions (API endpoints)
4. Add knowledge files (documentation, guides)
5. Test with sample queries
6. Refine based on user feedback

**To Build the Platform**:
1. Follow the implementation checklist (8 weeks)
2. Customize for your domain (templates, code, designs, etc.)
3. Deploy to Vercel with Supabase
4. Configure Stripe for payments
5. Launch and iterate based on metrics

**Result**: A fully functional, scalable, production-ready template generation platform with AI-powered features, gamification, and monetization in 8 weeks.

---

## 🔗 QUICK REFERENCE

### Key Technologies
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS v4, Shadcn/ui
- **Backend**: Next.js API Routes, Server Actions, Supabase
- **Database**: PostgreSQL with RLS
- **Auth**: Supabase Auth (Email + OAuth)
- **Payments**: Stripe
- **Deployment**: Vercel

### Key Features
- Template generation with 6-criteria scoring
- Certification system (Bronze, Silver, Gold, Platinum)
- Training with 8 prompt engineering tools
- Marketplace with Stripe integration
- Reputation system (0-1000 points)
- Analytics dashboards
- API and webhooks
- Social features (comments, votes, reactions)

### Key Metrics
- 51+ pages
- 50 components
- 22 database tables
- 16 expert personas
- 12 prompt layers
- 8 prompt tools
- 6 generation criteria
- 4 certification levels

---

*Generated by Template Generation Academy - The Gold Standard in Template Creation Platforms*
*Last Updated: 2025*
*Version: 2.0*
