-- Insert sample templates (these will be visible to everyone)
insert into public.templates (title, description, category, difficulty, tags, preview_url, github_url, demo_url)
values
  (
    'E-commerce Starter',
    'A full-featured e-commerce template with cart, checkout, and payment integration',
    'E-commerce',
    'Intermediate',
    array['Next.js', 'Stripe', 'Tailwind CSS', 'TypeScript'],
    '/placeholder.svg?height=400&width=600',
    'https://github.com/example/ecommerce-starter',
    'https://ecommerce-demo.vercel.app'
  ),
  (
    'SaaS Dashboard',
    'Modern SaaS dashboard with authentication, billing, and analytics',
    'SaaS',
    'Advanced',
    array['Next.js', 'Supabase', 'Recharts', 'shadcn/ui'],
    '/placeholder.svg?height=400&width=600',
    'https://github.com/example/saas-dashboard',
    'https://saas-demo.vercel.app'
  ),
  (
    'Blog Template',
    'Clean and minimal blog template with MDX support',
    'Blog',
    'Beginner',
    array['Next.js', 'MDX', 'Tailwind CSS'],
    '/placeholder.svg?height=400&width=600',
    'https://github.com/example/blog-template',
    'https://blog-demo.vercel.app'
  ),
  (
    'Portfolio Site',
    'Personal portfolio template with project showcase and contact form',
    'Portfolio',
    'Beginner',
    array['Next.js', 'Framer Motion', 'Tailwind CSS'],
    '/placeholder.svg?height=400&width=600',
    'https://github.com/example/portfolio',
    'https://portfolio-demo.vercel.app'
  ),
  (
    'AI Chatbot',
    'Intelligent chatbot template with streaming responses and conversation history',
    'AI',
    'Advanced',
    array['Next.js', 'Vercel AI SDK', 'OpenAI', 'Supabase'],
    '/placeholder.svg?height=400&width=600',
    'https://github.com/example/ai-chatbot',
    'https://chatbot-demo.vercel.app'
  ),
  (
    'Landing Page',
    'High-converting landing page template with animations and CTAs',
    'Marketing',
    'Beginner',
    array['Next.js', 'Framer Motion', 'Tailwind CSS'],
    '/placeholder.svg?height=400&width=600',
    'https://github.com/example/landing-page',
    'https://landing-demo.vercel.app'
  );
