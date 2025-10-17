# 🏆 GOLDEN META-PROMPT: Template Evaluation Academy
## Universal Replication & Adaptation Framework

---

## 🎯 EXECUTIVE SUMMARY

**Purpose**: Create a comprehensive, production-ready evaluation platform that can assess, score, certify, and monetize any type of digital asset (templates, code, designs, content, etc.) with enterprise-grade features including authentication, training, marketplace, analytics, and social engagement.

**Core Value Proposition**: Transform subjective evaluation into objective, standardized, gamified assessment with certification, reputation systems, and monetization capabilities.

**Target Users**: Evaluators (experts who assess), Submitters (creators who submit), Learners (those seeking certification), Administrators (platform managers)

---

## 📋 CONTEXT ENGINEERING FRAMEWORK

### Meta-Prompt Structure (Using Advanced Techniques)

\`\`\`
[ROLE] You are an expert full-stack architect specializing in Next.js 14+, TypeScript, Supabase, and enterprise SaaS platforms.

[DEPTH] Apply multi-layered reasoning:
- Layer 1: Understand the evaluation domain and user needs
- Layer 2: Design scalable database architecture with RLS
- Layer 3: Implement authentication and authorization flows
- Layer 4: Build evaluation and scoring systems
- Layer 5: Add gamification, training, and monetization
- Layer 6: Optimize for accessibility, performance, and SEO

[LYRA] (Layered Reasoning Architecture):
1. Requirements Analysis → 2. System Design → 3. Database Schema → 4. Authentication → 5. Core Features → 6. Advanced Features → 7. Testing & Optimization

[CHAIN-OF-THOUGHT] For each feature:
- What problem does this solve?
- What are the user flows?
- What data structures are needed?
- What edge cases exist?
- How does this integrate with other features?

[CONSTRAINTS]
- Use Next.js 14+ App Router (no Pages Router)
- TypeScript strict mode only
- Supabase for database and auth
- Shadcn/ui components exclusively
- Tailwind CSS v4 (no custom CSS)
- Mobile-first responsive design
- WCAG 2.1 AA accessibility compliance
- No external state management (use React Server Components)
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
  role TEXT DEFAULT 'user', -- 'user', 'evaluator', 'admin'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**2. templates** (Submission System)
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
  total_evaluations INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

**3. evaluations** (Scoring System)
\`\`\`sql
CREATE TABLE evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES templates(id),
  evaluator_id UUID REFERENCES profiles(id),
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
  requirements JSONB, -- {min_evaluations: 10, min_score: 85}
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
- notifications (Email & In-app)
- comments (Discussion threads)
- template_versions (Version control)
- votes (Community voting)
- tags (Taxonomy system)
- test_results (Automated testing)
- github_repos (GitHub integration)
- api_keys (Developer API)
- webhooks (Event notifications)
- collections (User playlists)
- user_certifications (Training progress)
- courses (Training content)
- disputes (Resolution system)
- reputation_scores (Trust system)
- performance_metrics (Monitoring)
- social_shares (Viral growth)
- recommendations (AI-powered)
- insights (Analytics)
- platform_metrics (Admin analytics)
- usage_analytics (Template tracking)

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

**Responsive Breakpoints**:
- sm: 640px (mobile landscape)
- md: 768px (tablet)
- lg: 1024px (desktop)
- xl: 1280px (large desktop)

**Component Library** (50 components):
- Shadcn/ui: Button, Card, Dialog, Form, Input, Select, Tabs, Alert, Badge, Progress, etc.
- Custom: TemplateCard, EvaluationCriteria, CourseContent, ReputationBadge, etc.

---

## 🔐 AUTHENTICATION SYSTEM

### Implementation Pattern

**1. Supabase Client Setup**:
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

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}
\`\`\`

**4. Auth Pages**:
- `/auth/login` - Email + OAuth (Google, GitHub)
- `/auth/sign-up` - Registration with email confirmation
- `/auth/forgot-password` - Password reset flow
- `/auth/reset-password` - New password entry
- `/auth/callback` - OAuth redirect handler
- `/auth/onboarding` - Post-signup profile setup

---

## 📱 PAGE ARCHITECTURE (51 Pages)

### Public Pages (No Auth Required)
1. `/` - Landing page with hero, features, stats, CTA
2. `/browse` - Template gallery with filters
3. `/templates` - Template listing
4. `/templates/[id]` - Template detail view
5. `/leaderboard` - Top evaluators and templates
6. `/why-join` - Value proposition page
7. `/help` - Help center
8. `/knowledge` - Knowledge base
9. `/tutorials` - Tutorial library

### Protected Pages (Auth Required)
10. `/profile` - User profile dashboard
11. `/profile/settings` - Account settings
12. `/profile/[id]/reputation` - User reputation details
13. `/templates/submit` - Template submission form
14. `/evaluate/[id]` - Evaluation interface
15. `/collections` - User collections
16. `/collections/new` - Create collection
17. `/collections/[id]` - Collection detail
18. `/training` - Training hub
19. `/training/certification` - Certification dashboard
20. `/training/courses/[id]` - Course content
21. `/training/tools` - Prompt engineering tools
22. `/training/tools/prompt-generator` - Universal prompt generator
23. `/marketplace` - Premium templates
24. `/marketplace/dashboard` - Seller dashboard
25. `/disputes` - Dispute management
26. `/disputes/[id]` - Dispute detail
27. `/reputation` - Reputation leaderboard
28. `/recommendations` - Personalized recommendations
29. `/insights` - Evaluation insights
30. `/developer` - API documentation
31. `/library` - Personal template library

### Admin Pages (Admin Role Required)
32. `/admin` - Admin dashboard
33. `/admin/analytics` - Platform analytics

### Template Management Pages
34. `/templates/[id]/update` - Edit template
35. `/templates/[id]/versions` - Version history
36. `/templates/[id]/tests` - Test results
37. `/templates/[id]/performance` - Performance metrics
38. `/templates/[id]/analytics` - Usage analytics
39. `/templates/[id]/embed` - Embeddable widget
40. `/templates/compare` - Side-by-side comparison
41. `/templates/results/[id]` - Evaluation results

### Additional Pages
42. `/analytics` - Personal analytics
43. `/search` - Global search
44. `/compare` - Template comparison tool
45. `/resources` - Resource library
46. `/evaluation-guide` - Evaluation guidelines
47. `/certificate` - Certification display

---

## 🎯 CORE FEATURES (20 Systems)

### 1. Template Submission System
**User Flow**: Submit → Validate → Review → Approve/Reject → Publish
**Components**: TemplateSubmissionForm, FileUpload, TagSelector
**Validation**: Zod schema with URL validation, required fields
**Database**: templates table with status tracking

### 2. Evaluation System
**Criteria** (6 dimensions, 1-10 scale):
- Code Quality (40%)
- Design & UX (20%)
- Documentation (15%)
- Performance (10%)
- Accessibility (10%)
- Innovation (5%)

**User Flow**: Select Template → Review → Score Each Criterion → Add Feedback → Submit
**Components**: EvaluationCriteria, TemplatePreview, ScoreSlider
**Calculation**: Weighted average with minimum 3 evaluations

### 3. Certification System
**Levels**: Bronze → Silver → Gold → Platinum
**Requirements**:
- Bronze: Complete 5 evaluations, 80% accuracy
- Silver: Complete 20 evaluations, 85% accuracy
- Gold: Complete 50 evaluations, 90% accuracy
- Platinum: Complete 100 evaluations, 95% accuracy

**Components**: CertificationBadge, ProgressTracker, CourseContent
**Gamification**: XP points, achievement badges, leaderboards

### 4. Marketplace System
**Pricing Tiers**:
- Free: Browse and view templates
- Pro ($9/month): Download templates, access training
- Enterprise ($29/month): API access, priority support

**Revenue Sharing**: 70% creator, 30% platform
**Payment**: Stripe integration with subscriptions and one-time purchases

### 5. Training System
**Content Types**:
- Interactive courses with quizzes
- Video tutorials
- Prompt engineering tools (8 tools)
- Practice evaluations with feedback

**Tools Included**:
- Chain-of-Thought Builder
- Meta-Prompt Optimizer
- Multi-Framework Generator
- Prompt Quality Checker
- R-I-S-E Framework Generator
- Profession Selector
- Universal Prompt Generator Pro

### 6. Reputation System
**Calculation** (0-1000 points):
- Evaluation Quality: 40% (consistency, thoroughness)
- Template Submissions: 30% (approval rate, ratings)
- Community Contributions: 20% (comments, votes)
- Consistency: 10% (regular activity)

**Levels**: Novice (0-249), Intermediate (250-499), Advanced (500-749), Expert (750-1000)

### 7. Social Features
- Comments and discussions
- Voting (upvote/downvote)
- Reactions (like, love, celebrate)
- Following users and collections
- Social sharing (Twitter, LinkedIn, Facebook)

### 8. Analytics System
**User Analytics**:
- Evaluation trends
- Score distributions
- Time spent evaluating
- Accuracy metrics

**Template Analytics**:
- Views, downloads, forks
- Conversion funnels
- Device breakdown
- Geographic distribution

**Platform Analytics** (Admin):
- User growth
- Template submissions
- Evaluation completion rates
- Revenue metrics

### 9. Search & Discovery
**Features**:
- Full-text search
- Advanced filters (category, tags, score range)
- Sorting (newest, highest rated, most popular)
- AI-powered recommendations

### 10. Collections System
**Features**:
- Create curated collections
- Public/private visibility
- Follow collections
- Featured collections on homepage

### 11. Dispute Resolution
**Process**: Submit Dispute → Assign Peer Review Panel → Review Evidence → Vote → Resolve
**Roles**: Disputer, Reviewers (3), Admin
**Outcomes**: Upheld, Overturned, Partial

### 12. GitHub Integration
**Features**:
- Connect repository
- Auto-sync commits
- Display stars, forks, issues
- Webhook support for updates

### 13. API & Webhooks
**Endpoints**:
- GET /api/v1/templates
- GET /api/v1/templates/:id
- POST /api/v1/evaluations
- GET /api/v1/users/:id

**Authentication**: API key in header
**Rate Limiting**: 100 requests/hour
**Webhooks**: template.created, evaluation.submitted, etc.

### 14. Automated Testing
**Tests**:
- Lighthouse performance audit
- Accessibility scan (WCAG 2.1)
- Security vulnerability check
- Broken link detection
- Code quality analysis

### 15. Performance Monitoring
**Metrics**:
- Core Web Vitals (LCP, FID, CLS)
- Uptime percentage
- Response time
- Error rate

### 16. Template Versioning
**Features**:
- Semantic versioning (1.0.0)
- Changelog generation
- Migration guides
- Rollback capability

### 17. Notification System
**Types**:
- Email notifications
- In-app notifications
- Push notifications (future)

**Events**:
- New evaluation received
- Template approved/rejected
- Certification earned
- Comment reply

### 18. Moderation Dashboard
**Features**:
- Content flagging
- Automated spam detection
- Moderation queue
- User warning system

### 19. Collaborative Evaluation
**Features**:
- Real-time evaluation sessions
- Shared annotations
- Live scoring with consensus
- Session recording

### 20. Community Challenges
**Features**:
- Monthly themed challenges
- Community voting
- Prize pools
- Winner galleries

---

## 🔒 SECURITY & COMPLIANCE

### Row Level Security (RLS) Policies

**Example: Templates Table**
\`\`\`sql
-- Users can view approved templates
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
\`\`\`

### Data Privacy
- PII scrubbing
- GDPR/CCPA compliance
- Right to deletion
- Data retention policies (2 years)

### Authentication Security
- Email verification required
- Password strength requirements
- OAuth with Google and GitHub
- Session management with token refresh

---

## 🎨 ACCESSIBILITY COMPLIANCE

### WCAG 2.1 AA Standards
- Semantic HTML (header, main, nav, article)
- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus indicators (2px outline)
- Color contrast ratios (4.5:1 minimum)
- Alternative text for images
- Screen reader compatibility
- No reliance on color alone

### Mobile Accessibility
- Touch targets minimum 44x44px
- Responsive typography (16px base)
- Pinch-to-zoom enabled
- Landscape orientation support

---

## 📊 PERFORMANCE OPTIMIZATION

### Core Web Vitals Targets
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

### Optimization Techniques
- Image optimization with Next.js Image
- Code splitting with dynamic imports
- Server-side rendering for SEO
- Static generation where possible
- Database query optimization (no N+1)
- CDN for static assets
- Lazy loading for images and components

---

## 🚀 DEPLOYMENT & INFRASTRUCTURE

### Vercel Deployment
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Environment Variables Required:
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
\`\`\`

### Database Setup
\`\`\`bash
# Run migrations in order
psql -f scripts/001_create_tables.sql
psql -f scripts/002_create_profile_trigger.sql
# ... continue through all 22 scripts
\`\`\`

---

## 🔄 ADAPTATION FRAMEWORK

### How to Adapt for Different Domains

**Example 1: Code Review Platform**
- Replace "templates" with "code_submissions"
- Evaluation criteria: Code Quality, Test Coverage, Documentation, Security, Performance
- Add: Pull request integration, CI/CD pipeline, code diff viewer

**Example 2: Design Critique Platform**
- Replace "templates" with "design_submissions"
- Evaluation criteria: Visual Design, UX, Accessibility, Brand Consistency, Innovation
- Add: Figma integration, design system checker, color palette analyzer

**Example 3: Content Moderation Platform**
- Replace "templates" with "content_submissions"
- Evaluation criteria: Accuracy, Tone, Grammar, SEO, Engagement
- Add: Plagiarism detection, readability scores, keyword analysis

### Customization Points
1. **Domain Model**: Change entity names (templates → submissions)
2. **Evaluation Criteria**: Define domain-specific scoring dimensions
3. **Integrations**: Add domain-specific tools (GitHub, Figma, CMS)
4. **Training Content**: Create domain-specific courses and certifications
5. **Marketplace**: Adjust pricing and revenue models

---

## 📝 IMPLEMENTATION CHECKLIST

### Phase 1: Foundation (Week 1-2)
- [ ] Set up Next.js 14 project with TypeScript
- [ ] Configure Tailwind CSS v4
- [ ] Install Shadcn/ui components
- [ ] Set up Supabase project
- [ ] Create database schema (22 tables)
- [ ] Implement authentication system
- [ ] Build landing page

### Phase 2: Core Features (Week 3-4)
- [ ] Template submission system
- [ ] Evaluation interface
- [ ] User profiles
- [ ] Admin dashboard
- [ ] Search and filtering
- [ ] Comments and discussions

### Phase 3: Advanced Features (Week 5-6)
- [ ] Certification system
- [ ] Training courses
- [ ] Marketplace integration
- [ ] Reputation system
- [ ] Analytics dashboards
- [ ] API and webhooks

### Phase 4: Optimization (Week 7-8)
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] SEO implementation
- [ ] Mobile responsiveness
- [ ] Security hardening
- [ ] Testing and QA

---

## 🎓 PROMPT ENGINEERING INTEGRATION

### 16 Personas Available
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

### 12 Prompt Layers
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

---

## 🎯 SUCCESS METRICS

### User Engagement
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Average session duration
- Evaluation completion rate

### Content Quality
- Average template score
- Evaluation consistency (inter-rater reliability)
- Template approval rate
- Dispute resolution time

### Business Metrics
- Monthly Recurring Revenue (MRR)
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- Churn rate

### Platform Health
- Uptime percentage (99.9% target)
- API response time (< 200ms)
- Error rate (< 0.1%)
- Core Web Vitals scores

---

## 🔮 FUTURE ENHANCEMENTS

### Roadmap
1. **AI-Powered Features**
   - Automated evaluation suggestions
   - Smart template recommendations
   - Anomaly detection in scoring

2. **Advanced Collaboration**
   - Real-time co-evaluation
   - Video conferencing integration
   - Whiteboard for annotations

3. **Mobile Apps**
   - iOS native app
   - Android native app
   - Offline evaluation mode

4. **Enterprise Features**
   - SSO integration
   - Custom branding
   - Advanced permissions
   - Audit logs

5. **Internationalization**
   - Multi-language support (10+ languages)
   - RTL support
   - Localized content

---

## 📚 DOCUMENTATION STRUCTURE

### For Developers
- Architecture overview
- API documentation
- Database schema reference
- Component library
- Deployment guide

### For Users
- Getting started guide
- Evaluation guidelines
- Training materials
- FAQ
- Video tutorials

### For Administrators
- Admin dashboard guide
- Moderation guidelines
- Analytics interpretation
- User management

---

## 🎬 CONCLUSION

This golden meta-prompt provides a complete blueprint for building a production-ready evaluation platform. It combines:

✅ **Exact Replication**: All 51 pages, 50 components, 22 database tables specified
✅ **Adaptable Framework**: Clear customization points for different domains
✅ **Best Practices**: TypeScript, accessibility, performance, security
✅ **Advanced Techniques**: Lyra, Depth, Chain-of-Thought reasoning
✅ **Enterprise Features**: Marketplace, API, analytics, training
✅ **User Experience**: Mobile-first, accessible, intuitive

**To Use This Prompt**:
1. Copy the entire meta-prompt
2. Specify your domain (templates, code, designs, content, etc.)
3. Customize evaluation criteria for your domain
4. Follow the implementation checklist
5. Deploy to Vercel with Supabase

**Result**: A fully functional, scalable, production-ready evaluation platform in 8 weeks.

---

*Generated by Template Evaluation Academy - The Gold Standard in Assessment Platforms*
