# Running on StackBlitz / blink.new

This project is fully compatible with [StackBlitz](https://stackblitz.com/) and [blink.new](https://blink.new), allowing you to run the entire development environment in your browser without any local installation.

## Quick Start

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/Krosebrook/v0-template-evaluation-academy)

Simply click the button above to launch the project in StackBlitz.

## What's Included

The project comes pre-configured with:

- ✅ **Next.js 14** development environment
- ✅ **TypeScript** support
- ✅ **Tailwind CSS** styling
- ✅ **Hot Module Replacement** (HMR)
- ✅ **Development environment variables** (placeholder values)

## Default Configuration

The project starts with placeholder environment variables defined in `.env.development`. These allow the UI to load and function for demonstration purposes, but you'll need to add real credentials for full functionality.

### What Works Out of the Box

- ✅ Browse the UI and navigate through pages
- ✅ View component layouts and designs
- ✅ Test responsive design
- ✅ Explore the codebase
- ✅ Make code changes and see them instantly

### What Requires Configuration

To enable full functionality, you'll need to add your own credentials:

#### 1. Supabase (Database & Authentication)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**How to get these:**
1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → API
4. Copy your project URL and keys

#### 2. Stripe (Payment Processing)

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-key-here
STRIPE_SECRET_KEY=sk_test_your-key-here
STRIPE_WEBHOOK_SECRET=whsec_your-secret-here
```

**How to get these:**
1. Create a free account at [stripe.com](https://stripe.com)
2. Go to Developers → API Keys
3. Use test mode keys (they start with `pk_test_` and `sk_test_`)

## Adding Your Credentials in StackBlitz

### Method 1: Environment Variables Panel (Recommended)

1. Click the **"Environment"** tab in the left sidebar
2. Add your environment variables one by one
3. The app will automatically reload with your new settings

### Method 2: Edit .env.development

1. Open `.env.development` in the file explorer
2. Replace the placeholder values with your actual credentials
3. Save the file - the app will hot-reload

## Features Available by Configuration Level

### Level 1: No Configuration (Default)
- ✅ UI exploration
- ✅ Component testing
- ✅ Layout and design review
- ❌ User authentication
- ❌ Database operations
- ❌ Payment processing

### Level 2: Supabase Configured
- ✅ Everything from Level 1
- ✅ User authentication (login/signup)
- ✅ Database operations (CRUD)
- ✅ User profiles
- ❌ Payment processing

### Level 3: Full Configuration (Supabase + Stripe)
- ✅ Everything from Level 2
- ✅ Payment processing
- ✅ Subscription management
- ✅ Complete marketplace functionality

## Database Setup

If you configure Supabase credentials, you'll also need to set up the database schema:

1. In your Supabase project, go to **SQL Editor**
2. Run the migration scripts from the `scripts/` directory in order:
   - `001_create_tables.sql`
   - `002_create_profile_trigger.sql`
   - Continue with all numbered scripts in order

## Troubleshooting

### The app loads but shows errors about missing environment variables

This is expected! The placeholder values in `.env.development` are just to let the app start. Add your real credentials to enable full functionality.

### Font loading errors

This is normal in StackBlitz. The app uses Google Fonts, but they're loaded at runtime and may show console warnings. This doesn't affect functionality.

### "Module not found" errors

Try restarting the dev server:
1. Click the terminal at the bottom
2. Press `Ctrl+C` to stop the server
3. Run `npm run dev` to restart

### Changes not appearing

StackBlitz has hot module replacement enabled. If changes don't appear:
1. Save the file (Ctrl+S / Cmd+S)
2. Wait a few seconds for the hot reload
3. If needed, refresh the preview window

## Limitations

StackBlitz WebContainer runs Node.js in the browser, which has some limitations:

- ⚠️ **Performance** - May be slower than local development
- ⚠️ **Network requests** - Some external APIs may not work due to CORS
- ⚠️ **File system** - Limited to browser storage
- ⚠️ **Build size** - Very large builds may timeout

For production development, we recommend cloning the repository locally.

## Benefits of StackBlitz

Despite the limitations, StackBlitz is excellent for:

- 🚀 **Quick prototyping** - Test ideas without setup
- 📚 **Learning** - Explore the codebase interactively
- 🤝 **Collaboration** - Share a live environment with others
- 🎨 **Design review** - Show UI changes to stakeholders
- 🐛 **Bug reproduction** - Create isolated test cases

## Exporting Your Work

If you make changes in StackBlitz and want to use them locally:

1. Click the **"Download"** button in the toolbar
2. Extract the ZIP file
3. Run `npm install` locally
4. Copy your environment variables to `.env.local`
5. Run `npm run dev`

## Need Help?

- 📖 See the main [README.md](./README.md) for full documentation
- 🐛 [Report issues](https://github.com/Krosebrook/v0-template-evaluation-academy/issues)
- 💬 [Join discussions](https://github.com/Krosebrook/v0-template-evaluation-academy/discussions)

---

**Happy coding in the browser! 🎉**
