# Debugging Guide & Known Issues
## Template Evaluation Academy

**Last Updated:** 2025-12-30  
**Version:** 0.1.0

---

## Table of Contents

1. [Known Bugs](#known-bugs)
2. [Edge Cases](#edge-cases)
3. [Architectural Bottlenecks](#architectural-bottlenecks)
4. [Common Issues](#common-issues)
5. [Debugging Tools](#debugging-tools)
6. [Issue Resolution Priority](#issue-resolution-priority)
7. [Reporting New Issues](#reporting-new-issues)

---

## Known Bugs

### Critical Bugs (P0)

#### BUG-001: React 19 Peer Dependency Mismatch

**Severity:** High  
**Status:** Open  
**Affected Components:** Entire application

**Description:**
As of December 2025, Next.js 14.2.25 expects React 18, but React 19 is installed, causing peer dependency warnings and potential compatibility issues. This may resolve when Next.js 15 is released with official React 19 support.

**Impact:**
- npm/pnpm install shows warnings
- Potential runtime compatibility issues
- May cause hydration mismatches
- Could break with future React 19 changes

**Reproduction:**
```bash
npm install
# Shows peer dependency warnings
```

**Root Cause:**
Early adoption of React 19 (still in RC) before Next.js official support.

**Workaround:**
```bash
# Temporary: Suppress warnings
npm install --legacy-peer-deps
```

**Permanent Fix Options:**

Option 1: Downgrade React (Safer)
```bash
npm install react@^18.2.0 react-dom@^18.2.0
```

Option 2: Upgrade Next.js (When available)
```bash
npm install next@15
# Once Next.js 15 officially supports React 19
```

**Resolution ETA:** Q1 2026  
**Owner:** Tech Lead

---

#### BUG-002: Missing Input Validation on Server Actions

**Severity:** Critical  
**Status:** Open  
**Affected Components:** All server actions

**Description:**
Server actions lack comprehensive input validation, exposing the application to invalid data and potential security vulnerabilities.

**Impact:**
- Invalid data reaches database
- Potential SQL injection (mitigated by Supabase client)
- Business logic errors
- Poor error messages for users

**Example:**
```typescript
// app/actions/templates.ts
export async function createTemplate(formData: FormData) {
  const title = formData.get('title') as string
  // ❌ No validation! What if title is empty or too long?
  
  await supabase.from('templates').insert({ title })
}
```

**Reproduction:**
1. Submit template form with empty title
2. Application accepts and processes invalid data
3. Database constraints catch it (if any)
4. Generic error shown to user

**Root Cause:**
Validation logic not implemented during initial development.

**Fix:**
```typescript
import { z } from 'zod'

const templateSchema = z.object({
  title: z.string().min(10).max(100),
  description: z.string().min(50),
  content: z.string().min(100),
})

export async function createTemplate(formData: FormData) {
  const data = Object.fromEntries(formData)
  
  // Validate
  const result = templateSchema.safeParse(data)
  if (!result.success) {
    return { error: result.error.format() }
  }
  
  // Proceed with validated data
  await supabase.from('templates').insert(result.data)
}
```

**Resolution ETA:** Q1 2026  
**Owner:** Backend Team

---

#### BUG-003: No Error Boundaries

**Severity:** High  
**Status:** Open  
**Affected Components:** All pages

**Description:**
Application lacks error boundaries, causing entire page crashes when component errors occur.

**Impact:**
- Single component error crashes entire page
- Poor user experience
- No error recovery mechanism
- Difficult to debug in production

**Reproduction:**
1. Component throws uncaught error
2. Entire page becomes blank
3. Console shows error but page is unusable

**Fix:**
Implement error boundaries at layout and page levels (see REFACTORING.md).

**Resolution ETA:** Q1 2026  
**Owner:** Frontend Team

---

### High Priority Bugs (P1)

#### BUG-004: Large Bundle Size

**Severity:** Medium  
**Status:** Open  
**Affected Components:** Initial page load

**Description:**
Initial JavaScript bundle is larger than optimal, slowing down first page load.

**Impact:**
- Slower Time to Interactive (TTI)
- Poor performance on slow connections
- Higher bandwidth costs
- Lower Lighthouse scores

**Metrics:**
- Current: Unknown (not measured)
- Target: <200KB initial bundle

**Root Cause:**
- No code splitting implemented
- Heavy dependencies loaded upfront
- Unoptimized vendor chunks

**Fix:**
1. Implement dynamic imports
2. Use Next.js code splitting
3. Analyze and optimize dependencies
4. Implement route-based splitting

**Resolution ETA:** Q2 2026  
**Owner:** Performance Team

---

#### BUG-005: Unhandled Promise Rejections

**Severity:** Medium  
**Status:** Open  
**Affected Components:** Multiple async operations

**Description:**
Several async operations lack proper error handling, leading to unhandled promise rejections.

**Impact:**
- Silent failures
- Inconsistent error states
- Poor user feedback
- Difficult debugging

**Example Locations:**
- `app/library/page.tsx` (line 631, 703)
- `app/api/templates/[id]/rollback/route.ts` (line 59)
- Multiple other files

**Fix:**
```typescript
// ❌ BAD
const data = await fetchData()

// ✅ GOOD
try {
  const data = await fetchData()
  return { data }
} catch (error) {
  console.error('Failed to fetch data:', error)
  return { error: 'Failed to load data. Please try again.' }
}
```

**Resolution ETA:** Q1 2026  
**Owner:** Full Stack Team

---

### Medium Priority Bugs (P2)

#### BUG-006: Unused State Variables

**Severity:** Low  
**Status:** Open  
**Affected Components:** Multiple components

**Description:**
Multiple components have unused state variables and functions, cluttering code.

**Impact:**
- Code confusion
- Increased bundle size
- Maintenance overhead
- Harder to understand code

**Statistics:**
- 30+ unused variables found
- 10+ unused functions
- Affects 20+ components

**Fix:**
Remove all unused code (ESLint will help identify).

**Resolution ETA:** Q1 2026  
**Owner:** Development Team

---

## Edge Cases

### EDGE-001: Very Long Template Content

**Scenario:** User submits template with >100KB of content

**Current Behavior:**
- Might exceed API limits
- Slow page rendering
- Poor editor performance

**Handling:**
- Add content length validation
- Implement lazy loading for large content
- Add warnings for large files

**Status:** Not handled  
**Priority:** P2

---

### EDGE-002: Concurrent Template Edits

**Scenario:** Multiple users edit same template simultaneously

**Current Behavior:**
- Last write wins
- No conflict resolution
- Data loss possible

**Handling:**
- Implement optimistic locking
- Add version tracking
- Show conflict resolution UI

**Status:** Not handled  
**Priority:** P3

---

### EDGE-003: Rapid API Requests

**Scenario:** User makes many API requests quickly

**Current Behavior:**
- No rate limiting
- Possible database overload
- Abuse potential

**Handling:**
- Implement rate limiting (Upstash Redis)
- Add request throttling
- Show user feedback

**Status:** Not handled  
**Priority:** P1

---

### EDGE-004: Special Characters in Input

**Scenario:** User inputs special characters, emojis, etc.

**Current Behavior:**
- May break UI rendering
- Database storage issues
- Search problems

**Handling:**
- Proper Unicode support
- Input sanitization
- Validation for allowed characters

**Status:** Partially handled  
**Priority:** P2

---

### EDGE-005: Offline Usage

**Scenario:** User loses internet connection while using app

**Current Behavior:**
- All functionality breaks
- No offline indication
- Data loss possible

**Handling:**
- Service worker for offline support
- Local storage caching
- Offline indicator
- Queue for offline actions

**Status:** Not handled (PWA planned)  
**Priority:** P3

---

## Architectural Bottlenecks

### BOTTLENECK-001: Database N+1 Queries

**Location:** Multiple pages fetching related data

**Description:**
Pages fetch main data then loop through results fetching related data, causing N+1 query problem.

**Example:**
```typescript
// ❌ BAD: N+1 queries
const templates = await supabase.from('templates').select('*')

for (const template of templates.data) {
  // Separate query for each template!
  const author = await supabase
    .from('profiles')
    .select('*')
    .eq('id', template.user_id)
    .single()
}
```

**Impact:**
- Slow page loads
- Database overload
- Poor scalability
- Increased costs

**Solution:**
```typescript
// ✅ GOOD: Single query with joins
const templates = await supabase
  .from('templates')
  .select(`
    *,
    author:profiles(*)
  `)
```

**Priority:** P1  
**Owner:** Backend Team

---

### BOTTLENECK-002: Missing Database Indexes

**Location:** Database queries

**Description:**
Critical queries lack proper indexes, causing slow performance on large datasets.

**Affected Tables:**
- `templates` (title, created_at, status)
- `comments` (template_id, created_at)
- `votes` (template_id, user_id)
- `tags` (name)

**Impact:**
- Slow queries (>1s)
- Poor user experience
- Database CPU spikes
- Scalability issues

**Solution:**
```sql
-- Add indexes
CREATE INDEX idx_templates_status_created ON templates(status, created_at DESC);
CREATE INDEX idx_comments_template ON comments(template_id, created_at DESC);
CREATE INDEX idx_votes_template_user ON votes(template_id, user_id);
CREATE INDEX idx_tags_name ON tags(name);
```

**Priority:** P0  
**Owner:** Database Team

---

### BOTTLENECK-003: No Caching Strategy

**Location:** All data fetching

**Description:**
No caching implemented, every request hits database even for static/rarely-changing data.

**Impact:**
- Unnecessary database load
- Slower response times
- Higher costs
- Poor scalability

**Solution:**
1. Implement Redis caching (Upstash)
2. Use Next.js built-in caching
3. Cache static data (tags, categories)
4. Implement cache invalidation

**Priority:** P1  
**Owner:** Backend Team

---

### BOTTLENECK-004: Synchronous File Processing

**Location:** Template import/export

**Description:**
File processing happens synchronously, blocking request until complete.

**Impact:**
- Long request times
- Poor UX for large files
- Timeout risk
- Resource inefficiency

**Solution:**
1. Implement async job queue
2. Use background workers
3. Show progress indicators
4. Enable cancellation

**Priority:** P2  
**Owner:** Backend Team

---

## Common Issues

### Issue: Build Fails with TypeScript Errors

**Symptoms:**
```bash
npm run build
# Type error: ...
```

**Causes:**
- Incorrect types
- Missing type definitions
- Version mismatches

**Solutions:**
1. Clear cache: `rm -rf .next`
2. Reinstall: `rm -rf node_modules && npm install`
3. Check TypeScript version compatibility
4. Fix reported type errors

---

### Issue: Database Connection Fails

**Symptoms:**
- "Connection refused"
- "Invalid project URL"
- Auth errors

**Causes:**
- Incorrect environment variables
- Supabase project not configured
- Network issues

**Solutions:**
1. Verify `.env.local` variables
2. Check Supabase project status
3. Test connection manually
4. Verify RLS policies

---

### Issue: Styles Not Loading

**Symptoms:**
- Unstyled content
- Flash of unstyled content (FOUC)

**Causes:**
- Tailwind not configured
- PostCSS issues
- Cache problems

**Solutions:**
1. Check `tailwind.config.ts`
2. Verify `postcss.config.mjs`
3. Clear Next.js cache
4. Restart dev server

---

### Issue: Authentication Not Working

**Symptoms:**
- Can't log in
- Session lost on refresh
- Redirect loops

**Causes:**
- Supabase auth misconfigured
- Cookie issues
- Middleware problems

**Solutions:**
1. Check Supabase auth settings
2. Verify callback URLs
3. Clear cookies and cache
4. Check middleware.ts

---

## Debugging Tools

### 1. React Developer Tools

**Installation:**
```bash
# Chrome/Edge
https://chrome.google.com/webstore/detail/react-developer-tools/

# Firefox
https://addons.mozilla.org/en-US/firefox/addon/react-devtools/
```

**Usage:**
- Inspect component tree
- View props and state
- Track re-renders
- Profile performance

---

### 2. Next.js Debug Mode

**Enable:**
```bash
NODE_OPTIONS='--inspect' npm run dev
```

**Then:**
1. Open Chrome DevTools
2. Click Node.js icon
3. Debug server-side code

---

### 3. Supabase Logs

**Access:**
1. Go to Supabase Dashboard
2. Navigate to Logs section
3. View API logs, Auth logs, Database logs

**Useful for:**
- Debugging queries
- Auth issues
- RLS policy problems

---

### 4. Network Tab

**Usage:**
1. Open browser DevTools
2. Go to Network tab
3. Monitor all requests

**Look for:**
- Failed requests
- Slow queries
- Large payloads
- CORS issues

---

### 5. Console Logging

**Best Practices:**
```typescript
// Development only
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data)
}

// Use structured logging
console.group('Template Creation')
console.log('Input:', input)
console.log('Validation:', validation)
console.log('Result:', result)
console.groupEnd()
```

---

## Issue Resolution Priority

### Priority Matrix

| Priority | Severity | Description | Response Time | Fix Time |
|----------|----------|-------------|---------------|----------|
| P0 | Critical | App broken, data loss | <1 hour | <1 day |
| P1 | High | Major feature broken | <4 hours | <1 week |
| P2 | Medium | Feature degraded | <1 day | <2 weeks |
| P3 | Low | Minor issue, cosmetic | <1 week | <1 month |
| P4 | Trivial | Nice to have | <1 month | Backlog |

### Current Issue Distribution

```
P0 Critical:  3 issues  ████████████████░░░░░░░░ 60%
P1 High:      2 issues  ████████░░░░░░░░░░░░░░░░ 32%
P2 Medium:    1 issue   ████░░░░░░░░░░░░░░░░░░░░  8%
P3 Low:       0 issues  ░░░░░░░░░░░░░░░░░░░░░░░░  0%
```

**Recommended Focus:**
1. Address all P0 issues first (Q1 2026)
2. Then P1 issues (Q1 2026)
3. P2 issues as time permits (Q2 2026)
4. P3 issues in backlog

---

## Reporting New Issues

### Issue Template

```markdown
## Issue Description
[Clear description of the problem]

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Environment
- OS: [e.g., macOS 14]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 20.10.0]
- Next.js version: [e.g., 14.2.25]

## Screenshots
[If applicable]

## Additional Context
[Any other relevant information]

## Logs/Errors
```
[Error messages or logs]
```
```

### Where to Report

**GitHub Issues:**
https://github.com/Krosebrook/v0-template-evaluation-academy/issues

**Labels:**
- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `question` - Further information requested
- `wontfix` - This will not be worked on

---

## Conclusion

This document tracks known bugs, edge cases, and architectural bottlenecks in the Template Evaluation Academy codebase. It should be updated regularly as issues are discovered and resolved.

**Key Actions:**
1. Fix all P0 critical bugs immediately
2. Address P1 high-priority bugs in Q1 2026
3. Implement architectural improvements
4. Add comprehensive error handling
5. Improve debugging capabilities

---

**Document Maintainer:** QA Team  
**Last Reviewed:** 2025-12-30  
**Next Review:** 2026-Q1 (or after major issues)
