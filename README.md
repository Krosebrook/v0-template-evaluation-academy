# Template Evaluation Academy

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/flash-fusion/v0-template-evaluation-academy)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/SQmhxp8xG5F)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

A comprehensive full-stack platform for template generation, evaluation, certification, and marketplace. Built with modern web technologies and best practices.

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.x or higher ([Download](https://nodejs.org/))
- **pnpm** 10.x or higher (Install: `npm install -g pnpm@10`)
- **Git** ([Download](https://git-scm.com/))

**Required Accounts:**
- [Supabase](https://supabase.com/) - For database and authentication
- [Stripe](https://stripe.com/) - For payment processing (optional for basic setup)
- [Vercel](https://vercel.com/) - For deployment (optional for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Krosebrook/v0-template-evaluation-academy.git
   cd v0-template-evaluation-academy
   ```

2. **Install dependencies**
   ```bash
   npm install -g pnpm@10
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your actual values. See [Environment Setup](#-environment-setup) for details.

4. **Set up the database**
   
   Run the SQL migrations in the `scripts/` directory in your Supabase dashboard:
   ```bash
   # In Supabase SQL Editor, run scripts in order:
   # 001_create_tables.sql
   # 002_create_profile_trigger.sql
   # ... (continue with all numbered scripts)
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
v0-template-evaluation-academy/
├── app/                      # Next.js App Router pages and API routes
│   ├── (auth)/              # Authentication routes (login, signup, etc.)
│   ├── actions/             # Server Actions for data mutations
│   ├── api/                 # API route handlers
│   ├── admin/               # Admin dashboard pages
│   ├── marketplace/         # Marketplace features
│   ├── training/            # Learning and certification
│   └── ...                  # Other feature pages
├── components/              # React components
│   ├── ui/                  # Shadcn/ui base components
│   ├── dashboard/           # Dashboard-specific components
│   └── ...                  # Feature-specific components
├── lib/                     # Utility libraries and helpers
│   ├── supabase/           # Supabase client configuration
│   ├── stripe/             # Stripe integration
│   ├── ai/                 # AI-powered features
│   ├── analytics/          # Analytics utilities
│   └── utils.ts            # General utilities
├── types/                   # TypeScript type definitions
│   ├── database.ts         # Database types (auto-generated)
│   └── components.ts       # Component prop types
├── scripts/                 # Database migrations and utilities
│   ├── 001_create_tables.sql
│   └── ...                  # Progressive SQL migrations
├── public/                  # Static assets (images, fonts, etc.)
├── styles/                  # Global styles
├── hooks/                   # Custom React hooks
├── middleware.ts            # Next.js middleware (auth, etc.)
├── next.config.mjs         # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

---

## 🛠️ Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server on port 3000 |
| `pnpm build` | Build production bundle |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint to check code quality |
| `pnpm format` | Format code with Prettier (when configured) |
| `pnpm test` | Run tests (when configured) |

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, documented code
   - Follow TypeScript best practices
   - Use existing components from `components/ui/`

3. **Test your changes**
   ```bash
   pnpm lint
   pnpm build  # Ensure it builds successfully
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```
   
   Follow [Conventional Commits](https://www.conventionalcommits.org/)

5. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

---

## 🔧 Environment Setup

### Required Environment Variables

Create a `.env.local` file with the following variables:

#### Supabase (Required)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Get these from your [Supabase Dashboard](https://app.supabase.com/) → Settings → API

#### Stripe (Required for payments)
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Get test keys from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)

#### Application
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

See `.env.example` for complete configuration options.

---

## 🗄️ Database Setup

### Using Supabase Dashboard

1. **Create a Supabase project**
   - Go to [supabase.com](https://supabase.com/)
   - Create a new project
   - Wait for setup to complete

2. **Run migrations**
   - Navigate to SQL Editor in Supabase Dashboard
   - Run each script from `scripts/` directory in numerical order
   - Start with `001_create_tables.sql`
   - Continue through all migration files

3. **Verify setup**
   - Check that tables are created in the Table Editor
   - Verify RLS policies are in place

### Local Supabase (Advanced)

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize local Supabase
supabase init

# Start local instance
supabase start

# Apply migrations
supabase db push
```

---

## 🧪 Testing

Testing infrastructure is planned. See [ROADMAP.md](./ROADMAP.md) for details.

Planned testing stack:
- **Unit Tests:** Jest + React Testing Library
- **E2E Tests:** Playwright
- **Component Tests:** Storybook

---

## 🚢 Deployment

### Deploying to Vercel (Recommended)

1. **Push your code to GitHub**

2. **Import project to Vercel**
   - Go to [vercel.com](https://vercel.com/)
   - Click "Import Project"
   - Select your repository
   - Add environment variables (from `.env.local`)
   - Deploy!

3. **Configure Stripe Webhooks**
   - Add Vercel deployment URL to Stripe webhooks
   - Update `STRIPE_WEBHOOK_SECRET` in Vercel environment variables

### Manual Deployment

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

---

## 📚 Documentation

- **[AUDIT.md](./AUDIT.md)** - Comprehensive repository audit and analysis
- **[OPTIMIZATION_PLAN.md](./OPTIMIZATION_PLAN.md)** - Detailed optimization strategy
- **[ROADMAP.md](./ROADMAP.md)** - Development roadmap with phases and milestones
- **[ACTION_PLAN.md](./ACTION_PLAN.md)** - Step-by-step implementation guide
- **[COMPLETE_SYSTEM_SPECIFICATION.md](./COMPLETE_SYSTEM_SPECIFICATION.md)** - Full system specification
- **[GOLDEN_META_PROMPT.md](./GOLDEN_META_PROMPT.md)** - AI agent context

---

## 🏗️ Technology Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5
- **UI Library:** React 19
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui (Radix UI primitives)
- **Icons:** Lucide React

### Backend
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **API:** Next.js Server Actions + API Routes
- **Payments:** Stripe
- **Caching:** Upstash Redis

### DevOps
- **Hosting:** Vercel
- **Analytics:** Vercel Analytics
- **Monitoring:** (Planned - see ROADMAP.md)
- **Error Tracking:** (Planned - see ROADMAP.md)

---

## 🎯 Key Features

- ✅ **Template Management** - Create, submit, and version templates
- ✅ **Evaluation System** - Multi-criteria scoring and calibration
- ✅ **Gamification** - XP, levels, badges, and achievements
- ✅ **Marketplace** - Buy and sell templates with Stripe
- ✅ **Learning Platform** - Courses, quizzes, and certifications
- ✅ **Social Features** - Comments, reactions, collections
- ✅ **Analytics** - Comprehensive performance tracking
- ✅ **Admin Dashboard** - Moderation and analytics
- ✅ **API Access** - Programmatic template management

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

**Before contributing:**
1. Read the [Code of Conduct](./CONTRIBUTING.md#code-of-conduct)
2. Check existing [issues](https://github.com/Krosebrook/v0-template-evaluation-academy/issues)
3. Follow the [development workflow](#development-workflow)

---

## 🐛 Troubleshooting

### Common Issues

**Build fails with TypeScript errors**
```bash
# Clear Next.js cache
rm -rf .next
pnpm build
```

**Database connection fails**
- Verify Supabase environment variables in `.env.local`
- Check Supabase project status
- Ensure RLS policies are configured

**Stripe webhooks not working**
- Verify webhook URL in Stripe dashboard
- Check webhook secret matches environment variable
- Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

**Port 3000 already in use**
```bash
# Use a different port
pnpm dev -- -p 3001
```

### Getting Help

- 📖 Check [documentation](./COMPLETE_SYSTEM_SPECIFICATION.md)
- 🐛 [Open an issue](https://github.com/Krosebrook/v0-template-evaluation-academy/issues/new)
- 💬 Ask in discussions

---

## 📊 Project Status

**Current Phase:** Foundation & Documentation ✅  
**Next Phase:** Quality Infrastructure  
**Overall Progress:** See [ROADMAP.md](./ROADMAP.md)

### Recent Updates
- ✅ Initial project structure
- ✅ Comprehensive documentation added
- ✅ Environment configuration template
- 🚧 Testing infrastructure (planned)
- 🚧 CI/CD pipeline (planned)

---

## 📄 License

[Your License Here]

---

## 🔗 Links

- **Live Demo:** [https://vercel.com/flash-fusion/v0-template-evaluation-academy](https://vercel.com/flash-fusion/v0-template-evaluation-academy)
- **v0.app Project:** [https://v0.app/chat/projects/SQmhxp8xG5F](https://v0.app/chat/projects/SQmhxp8xG5F)
- **Documentation:** See docs above
- **Issues:** [GitHub Issues](https://github.com/Krosebrook/v0-template-evaluation-academy/issues)

---

## 🙏 Acknowledgments

- Built with [v0.app](https://v0.app)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Powered by [Supabase](https://supabase.com/)
- Deployed on [Vercel](https://vercel.com/)

---

**Built with ❤️ by the Template Evaluation Academy team**
