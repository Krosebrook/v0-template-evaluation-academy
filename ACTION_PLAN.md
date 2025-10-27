# Action Plan
## Template Evaluation Academy - Implementation Guide

**Version:** 1.0  
**Created:** October 27, 2025  
**Status:** 🟢 Ready for Execution

---

## Overview

This document provides a **step-by-step implementation guide** for executing the optimization roadmap. Each action is designed to be completed independently with clear inputs, outputs, and verification steps.

---

## Quick Start Guide

### For Immediate Implementation (Today)

```bash
# 1. Clone and setup
git clone <repository-url>
cd v0-template-evaluation-academy
npm install -g pnpm@10
pnpm install

# 2. Create environment file
cp .env.example .env.local
# Edit .env.local with your values

# 3. Run development server
pnpm dev
```

---

## Phase 0: Foundation - Week 1

### Action 0.1: Create .env.example File

**Priority:** 🔴 Critical  
**Estimated Time:** 30 minutes  
**Owner:** DevOps / Any Developer

#### Steps:

1. **Identify all environment variables**
   ```bash
   # Search codebase for process.env usage
   grep -r "process\.env\." app lib components --include="*.ts" --include="*.tsx" | \
     grep -o "process\.env\.[A-Z_]*" | \
     sort -u > env-vars.txt
   ```

2. **Create .env.example file**
   ```bash
   touch .env.example
   ```

3. **Add variables with descriptions**
   ```bash
   # .env.example
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

   # Stripe Configuration
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...

   # Upstash Redis
   UPSTASH_REDIS_REST_URL=https://...
   UPSTASH_REDIS_REST_TOKEN=...

   # GitHub OAuth
   GITHUB_CLIENT_ID=...
   GITHUB_CLIENT_SECRET=...

   # Application
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NODE_ENV=development

   # Optional: Error Tracking
   NEXT_PUBLIC_SENTRY_DSN=...
   SENTRY_ORG=...
   SENTRY_PROJECT=...
   ```

4. **Update .gitignore**
   ```bash
   # Add to .gitignore if not already present
   echo ".env*.local" >> .gitignore
   echo ".env" >> .gitignore
   ```

5. **Create local example**
   ```bash
   cp .env.example .env.local
   echo "Edit .env.local with your actual values"
   ```

#### Verification:
```bash
# Ensure .env.example is tracked
git add .env.example

# Ensure .env.local is NOT tracked
git status | grep -q ".env.local" && echo "ERROR: .env.local should not be tracked" || echo "✅ Correct"
```

#### Deliverables:
- ✅ `.env.example` file with all variables
- ✅ Each variable documented
- ✅ `.gitignore` updated
- ✅ Local environment setup instructions

---

### Action 0.2: Enhance README.md

**Priority:** 🔴 Critical  
**Estimated Time:** 2-3 hours  
**Owner:** Tech Lead

#### Steps:

1. **Backup current README**
   ```bash
   cp README.md README.old.md
   ```

2. **Create new structure**
   Use the following template:

   ```markdown
   # Template Evaluation Academy

   A comprehensive platform for template generation, evaluation, and marketplace.

   ## 🚀 Quick Start

   ### Prerequisites
   - Node.js 20.x
   - pnpm 10.x
   - Supabase account
   - Stripe account (for payments)

   ### Installation

   1. Clone the repository
   ```bash
   git clone https://github.com/Krosebrook/v0-template-evaluation-academy.git
   cd v0-template-evaluation-academy
   ```

   2. Install dependencies
   ```bash
   npm install -g pnpm@10
   pnpm install
   ```

   3. Set up environment
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

   4. Set up database
   ```bash
   # Run migrations (see Database Setup below)
   ```

   5. Run development server
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

   ## 📁 Project Structure

   ```
   /app              - Next.js App Router pages & API routes
   /components       - React components
   /lib              - Utility libraries
   /types            - TypeScript type definitions
   /scripts          - Database migrations and utilities
   /public           - Static assets
   ```

   ## 🗄️ Database Setup

   [Database setup instructions]

   ## 🛠️ Development

   ### Available Scripts

   - `pnpm dev` - Start development server
   - `pnpm build` - Build for production
   - `pnpm start` - Start production server
   - `pnpm lint` - Run ESLint
   - `pnpm test` - Run tests (when implemented)

   ### Development Workflow

   1. Create feature branch
   2. Make changes
   3. Run lint and tests
   4. Submit PR
   5. Code review
   6. Merge

   ## 🧪 Testing

   [Testing instructions]

   ## 🚢 Deployment

   Deployed on Vercel: [link]

   ## 📚 Documentation

   - [Architecture](./ARCHITECTURE.md)
   - [API Documentation](./docs/api.md)
   - [Contributing](./CONTRIBUTING.md)
   - [Roadmap](./ROADMAP.md)

   ## 🤝 Contributing

   See [CONTRIBUTING.md](./CONTRIBUTING.md)

   ## 📄 License

   [Your license]

   ## 🔗 Links

   - [Live Demo](https://...)
   - [Documentation](https://...)
   - [Issues](https://github.com/Krosebrook/v0-template-evaluation-academy/issues)
   ```

3. **Commit changes**
   ```bash
   git add README.md
   git commit -m "docs: enhance README with comprehensive setup guide"
   ```

#### Verification:
- [ ] All prerequisites listed
- [ ] Setup steps are clear
- [ ] Project structure explained
- [ ] Links to other docs work

---

### Action 0.3: Create CONTRIBUTING.md

**Priority:** 🟡 High  
**Estimated Time:** 2 hours  
**Owner:** Tech Lead

#### Template:

```markdown
# Contributing to Template Evaluation Academy

Thank you for your interest in contributing! 

## Code of Conduct

Be respectful, inclusive, and professional.

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Submit a pull request

## Development Setup

See [README.md](./README.md#installation)

## Coding Standards

### TypeScript
- Use strict mode
- Avoid `any` types
- Document complex types

### React
- Use functional components
- Use hooks appropriately
- Keep components small and focused

### Naming Conventions
- Components: PascalCase
- Files: kebab-case
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE

### Code Style
- Use Prettier for formatting
- Follow ESLint rules
- Write self-documenting code
- Add comments for complex logic

## Commit Messages

Follow Conventional Commits:

```
feat: add new feature
fix: fix bug
docs: update documentation
style: format code
refactor: refactor code
test: add tests
chore: update dependencies
```

## Pull Request Process

1. Update documentation
2. Add tests
3. Ensure all tests pass
4. Update CHANGELOG
5. Request review
6. Address feedback
7. Squash commits (if requested)

## Testing

- Write unit tests for utilities
- Write component tests
- Write integration tests for APIs
- Maintain >80% coverage

## Questions?

Open an issue or contact the maintainers.
```

---

### Action 0.4: Resolve Dependency Conflicts

**Priority:** 🔴 Critical  
**Estimated Time:** 1-2 hours  
**Owner:** Tech Lead

#### Option A: Upgrade Next.js to 15 (Recommended)

```bash
# Check Next.js 15 compatibility
pnpm add next@latest

# Test build
pnpm build

# If successful, commit
git add package.json pnpm-lock.yaml
git commit -m "chore: upgrade Next.js to 15 for React 19 compatibility"
```

#### Option B: Downgrade React to 18

```bash
# Downgrade React
pnpm add react@^18.2.0 react-dom@^18.2.0

# Test build
pnpm build

# If successful, commit
git add package.json pnpm-lock.yaml
git commit -m "chore: downgrade React to 18 for Next.js 14 compatibility"
```

#### Verification:
```bash
# Should show no peer dependency warnings
pnpm install 2>&1 | grep -i "peer dependencies" || echo "✅ No warnings"

# Should build successfully
pnpm build && echo "✅ Build successful"
```

---

### Action 0.5: Remove Deprecated Dependencies

**Priority:** 🟡 High  
**Estimated Time:** 30 minutes

#### Steps:

1. **Remove crypto package** (built into Node.js)
   ```bash
   pnpm remove crypto
   ```

2. **Update ESLint to v9** (if compatible)
   ```bash
   pnpm add -D eslint@^9
   ```

3. **Verify no usage of deprecated packages**
   ```bash
   pnpm outdated
   ```

4. **Commit changes**
   ```bash
   git add package.json pnpm-lock.yaml
   git commit -m "chore: remove deprecated dependencies"
   ```

---

## Phase 1: Quality Infrastructure - Weeks 2-4

### Action 1.1: Setup Jest Testing

**Priority:** 🔴 Critical  
**Estimated Time:** 4 hours  
**Owner:** QA Lead

#### Steps:

1. **Install dependencies**
   ```bash
   pnpm add -D jest @testing-library/react @testing-library/jest-dom \
     @testing-library/user-event jest-environment-jsdom \
     @types/jest ts-node
   ```

2. **Create jest.config.js**
   ```javascript
   const nextJest = require('next/jest')

   const createJestConfig = nextJest({
     dir: './',
   })

   const customJestConfig = {
     setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
     testEnvironment: 'jest-environment-jsdom',
     moduleNameMapper: {
       '^@/(.*)$': '<rootDir>/$1',
     },
     collectCoverageFrom: [
       'app/**/*.{js,jsx,ts,tsx}',
       'components/**/*.{js,jsx,ts,tsx}',
       'lib/**/*.{js,jsx,ts,tsx}',
       '!**/*.d.ts',
       '!**/node_modules/**',
       '!**/.next/**',
     ],
     coverageThreshold: {
       global: {
         branches: 80,
         functions: 80,
         lines: 80,
         statements: 80,
       },
     },
   }

   module.exports = createJestConfig(customJestConfig)
   ```

3. **Create jest.setup.js**
   ```javascript
   import '@testing-library/jest-dom'
   ```

4. **Create example test**
   ```typescript
   // __tests__/example.test.tsx
   import { render, screen } from '@testing-library/react'
   import '@testing-library/jest-dom'

   describe('Example Test', () => {
     it('should pass', () => {
       expect(true).toBe(true)
     })
   })
   ```

5. **Add test scripts**
   ```json
   {
     "scripts": {
       "test": "jest",
       "test:watch": "jest --watch",
       "test:coverage": "jest --coverage"
     }
   }
   ```

6. **Run tests**
   ```bash
   pnpm test
   ```

7. **Commit**
   ```bash
   git add .
   git commit -m "test: add Jest testing infrastructure"
   ```

#### Verification:
- [ ] Tests run successfully
- [ ] Coverage reports generated
- [ ] Example test passes

---

### Action 1.2: Setup Prettier

**Priority:** 🟡 High  
**Estimated Time:** 1 hour

#### Steps:

1. **Install Prettier**
   ```bash
   pnpm add -D prettier eslint-config-prettier eslint-plugin-prettier
   ```

2. **Create .prettierrc**
   ```json
   {
     "semi": false,
     "singleQuote": true,
     "tabWidth": 2,
     "trailingComma": "es5",
     "printWidth": 100,
     "arrowParens": "always",
     "endOfLine": "lf"
   }
   ```

3. **Create .prettierignore**
   ```
   node_modules
   .next
   out
   build
   dist
   coverage
   pnpm-lock.yaml
   *.min.js
   ```

4. **Update .eslintrc.json**
   ```json
   {
     "extends": ["next/core-web-vitals", "prettier"],
     "plugins": ["prettier"],
     "rules": {
       "prettier/prettier": "error"
     }
   }
   ```

5. **Add format scripts**
   ```json
   {
     "scripts": {
       "format": "prettier --write .",
       "format:check": "prettier --check ."
     }
   }
   ```

6. **Format codebase**
   ```bash
   pnpm format
   ```

7. **Commit**
   ```bash
   git add .
   git commit -m "style: add Prettier formatting"
   ```

---

### Action 1.3: Setup Pre-commit Hooks

**Priority:** 🟡 High  
**Estimated Time:** 2 hours

#### Steps:

1. **Install Husky and lint-staged**
   ```bash
   pnpm add -D husky lint-staged
   ```

2. **Initialize Husky**
   ```bash
   pnpm exec husky init
   ```

3. **Configure lint-staged in package.json**
   ```json
   {
     "lint-staged": {
       "*.{ts,tsx}": [
         "eslint --fix",
         "prettier --write",
         "jest --bail --findRelatedTests"
       ],
       "*.{json,md,yml,yaml}": [
         "prettier --write"
       ]
     }
   }
   ```

4. **Create pre-commit hook**
   ```bash
   echo "pnpm lint-staged" > .husky/pre-commit
   chmod +x .husky/pre-commit
   ```

5. **Create commit-msg hook**
   ```bash
   # Install commitlint
   pnpm add -D @commitlint/cli @commitlint/config-conventional

   # Create commitlint.config.js
   echo "module.exports = { extends: ['@commitlint/config-conventional'] }" > commitlint.config.js

   # Create commit-msg hook
   echo "pnpm commitlint --edit \$1" > .husky/commit-msg
   chmod +x .husky/commit-msg
   ```

6. **Test hooks**
   ```bash
   # Make a change
   echo "// test" >> lib/utils.ts

   # Try to commit
   git add lib/utils.ts
   git commit -m "test commit"
   # Should run lint-staged
   ```

7. **Commit**
   ```bash
   git add .
   git commit -m "chore: add pre-commit hooks with Husky and lint-staged"
   ```

---

### Action 1.4: Setup Sentry Error Tracking

**Priority:** 🟡 High  
**Estimated Time:** 3 hours

#### Steps:

1. **Create Sentry account and project**
   - Go to sentry.io
   - Create account/login
   - Create new project (Next.js)
   - Get DSN

2. **Install Sentry**
   ```bash
   pnpm add @sentry/nextjs
   ```

3. **Run Sentry wizard**
   ```bash
   pnpm dlx @sentry/wizard@latest -i nextjs
   ```

4. **Add environment variables**
   ```bash
   # Add to .env.local
   NEXT_PUBLIC_SENTRY_DSN=your-dsn
   SENTRY_ORG=your-org
   SENTRY_PROJECT=your-project
   SENTRY_AUTH_TOKEN=your-auth-token
   ```

5. **Update .env.example**
   ```bash
   # Add Sentry variables to .env.example
   ```

6. **Test error tracking**
   ```typescript
   // Create test page: app/sentry-test/page.tsx
   'use client'
   
   export default function SentryTest() {
     return (
       <button onClick={() => {throw new Error('Sentry Test Error')}}>
         Trigger Error
       </button>
     )
   }
   ```

7. **Verify in Sentry dashboard**

8. **Commit**
   ```bash
   git add .
   git commit -m "feat: add Sentry error tracking"
   ```

---

### Action 1.5: Add Security Headers

**Priority:** 🔴 Critical  
**Estimated Time:** 2 hours

#### Steps:

1. **Update next.config.mjs**
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     async headers() {
       return [
         {
           source: '/:path*',
           headers: [
             {
               key: 'X-DNS-Prefetch-Control',
               value: 'on'
             },
             {
               key: 'Strict-Transport-Security',
               value: 'max-age=63072000; includeSubDomains; preload'
             },
             {
               key: 'X-Frame-Options',
               value: 'SAMEORIGIN'
             },
             {
               key: 'X-Content-Type-Options',
               value: 'nosniff'
             },
             {
               key: 'X-XSS-Protection',
               value: '1; mode=block'
             },
             {
               key: 'Referrer-Policy',
               value: 'origin-when-cross-origin'
             },
             {
               key: 'Permissions-Policy',
               value: 'camera=(), microphone=(), geolocation=()'
             }
           ],
         },
       ]
     },
   }

   export default nextConfig
   ```

2. **Test headers**
   ```bash
   pnpm dev
   # Use browser DevTools Network tab to verify headers
   ```

3. **Test with online tool**
   - Deploy to preview
   - Test at securityheaders.com

4. **Commit**
   ```bash
   git add next.config.mjs
   git commit -m "security: add security headers"
   ```

---

## Phase 2: Developer Experience - Weeks 5-8

### Action 2.1: Create GitHub Actions Workflow

**Priority:** 🟡 High  
**Estimated Time:** 3 hours

#### Steps:

1. **Create .github/workflows directory**
   ```bash
   mkdir -p .github/workflows
   ```

2. **Create PR validation workflow**
   ```yaml
   # .github/workflows/pr.yml
   name: PR Validation

   on:
     pull_request:
       branches: [main, develop]

   jobs:
     validate:
       runs-on: ubuntu-latest
       
       steps:
         - uses: actions/checkout@v4
         
         - name: Setup Node.js
           uses: actions/setup-node@v4
           with:
             node-version: '20'
             
         - name: Setup pnpm
           uses: pnpm/action-setup@v2
           with:
             version: 10
             
         - name: Get pnpm store directory
           id: pnpm-cache
           shell: bash
           run: |
             echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT
             
         - name: Setup pnpm cache
           uses: actions/cache@v3
           with:
             path: ${{ steps.pnpm-cache.outputs.STORE_PATH }}
             key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
             restore-keys: |
               ${{ runner.os }}-pnpm-store-
               
         - name: Install dependencies
           run: pnpm install
           
         - name: Lint
           run: pnpm lint
           
         - name: Type check
           run: pnpm tsc --noEmit
           
         - name: Run tests
           run: pnpm test
           
         - name: Build
           run: pnpm build
           
         - name: Upload coverage
           uses: codecov/codecov-action@v3
           if: always()
   ```

3. **Create deployment workflow**
   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy to Vercel

   on:
     push:
       branches: [main]

   jobs:
     deploy:
       runs-on: ubuntu-latest
       
       steps:
         - uses: actions/checkout@v4
         
         - name: Deploy to Vercel
           uses: amondnet/vercel-action@v25
           with:
             vercel-token: ${{ secrets.VERCEL_TOKEN }}
             vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
             vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
   ```

4. **Add secrets to GitHub**
   - Go to repository settings
   - Add VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID

5. **Test workflows**
   - Create test PR
   - Verify workflows run

6. **Commit**
   ```bash
   git add .github/workflows
   git commit -m "ci: add GitHub Actions workflows"
   ```

---

### Action 2.2: Add Bundle Analyzer

**Priority:** 🟢 Medium  
**Estimated Time:** 1 hour

#### Steps:

1. **Install bundle analyzer**
   ```bash
   pnpm add -D @next/bundle-analyzer
   ```

2. **Update next.config.mjs**
   ```javascript
   const withBundleAnalyzer = require('@next/bundle-analyzer')({
     enabled: process.env.ANALYZE === 'true',
   })

   module.exports = withBundleAnalyzer({
     // your existing config
   })
   ```

3. **Add script**
   ```json
   {
     "scripts": {
       "analyze": "ANALYZE=true pnpm build"
     }
   }
   ```

4. **Run analysis**
   ```bash
   pnpm analyze
   ```

5. **Review and optimize**

6. **Commit**
   ```bash
   git add .
   git commit -m "feat: add bundle analyzer"
   ```

---

## Execution Checklist

### Week 1 - Foundation
- [ ] Action 0.1: Create .env.example
- [ ] Action 0.2: Enhance README
- [ ] Action 0.3: Create CONTRIBUTING.md
- [ ] Action 0.4: Resolve dependencies
- [ ] Action 0.5: Remove deprecated packages

### Weeks 2-4 - Quality
- [ ] Action 1.1: Setup Jest
- [ ] Action 1.2: Setup Prettier
- [ ] Action 1.3: Setup pre-commit hooks
- [ ] Action 1.4: Setup Sentry
- [ ] Action 1.5: Add security headers
- [ ] Write component tests
- [ ] Write API tests

### Weeks 5-8 - DevEx
- [ ] Action 2.1: GitHub Actions
- [ ] Action 2.2: Bundle analyzer
- [ ] Setup Storybook
- [ ] Database tooling
- [ ] Performance monitoring

### Weeks 9-12 - Production
- [ ] Security audit
- [ ] Performance optimization
- [ ] API documentation
- [ ] E2E tests

### Weeks 13-16 - Polish
- [ ] Accessibility audit
- [ ] PWA features
- [ ] i18n
- [ ] Final review

---

## Quick Reference Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Quality
pnpm lint             # Run linter
pnpm format           # Format code
pnpm test             # Run tests
pnpm test:coverage    # Run tests with coverage

# Analysis
pnpm analyze          # Analyze bundle size

# Database
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed database
pnpm db:reset         # Reset database
```

---

## Success Criteria

After completing all actions:

- ✅ Clean setup process (<15 minutes)
- ✅ >80% test coverage
- ✅ Zero ESLint errors
- ✅ A+ security rating
- ✅ Lighthouse score >90
- ✅ Automated CI/CD
- ✅ Comprehensive documentation
- ✅ Production ready

---

## Need Help?

- Check [ROADMAP.md](./ROADMAP.md) for context
- Check [OPTIMIZATION_PLAN.md](./OPTIMIZATION_PLAN.md) for details
- Open an issue for questions
- Contact the tech lead

**Let's build! 🚀**
