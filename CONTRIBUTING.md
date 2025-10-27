# Contributing to Template Evaluation Academy

Thank you for your interest in contributing to the Template Evaluation Academy! This document provides guidelines and instructions for contributing to the project.

---

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Harassment, trolling, or derogatory comments
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

---

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:
- Node.js 20.x or higher
- pnpm 10.x or higher
- Git installed and configured
- A GitHub account
- Basic knowledge of TypeScript, React, and Next.js

### Setting Up Your Development Environment

1. **Fork the repository**
   - Click the "Fork" button on GitHub
   - Clone your fork locally:
     ```bash
     git clone https://github.com/YOUR_USERNAME/v0-template-evaluation-academy.git
     cd v0-template-evaluation-academy
     ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/Krosebrook/v0-template-evaluation-academy.git
   ```

3. **Install dependencies**
   ```bash
   npm install -g pnpm@10
   pnpm install
   ```

4. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

5. **Verify setup**
   ```bash
   pnpm dev
   # Open http://localhost:3000
   ```

---

## 🔄 Contribution Workflow

### 1. Find or Create an Issue

- Browse [existing issues](https://github.com/Krosebrook/v0-template-evaluation-academy/issues)
- Comment on an issue to claim it
- Or create a new issue for your proposed change
- Wait for approval before starting work on large changes

### 2. Create a Branch

```bash
# Update your fork
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

### 3. Make Your Changes

Follow our [coding standards](#-coding-standards) and keep commits focused.

### 4. Test Your Changes

```bash
# Lint your code
pnpm lint

# Type check
pnpm tsc --noEmit

# Build to ensure no errors
pnpm build

# Run tests (when available)
pnpm test
```

### 5. Commit Your Changes

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git add .
git commit -m "type: description"
```

**Commit types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, missing semicolons, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks
- `perf:` - Performance improvements

**Examples:**
```bash
git commit -m "feat: add template export functionality"
git commit -m "fix: resolve authentication redirect loop"
git commit -m "docs: update installation instructions"
git commit -m "refactor: simplify database query logic"
```

### 6. Push and Create Pull Request

```bash
# Push your branch
git push origin feature/your-feature-name
```

Then:
1. Go to your fork on GitHub
2. Click "Compare & pull request"
3. Fill out the PR template
4. Submit the PR

---

## 📝 Pull Request Guidelines

### PR Title Format

Use the same format as commit messages:
```
type: Brief description of changes
```

### PR Description Template

```markdown
## Description
[Describe your changes in detail]

## Related Issue
Fixes #[issue number]

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] I have tested this code locally
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] Existing tests pass locally with my changes

## Checklist
- [ ] My code follows the project's coding standards
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

### PR Review Process

1. **Automated Checks**
   - Linting passes
   - Type checking passes
   - Build succeeds
   - Tests pass (when implemented)

2. **Code Review**
   - At least one maintainer approval required
   - Address all review comments
   - Keep discussions professional and constructive

3. **Merge**
   - Squash commits (maintainers will handle this)
   - Update related issues
   - Celebrate! 🎉

---

## 💻 Coding Standards

### TypeScript

**General Rules:**
- Use TypeScript strict mode
- Avoid `any` types - use proper typing
- Use interfaces for object shapes
- Use type aliases for unions and primitives
- Export types when needed by other modules

**Example:**
```typescript
// Good ✅
interface UserProfile {
  id: string
  name: string
  email: string
  createdAt: Date
}

function getUser(id: string): Promise<UserProfile | null> {
  // implementation
}

// Bad ❌
function getUser(id: any): any {
  // implementation
}
```

### React Components

**Component Structure:**
```typescript
import { ComponentProps } from '@/types/components'

interface MyComponentProps {
  title: string
  onAction?: () => void
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  // Implementation
  
  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

**Best Practices:**
- Use functional components
- Use React hooks appropriately
- Keep components small and focused
- Extract logic into custom hooks
- Use server components by default (add 'use client' only when needed)
- Avoid prop drilling - use context or composition

### File Naming

- **Components:** PascalCase - `UserProfile.tsx`
- **Pages:** kebab-case - `user-settings/page.tsx`
- **Utilities:** camelCase - `formatDate.ts`
- **Constants:** UPPER_SNAKE_CASE - `API_ENDPOINTS.ts`

### Code Organization

**Import Order:**
```typescript
// 1. React and Next.js
import { useState } from 'react'
import { redirect } from 'next/navigation'

// 2. Third-party libraries
import { z } from 'zod'

// 3. Local imports
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import type { User } from '@/types/database'

// 4. Styles (if any)
import styles from './component.module.css'
```

### Styling

**Tailwind CSS:**
- Use Tailwind utility classes
- Follow mobile-first approach
- Extract repeated patterns into components
- Use design system colors/spacing

**Example:**
```tsx
<div className="flex flex-col gap-4 p-6 md:flex-row md:gap-6 lg:p-8">
  <Button className="w-full md:w-auto">
    Click me
  </Button>
</div>
```

### Comments and Documentation

**When to comment:**
- Complex logic that isn't immediately obvious
- Business rules or calculations
- Workarounds or non-obvious solutions
- API contracts and data structures

**JSDoc for functions:**
```typescript
/**
 * Calculates the user's reputation score based on their activity
 * 
 * @param userId - The unique identifier for the user
 * @param includeBonus - Whether to include seasonal bonuses
 * @returns The calculated reputation score
 */
export async function calculateReputationScore(
  userId: string,
  includeBonus = false
): Promise<number> {
  // Implementation
}
```

### Error Handling

**Always handle errors gracefully:**
```typescript
try {
  const result = await riskyOperation()
  return result
} catch (error) {
  console.error('Operation failed:', error)
  // Show user-friendly error
  return { error: 'Something went wrong. Please try again.' }
}
```

---

## 🧪 Testing Guidelines

### Unit Tests (When Implemented)

**Test file naming:** `component.test.tsx` or `utils.test.ts`

**Test structure:**
```typescript
import { render, screen } from '@testing-library/react'
import { MyComponent } from './MyComponent'

describe('MyComponent', () => {
  it('renders the title', () => {
    render(<MyComponent title="Test Title" />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('calls onAction when button is clicked', () => {
    const onAction = jest.fn()
    render(<MyComponent title="Test" onAction={onAction} />)
    
    const button = screen.getByRole('button')
    button.click()
    
    expect(onAction).toHaveBeenCalledTimes(1)
  })
})
```

### Test Coverage

- Aim for >80% coverage on new code
- Focus on critical paths first
- Test edge cases and error conditions
- Don't test implementation details

---

## 📚 Documentation

### When to Update Documentation

Update documentation when you:
- Add new features
- Change existing behavior
- Add new configuration options
- Fix bugs that weren't clear from docs

### Documentation Files

- `README.md` - Getting started and overview
- `ARCHITECTURE.md` - System architecture
- `API.md` - API documentation
- Inline comments - Complex code

---

## 🐛 Reporting Bugs

### Before Reporting

1. Check if the bug has already been reported
2. Verify the bug exists on the latest version
3. Collect relevant information

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., macOS, Windows, Linux]
- Browser: [e.g., Chrome, Safari]
- Node version: [e.g., 20.10.0]
- Next.js version: [e.g., 14.2.25]

**Additional context**
Any other context about the problem.
```

---

## 💡 Suggesting Features

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Additional context**
Any other context, screenshots, or mockups.
```

---

## 🎯 Areas to Contribute

### Good First Issues

Look for issues labeled `good first issue` - these are great for newcomers!

### Priority Areas

1. **Testing** - Adding tests for existing features
2. **Documentation** - Improving or translating docs
3. **Accessibility** - Making the app more accessible
4. **Performance** - Optimizing existing features
5. **Bug Fixes** - Fixing reported bugs

---

## 📞 Getting Help

- **Questions?** Open a [GitHub Discussion](https://github.com/Krosebrook/v0-template-evaluation-academy/discussions)
- **Need help?** Comment on an issue or PR
- **Found a bug?** [Open an issue](https://github.com/Krosebrook/v0-template-evaluation-academy/issues/new)

---

## 🏆 Recognition

Contributors will be:
- Listed in our README
- Mentioned in release notes
- Given credit in documentation

Thank you for contributing to Template Evaluation Academy! 🎉
