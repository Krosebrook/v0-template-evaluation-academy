"use client"

import { useState, useEffect, useRef } from "react"
import {
  Sparkles,
  Layers,
  Users,
  Zap,
  Copy,
  Download,
  Info,
  Wand2,
  ChevronDown,
  ChevronUp,
  Shuffle,
  Code,
  Palette,
  Video,
  Cog,
  Pencil,
  History,
  Save,
  FolderOpen,
  Trash2,
  Star,
  Check,
  AlertCircle,
  Loader2,
  FileText,
  FileJson,
  X,
  Keyboard,
  BookOpen,
  Library,
  HelpCircle,
  GraduationCap,
  Upload,
  GitCompare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link" // Added import for Link
// Added imports for new components
import { HelpTooltip } from "@/components/help-tooltip"
import { InlineHelp } from "@/components/inline-help"
import { GuidedTour } from "@/components/guided-tour"
import { ImportExportManager } from "@/components/import-export-manager"

interface Persona {
  id: string
  name: string
  description: string
  icon: string
}

interface PromptLayer {
  id: string
  name: string
  description: string
  essential: boolean
}

interface QuickStartTemplate {
  category: string
  icon: any
  name: string
  description: string
  personas: string[]
  layers: string[]
  type: string
  prefill: string
  nextIdeas: string[]
}

interface SavedConfig {
  id: string
  name: string
  timestamp: number
  userInput: string
  selectedPersonas: string[]
  selectedLayers: string[]
  promptType: string
  temperature: string
  complexity: string
  isFavorite?: boolean
}

interface GeneratedPromptHistory {
  id: string
  timestamp: number
  prompt: string
  config: SavedConfig
}

const PERSONAS: Persona[] = [
  { id: "expert", name: "Expert Analyst", description: "Deep domain expertise with analytical thinking", icon: "🎯" },
  {
    id: "creative",
    name: "Creative Innovator",
    description: "Out-of-the-box thinking and novel solutions",
    icon: "💡",
  },
  { id: "teacher", name: "Patient Educator", description: "Clear explanations with examples", icon: "📚" },
  { id: "strategist", name: "Strategic Planner", description: "Long-term thinking and systematic approach", icon: "♟️" },
  { id: "critic", name: "Critical Reviewer", description: "Identifies flaws and improvements", icon: "🔍" },
  { id: "researcher", name: "Thorough Researcher", description: "Evidence-based and comprehensive", icon: "🔬" },
  { id: "engineer", name: "Technical Engineer", description: "Implementation-focused and practical", icon: "⚙️" },
  { id: "consultant", name: "Business Consultant", description: "ROI-focused and pragmatic", icon: "💼" },
]

const PROMPT_LAYERS: PromptLayer[] = [
  { id: "role", name: "Role Definition", description: "Define AI persona and expertise", essential: true },
  { id: "context", name: "Context Setting", description: "Background information and constraints", essential: true },
  { id: "task", name: "Task Specification", description: "Clear objective and deliverables", essential: true },
  { id: "format", name: "Output Format", description: "Structure and presentation requirements", essential: false },
  { id: "examples", name: "Examples", description: "Sample inputs and outputs", essential: false },
  { id: "constraints", name: "Constraints", description: "Limitations and boundaries", essential: false },
  { id: "tone", name: "Tone & Style", description: "Communication style preferences", essential: false },
  { id: "validation", name: "Validation Criteria", description: "Success metrics and checks", essential: false },
]

const PROMPT_TYPES = {
  golden: {
    name: "Golden Prompt",
    description: "Comprehensive, production-ready with all best practices",
    difficulty: "Advanced",
  },
  meta: { name: "Meta Prompt", description: "Prompts that help AI generate better prompts", difficulty: "Expert" },
  context: {
    name: "Context Engineered",
    description: "Multi-layered context for nuanced responses",
    difficulty: "Advanced",
  },
  chain: {
    name: "Chain-of-Thought",
    description: "Step-by-step reasoning for complex problems",
    difficulty: "Intermediate",
  },
  few_shot: { name: "Few-Shot Learning", description: "Learn from examples before generating", difficulty: "Beginner" },
  zero_shot: { name: "Zero-Shot", description: "Direct task without examples", difficulty: "Beginner" },
  system: {
    name: "System Instruction",
    description: "Define AI behavior and capabilities",
    difficulty: "Intermediate",
  },
  recursive: {
    name: "Recursive Refinement",
    description: "Self-improving prompts through iterations",
    difficulty: "Expert",
  },
}

const QUICK_START_TEMPLATES: QuickStartTemplate[] = [
  // Developer Templates
  {
    category: "Developer",
    icon: Code,
    name: "Frontend Developer",
    description: "Build React components with TypeScript and Tailwind",
    personas: ["engineer", "creative"],
    layers: ["role", "context", "task", "format", "examples", "validation"],
    type: "golden",
    prefill:
      "Create a production-ready React component for a pricing card with three tiers (Starter, Pro, Enterprise). Requirements: TypeScript with strict mode, Tailwind CSS for styling, smooth hover animations using CSS transitions, fully responsive (mobile-first approach), WCAG 2.1 AA accessibility compliance including ARIA labels and keyboard navigation, props interface for customization (title, price, features array, CTA text, highlighted tier), and proper semantic HTML structure. Include JSDoc comments and export both the component and its TypeScript interface.",
    nextIdeas: [
      "Add Framer Motion for advanced animations (stagger effects, spring physics)",
      "Generate comprehensive test suite with React Testing Library (user interactions, accessibility, edge cases)",
      "Create interactive Storybook documentation with all variants and controls",
    ],
  },
  {
    category: "Developer",
    icon: Code,
    name: "Backend Developer",
    description: "Design APIs, databases, and server architecture",
    personas: ["engineer", "strategist"],
    layers: ["role", "context", "task", "validation", "constraints"],
    type: "chain",
    prefill:
      "Design a production-grade RESTful API for a task management system following REST best practices and industry standards. Core requirements: User authentication with JWT tokens (access + refresh), bcrypt password hashing, role-based access control (admin, manager, member), CRUD operations for tasks with filtering, sorting, and pagination, real-time notifications using WebSockets or Server-Sent Events, rate limiting (100 requests/minute per user), comprehensive error handling with standardized error responses, request validation using Joi or Zod, API versioning strategy (/v1/), and OpenAPI 3.0 documentation. Database: PostgreSQL with proper indexing. Include endpoint specifications, request/response examples, status codes, and security considerations.",
    nextIdeas: [
      "Design GraphQL schema with queries, mutations, subscriptions, and resolver structure",
      "Generate database migration scripts with rollback support and seed data",
      "Create comprehensive API documentation with Swagger/OpenAPI including authentication flows and example requests",
    ],
  },
  {
    category: "Developer",
    icon: Code,
    name: "Full Stack Developer",
    description: "End-to-end application development",
    personas: ["engineer", "strategist", "consultant"],
    layers: ["role", "context", "task", "format", "validation"],
    type: "context",
    prefill:
      "Build a complete, production-ready authentication system with enterprise-grade security. Features required: Email/password registration with email verification, OAuth 2.0 integration (Google, GitHub), JWT-based authentication with access tokens (15min expiry) and refresh tokens (7 days), secure password reset flow with time-limited tokens, account lockout after 5 failed attempts, session management with device tracking, CSRF protection, rate limiting on auth endpoints, secure HTTP-only cookies, password strength requirements (min 12 chars, uppercase, lowercase, numbers, symbols), and audit logging. Tech stack: Node.js/Express backend, React frontend, PostgreSQL database, Redis for session storage. Include database schema, API endpoints, frontend components, security middleware, and deployment considerations.",
    nextIdeas: [
      "Implement multi-factor authentication (TOTP, SMS, email codes) with backup codes",
      "Add advanced session management with concurrent session limits and remote logout",
      "Create comprehensive admin dashboard for user management, security monitoring, and audit logs",
    ],
  },

  // UI Designer Templates
  {
    category: "UI Designer",
    icon: Palette,
    name: "Landing Page Designer",
    description: "Create high-converting landing pages",
    personas: ["creative", "consultant", "critic"],
    layers: ["role", "context", "task", "format", "tone"],
    type: "golden",
    prefill:
      "Design a high-converting landing page for a SaaS productivity tool targeting remote teams (25-500 employees). Apply conversion optimization principles and modern design trends. Required sections: (1) Hero: Compelling headline addressing pain point, subheadline with value proposition, primary CTA above fold, hero image/video showing product in action, social proof badges (G2, Capterra ratings). (2) Features: 6 key features with icons, benefits-focused copy, and micro-interactions. (3) Pricing: 3 tiers with feature comparison table, annual/monthly toggle, highlighted recommended plan. (4) Testimonials: 6 customer testimonials with photos, company logos, specific results/metrics. (5) FAQ: 8 common questions. (6) Final CTA: Strong closing statement with urgency element. Design system: Modern, clean aesthetic with generous whitespace, primary color (trust-building blue), accent color for CTAs, consistent 8px grid system, mobile-first responsive design, accessibility considerations, and micro-animations for engagement. Include wireframes, visual hierarchy notes, and conversion optimization rationale.",
    nextIdeas: [
      "Design A/B testing variations for hero headline, CTA copy, and pricing presentation",
      "Generate complete mobile-first responsive layouts with breakpoint specifications (320px, 768px, 1024px, 1440px)",
      "Create comprehensive conversion optimization checklist with heatmap analysis recommendations and user flow diagrams",
    ],
  },
  {
    category: "UI Designer",
    icon: Palette,
    name: "Dashboard Designer",
    description: "Design data-rich admin interfaces",
    personas: ["creative", "engineer", "strategist"],
    layers: ["role", "context", "task", "format", "examples"],
    type: "context",
    prefill:
      "Design a comprehensive analytics dashboard for an e-commerce platform serving business analysts and store managers. Information architecture: (1) Overview page: KPI cards (revenue, orders, conversion rate, AOV) with trend indicators, revenue chart (line graph, 30-day view with comparison), top products table (sortable), recent orders list. (2) Sales metrics: Revenue breakdown by category (pie chart), sales by region (map visualization), time-series analysis with date range picker, cohort analysis table. (3) User behavior: Traffic sources (bar chart), user journey funnel, session duration distribution, bounce rate by page. (4) Inventory: Stock levels with low-stock alerts, reorder recommendations, supplier performance metrics. (5) Revenue trends: MoM/YoY comparisons, forecasting visualization, seasonal patterns. Design requirements: Dark mode support, customizable widget layout (drag-and-drop), data export functionality, real-time updates indicator, responsive design (desktop-first), color-coded status indicators, loading states, empty states, error states, and accessibility (WCAG AA). Include component specifications, interaction patterns, and data visualization best practices.",
    nextIdeas: [
      "Add real-time data visualization with WebSocket integration and live update animations",
      "Create customizable widget system with user preferences, saved layouts, and shareable dashboard URLs",
      "Design comprehensive dark mode variant with proper contrast ratios and color palette adjustments",
    ],
  },
  {
    category: "UI Designer",
    icon: Palette,
    name: "Mobile App Designer",
    description: "Native mobile app UI/UX design",
    personas: ["creative", "teacher", "critic"],
    layers: ["role", "context", "task", "format", "constraints"],
    type: "few_shot",
    prefill:
      "Design a native mobile fitness tracking app following iOS Human Interface Guidelines and Material Design principles. Core features: (1) Workout logging: Exercise library with search/filter, quick-add favorites, timer with rest intervals, rep/set tracking, notes field, photo attachments. (2) Progress charts: Weight progression line graphs, body measurements tracking, workout frequency heatmap, personal records timeline, goal progress rings. (3) Social features: Activity feed with likes/comments, friend challenges, achievement badges, leaderboards, workout sharing. (4) Personalized recommendations: AI-suggested workouts based on history, rest day reminders, form tips, nutrition suggestions. Navigation: Bottom tab bar (Home, Workouts, Progress, Social, Profile). Interactions: Swipe gestures for quick actions, pull-to-refresh, haptic feedback, smooth transitions, skeleton loading states. Design system: Motivational color palette (energetic orange/blue), SF Pro/Roboto typography, 4dp/8pt grid, thumb-friendly touch targets (44pt minimum), dark mode support. Include onboarding flow (3 screens), empty states, error handling, and accessibility features (VoiceOver/TalkBack support, dynamic type, high contrast mode).",
    nextIdeas: [
      "Add advanced gesture-based interactions (swipe to delete, long-press menus, pinch-to-zoom charts)",
      "Create comprehensive onboarding flow with progressive disclosure, value demonstration, and permission requests",
      "Design intelligent notification system with workout reminders, achievement celebrations, and friend activity alerts",
    ],
  },

  // Artist Templates
  {
    category: "Artist",
    icon: Palette,
    name: "Digital Art Creator",
    description: "Generate detailed art prompts for AI tools",
    personas: ["creative", "expert", "critic"],
    layers: ["role", "context", "task", "format", "tone", "examples"],
    type: "golden",
    prefill:
      "Create a highly detailed art prompt for AI image generation (Midjourney/DALL-E/Stable Diffusion). Scene: Cyberpunk cityscape at night during heavy rain. Composition: Wide-angle establishing shot from elevated perspective (rule of thirds), strong leading lines from street converging to vanishing point. Key elements: Towering skyscrapers with neon signage (kanji characters, holographic advertisements), flying vehicles with light trails, rain-soaked streets reflecting neon lights (wet asphalt shader), steam rising from grates, crowds with umbrellas, street vendors with glowing food stalls. Lighting: Dramatic chiaroscuro with neon color palette (cyan, magenta, amber), volumetric fog/god rays, rim lighting on characters, practical lights from storefronts. Atmosphere: Moody, noir aesthetic, high contrast, cinematic depth of field (f/2.8), slight lens flare. Style references: Blade Runner (1982) meets Ghost in the Shell (1995), Syd Mead's industrial design, Simon Stålenhag's atmospheric storytelling. Technical parameters: 8K resolution, photorealistic rendering, octane render, unreal engine quality, trending on ArtStation. Negative prompts: cartoon, anime, low quality, blurry, oversaturated.",
    nextIdeas: [
      "Generate lighting and mood variations (golden hour, overcast day, dawn, dusk) with adjusted color palettes",
      "Create detailed character design prompts with costume, pose, expression, and backstory elements",
      "Design style transfer combinations blending multiple artistic movements (impressionism + cyberpunk, art nouveau + sci-fi)",
    ],
  },
  {
    category: "Artist",
    icon: Palette,
    name: "Character Designer",
    description: "Design unique characters with backstories",
    personas: ["creative", "teacher", "strategist"],
    layers: ["role", "context", "task", "format", "examples"],
    type: "context",
    prefill:
      "Design a complete fantasy character with visual and narrative depth. Character concept: Female wood elf ranger, age 127 (appears mid-20s), guardian of the Whisperwood Forest. Physical attributes: Athletic build (5'8\"), sun-kissed tan skin with leaf-pattern tattoos (nature magic conduits), emerald green eyes with golden flecks, long auburn hair in practical braid with small flowers woven in, pointed ears with silver cuff earrings. Costume design: Weathered leather armor (forest green/brown) with embossed leaf motifs, asymmetrical design for mobility, hooded cloak with camouflage enchantment, leather bracers with carved runes, practical boots with silent soles, utility belt with pouches (herbs, arrows, rope). Weapons/equipment: Enchanted longbow (living wood, glows when drawn) with quiver of 20 arrows, dual hunting knives, small satchel with survival gear. Personality indicators: Confident stance, alert expression, slight smile suggesting wisdom, weathered hands showing experience, small scars telling stories. Color palette: Earth tones (forest green, bark brown, moss), accent colors (gold, deep red), magical glow (soft green). Art style: Semi-realistic fantasy illustration, detailed linework, painterly shading. Include front view, side profile, back view, and close-up of face and equipment details.",
    nextIdeas: [
      "Generate complete character turnaround sheet (8 angles) with consistent proportions and details",
      "Create expression sheet showing 12 emotions (joy, anger, surprise, fear, disgust, sadness, etc.) with subtle variations",
      "Design character evolution stages (young apprentice, current form, elder master) showing progression",
    ],
  },
  {
    category: "Artist",
    icon: Palette,
    name: "Concept Artist",
    description: "Environment and world-building concepts",
    personas: ["creative", "strategist", "expert"],
    layers: ["role", "context", "task", "format", "tone"],
    type: "chain",
    prefill:
      "Design a detailed environment concept for a fantasy world. Setting: Floating island civilization suspended 10,000 feet above the clouds. Architecture: Ancient ruins (weathered stone, overgrown with luminescent vines) mixed with steampunk technology (brass pipes, rotating gears, steam vents). Central structure: Massive crystal spire (source of levitation magic) pulsing with blue energy, surrounded by concentric rings of buildings. Districts: (1) Upper tier: Noble estates with hanging gardens, glass domes, observation decks. (2) Middle tier: Market district with airship docks, mechanical elevators, suspension bridges. (3) Lower tier: Industrial zone with foundries, workshops, massive propellers for stabilization. Key features: Waterfalls cascading off edges into clouds below, creating perpetual rainbows; steampunk airships (various sizes) docking at towers; wind turbines harnessing updrafts; floating smaller islands connected by chain bridges. Atmosphere: Golden hour lighting (warm sunset), volumetric clouds, lens flare from crystal, sense of scale (tiny figures for reference). Composition: Dramatic three-quarter view showing depth, strong foreground/midground/background separation, atmospheric perspective. Color palette: Warm golds/oranges (sunset), cool blues (crystal/sky), bronze/copper (steampunk elements), green (vegetation). Art style: Painterly concept art, detailed but loose brushwork, cinematic lighting. Include architectural callouts, scale reference, and material notes.",
    nextIdeas: [
      "Add architectural detail passes focusing on specific buildings (market, temple, airship dock) with floor plans",
      "Generate color palette variations (dawn, midday, dusk, night, storm) with lighting studies",
      "Create comprehensive day/night/weather variants showing how environment transforms (clear, rain, fog, storm, snow)",
    ],
  },

  // Video Generation Templates
  {
    category: "Video",
    icon: Video,
    name: "Marketing Video",
    description: "Promotional and brand videos",
    personas: ["creative", "consultant", "strategist"],
    layers: ["role", "context", "task", "format", "tone", "validation"],
    type: "golden",
    prefill:
      'Create a comprehensive 30-second product launch video for an AI writing assistant targeting content creators and marketers. Marketing framework: Problem-Agitate-Solution (PAS). Structure: (1) Hook (0-3s): Attention-grabbing opening - frustrated writer staring at blank screen, clock ticking. Text overlay: "Writer\'s block costing you time?" (2) Problem (3-10s): Quick cuts showing pain points - missed deadlines, deleted paragraphs, stress. Voiceover: "Every content creator knows the struggle..." (3) Solution introduction (10-18s): Smooth transition to our AI tool interface, clean UI showcase, typing animation showing AI suggestions appearing, satisfied user expression. Voiceover: "Meet [Product Name] - your AI writing partner." (4) Benefits (18-25s): Split-screen showing before/after, metrics appearing (3x faster, 10x ideas, 100% original), happy user working efficiently. (5) CTA (25-30s): Strong closing with product logo, website URL, limited-time offer badge. Text: "Start writing smarter today. 14-day free trial." Visual style: Modern, clean, professional with energetic pacing. Color grading: Warm, inviting tones. Music: Upbeat, motivational (120 BPM). Transitions: Smooth cuts, occasional zoom. Text: Bold, readable, on-brand typography. Include shot list with timings, camera angles, and transition notes.',
    nextIdeas: [
      "Generate A/B testing script variations for different hooks (question, statistic, bold statement) and CTAs",
      "Create detailed storyboard with 12 frames showing key moments, camera angles, and visual effects",
      "Design social media cut-downs optimized for platforms (15s TikTok, 10s Instagram Reels, 6s YouTube Shorts) with platform-specific hooks",
    ],
  },
  {
    category: "Video",
    icon: Video,
    name: "Tutorial Video",
    description: "Educational and how-to content",
    personas: ["teacher", "engineer", "creative"],
    layers: ["role", "context", "task", "format", "examples"],
    type: "chain",
    prefill:
      "Create a comprehensive tutorial video teaching Figma basics to complete beginners (10-12 minutes). Learning objectives: By the end, viewers will be able to navigate Figma interface, create basic shapes, use components, and export assets. Structure: (1) Introduction (0-1min): Welcome, what they'll learn, final project preview (simple mobile app mockup). (2) Interface overview (1-3min): Toolbar walkthrough, layers panel, properties panel, canvas navigation (zoom, pan). Screen recording with cursor highlights and callout annotations. (3) Creating shapes (3-5min): Rectangle, circle, polygon tools; fill and stroke properties; alignment and distribution; grouping. Hands-on example: Create a button. (4) Working with text (5-6min): Text tool, font selection, text properties, text alignment. Example: Add button label. (5) Components (6-9min): What are components, creating a component, using instances, overrides. Example: Turn button into reusable component. (6) Exporting (9-10min): Export settings, formats (PNG, SVG, PDF), resolution options, batch export. (7) Practice project (10-11min): Quick challenge - create a simple card component. (8) Conclusion (11-12min): Recap, next steps, resources. Presentation style: Clear, patient narration; step-by-step demonstrations; pause points for practice; visual callouts for important UI elements; keyboard shortcuts shown; common mistakes highlighted. Include chapter markers, on-screen text for key points, and downloadable practice file.",
    nextIdeas: [
      "Add detailed chapter markers with timestamps and clickable navigation for easy reference",
      "Generate interactive quiz questions at key points to reinforce learning and boost engagement",
      "Create comprehensive supplementary written guide with screenshots, keyboard shortcuts cheat sheet, and troubleshooting section",
    ],
  },
  {
    category: "Video",
    icon: Video,
    name: "Social Media Content",
    description: "Short-form viral content",
    personas: ["creative", "consultant", "critic"],
    layers: ["role", "context", "task", "tone", "constraints"],
    type: "few_shot",
    prefill:
      'Create a viral-optimized 15-second Instagram Reel showcasing 5 productivity hacks for remote workers. Viral content principles: Pattern interrupt, value delivery, shareability. Structure: (1) Hook (0-2s): Attention-grabbing opening - "5 productivity hacks that changed my life" with energetic jump cut. Must stop scroll immediately. (2) Rapid-fire tips (2-13s): Hack 1 (2-4s): Pomodoro timer visual, "25min focus blocks". Hack 2 (4-6s): Dual monitor setup, "2 screens = 2x productivity". Hack 3 (6-8s): Standing desk, "Stand every hour". Hack 4 (8-10s): Noise-canceling headphones, "Block distractions". Hack 5 (10-13s): Time blocking calendar, "Schedule everything". Each hack: 2-second demonstration with bold text overlay. (3) CTA (13-15s): "Follow for more tips!" with profile tag and save reminder. Visual style: Fast-paced jump cuts (every 2s), dynamic camera movements, bold sans-serif text (high contrast), consistent color grading (bright, energetic). Audio: Trending upbeat music (check Instagram audio library), sound effects for transitions. Optimization: Vertical 9:16 format, captions for sound-off viewing, first frame must be compelling thumbnail, hashtag strategy (#productivity #remotework #workhacks). Include shot list, text overlays, transition timing, and trending audio suggestions.',
    nextIdeas: [
      "Generate 10 hook variations for first 3 seconds testing different angles (question, bold claim, relatable problem, shocking statistic)",
      "Create content series strategy with 20 related video ideas maintaining consistent format and branding",
      "Design CTA optimization experiments (follow, save, share, comment) with different end screens and engagement tactics",
    ],
  },

  // Automation Templates
  {
    category: "Automation",
    icon: Cog,
    name: "Zapier Workflow",
    description: "No-code automation workflows",
    personas: ["engineer", "strategist", "consultant"],
    layers: ["role", "context", "task", "format", "validation"],
    type: "chain",
    prefill:
      "Design a production-ready Zapier workflow automating invoice processing for a small business. Business requirement: Monitor Gmail for invoices, extract data, store in Airtable, notify finance team. Workflow steps: (1) Trigger: Gmail - New email matching search (from:invoices@*, subject contains 'invoice'). Filter: Only emails with PDF attachments. (2) Action: Gmail - Download attachment. Store PDF temporarily. (3) Action: Formatter - Extract text from PDF using OCR. Parse invoice number, date, amount, vendor name using regex patterns. (4) Action: Formatter - Date/Time formatting. Convert invoice date to ISO format. (5) Action: Formatter - Number formatting. Clean amount (remove currency symbols, commas). (6) Action: Airtable - Create record. Table: Invoices. Fields: Invoice Number, Date, Amount, Vendor, Status (Pending), PDF URL, Received Date (now). (7) Action: Filter - Only if amount > $1000. (8) Action: Slack - Send message to #finance channel. Message: 'New invoice received: [Vendor] - $[Amount]. Review in Airtable: [Link]'. Include @finance-team mention. Error handling: (1) If PDF extraction fails, send error notification. (2) If duplicate invoice number, update existing record instead. (3) Log all actions to Google Sheets for audit trail. Testing: Include test data examples and expected outputs. Documentation: Workflow diagram, field mappings, and troubleshooting guide.",
    nextIdeas: [
      "Add sophisticated error handling with retry logic (3 attempts with exponential backoff) and fallback notifications",
      "Create conditional branching paths for different invoice types (recurring, one-time, international) with custom processing rules",
      "Generate comprehensive workflow documentation with flowchart, data mapping table, and step-by-step setup guide",
    ],
  },
  {
    category: "Automation",
    icon: Cog,
    name: "n8n Automation",
    description: "Advanced workflow automation",
    personas: ["engineer", "expert", "strategist"],
    layers: ["role", "context", "task", "format", "examples", "validation"],
    type: "context",
    prefill:
      "Build an advanced n8n workflow for competitive price monitoring and dynamic pricing strategy. Business goal: Track competitor prices, analyze trends, automatically adjust our prices to stay competitive while maintaining margins. Workflow architecture: (1) Schedule Trigger: Cron (every 6 hours). (2) HTTP Request nodes: Scrape 5 competitor websites (use rotating proxies to avoid blocks). Extract: Product name, price, availability, last updated. Handle pagination and rate limiting. (3) Function node: Data cleaning and normalization. Remove currency symbols, convert to numbers, standardize product names, handle missing data. (4) PostgreSQL node: Store raw data in 'competitor_prices' table with timestamp. (5) Function node: Price analysis algorithm. Calculate: Average competitor price, price range (min/max), our current position, trend analysis (7-day moving average), price volatility. (6) Decision node: Pricing strategy logic. If our price > avg + 10%: Flag for review. If competitor dropped price > 15%: Trigger alert. If we're cheapest by > 20%: Consider price increase. (7) PostgreSQL node: Update 'our_products' table with recommended prices. (8) HTTP Request: Update prices in Shopify via API (only if within margin thresholds). (9) Slack notification: Send daily summary report with: Price changes made, products flagged for review, competitor insights, revenue impact estimate. (10) Google Sheets: Log all price changes for audit trail. Error handling: Retry failed requests (3x), fallback to cached data if scraping fails, alert on critical errors. Include: Node configuration details, SQL queries, JavaScript functions, API authentication, and monitoring setup.",
    nextIdeas: [
      "Add advanced data transformation nodes with machine learning price prediction using historical data",
      "Create scheduled execution triggers with intelligent timing based on competitor update patterns and traffic analysis",
      "Implement comprehensive webhook integrations for real-time price alerts and Slack/Discord notifications with custom formatting",
    ],
  },
  {
    category: "Automation",
    icon: Cog,
    name: "Make.com Scenario",
    description: "Visual automation scenarios",
    personas: ["engineer", "consultant", "teacher"],
    layers: ["role", "context", "task", "format", "constraints"],
    type: "golden",
    prefill:
      "Design a comprehensive Make.com scenario for customer data synchronization across Shopify, Mailchimp, and Google Sheets with data validation and deduplication. Business requirement: Maintain single source of truth for customer data across platforms, prevent duplicates, enrich data, ensure GDPR compliance. Scenario flow: (1) Trigger: Shopify - Watch new customers (webhook). Receives: Customer ID, email, name, phone, address, tags, created date. (2) Data validation module: Check email format (regex), validate phone number format, ensure required fields present, flag incomplete records. (3) Deduplication check: Search Google Sheets for existing email. If found: Compare data, update if newer, skip if duplicate. If not found: Proceed to create. (4) Data enrichment: Use Clearbit API to enrich with company data, job title, social profiles. Timeout: 5 seconds, continue if fails. (5) Router (parallel paths): Path A - Mailchimp: Check if subscriber exists. If yes: Update subscriber with new data, add tags. If no: Create subscriber, add to 'New Customers' segment, trigger welcome email. Path B - Google Sheets: Append row with: Customer ID, Email, Name, Phone, Address, Tags, Source (Shopify), Created Date, Last Updated, Enrichment Data. Path C - Airtable: Create record in 'Customers' base for CRM tracking. (6) Aggregator: Wait for all paths to complete. (7) Error handling: If any path fails, log to error sheet, send Slack notification to #ops channel, retry after 5 minutes. (8) GDPR compliance: Check for opt-out requests, respect email preferences, log all data processing. (9) Confirmation: Send success notification with summary (records processed, duplicates found, errors). Include: Module configuration, data mapping tables, filter conditions, error handling logic, and testing checklist.",
    nextIdeas: [
      "Add multi-step approval workflows for high-value customers requiring manual review before sync",
      "Create data enrichment modules using multiple APIs (Clearbit, FullContact, Hunter.io) with fallback logic",
      "Generate scenario templates library for common use cases (e-commerce, SaaS, B2B) with customization guides",
    ],
  },
]

export default function Home() {
  const [userInput, setUserInput] = useState("")
  const [selectedPersonas, setSelectedPersonas] = useState<string[]>(["expert"])
  const [selectedLayers, setSelectedLayers] = useState<string[]>(["role", "context", "task", "format"])
  const [promptType, setPromptType] = useState("golden")
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [temperature, setTemperature] = useState("balanced")
  const [complexity, setComplexity] = useState("intermediate")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activePresetIndex, setActivePresetIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [remixMode, setRemixMode] = useState(false)
  const [currentTemplate, setCurrentTemplate] = useState<QuickStartTemplate | null>(null)

  const [isGenerating, setIsGenerating] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success")
  const [savedConfigs, setSavedConfigs] = useState<SavedConfig[]>([])
  const [promptHistory, setPromptHistory] = useState<GeneratedPromptHistory[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const [configName, setConfigName] = useState("")
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showImportExport, setShowImportExport] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const tourSteps = [
    {
      target: "user-input",
      title: "Start with Your Task",
      content:
        "Describe what you want to accomplish. Be specific about your goal - the more context you provide, the better your prompt will be.",
      position: "bottom" as const,
      action: "Try typing: 'Help me analyze market trends for a new SaaS product'",
    },
    {
      target: "prompt-type",
      title: "Choose Your Prompt Type",
      content:
        "Different prompt types serve different purposes. Golden Prompts are comprehensive and production-ready, while Chain-of-Thought is great for complex reasoning.",
      position: "bottom" as const,
    },
    {
      target: "personas",
      title: "Select AI Personas",
      content:
        "Personas bring different expertise and perspectives. Combine 2-3 complementary personas for balanced, multi-faceted analysis.",
      position: "right" as const,
      action: "Try selecting Expert Analyst and Strategic Planner",
    },
    {
      target: "layers",
      title: "Configure Prompt Layers",
      content:
        "Layers are the building blocks of your prompt. Start with essential layers (Role, Context, Task), then add others based on your needs.",
      position: "right" as const,
    },
    {
      target: "generate",
      title: "Generate Your Prompt",
      content:
        "Click Generate (or press Cmd+Enter) to create your custom prompt. You can then copy it and use it with any AI tool.",
      position: "top" as const,
      action: "Click the Generate button to see your prompt!",
    },
  ]

  useEffect(() => {
    const saved = localStorage.getItem("promptConfigs")
    const history = localStorage.getItem("promptHistory")
    if (saved) setSavedConfigs(JSON.parse(saved))
    if (history) setPromptHistory(JSON.parse(history))
  }, [])

  useEffect(() => {
    localStorage.setItem("promptConfigs", JSON.stringify(savedConfigs))
  }, [savedConfigs])

  useEffect(() => {
    localStorage.setItem("promptHistory", JSON.stringify(promptHistory))
  }, [promptHistory])

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Enter to generate
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault()
        if (userInput.trim() && selectedPersonas.length > 0 && selectedLayers.length > 0) {
          generatePrompt()
        }
      }
      // Cmd/Ctrl + S to save config
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault()
        setShowSaveDialog(true)
      }
      // Cmd/Ctrl + K to focus search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        textareaRef.current?.focus()
      }
      // Cmd/Ctrl + H to show history
      if ((e.metaKey || e.ctrlKey) && e.key === "h") {
        e.preventDefault()
        setShowHistory(!showHistory)
      }
      // Escape to close modals
      if (e.key === "Escape") {
        setShowHistory(false)
        setShowSaved(false)
        setShowKeyboardShortcuts(false)
        setShowSaveDialog(false)
        // Close Import/Export modal on Escape
        setShowImportExport(false)
      }
      // ? to show keyboard shortcuts
      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        setShowKeyboardShortcuts(!showKeyboardShortcuts)
      }
    }

    window.addEventListener("keydown", handleKeyboard)
    return () => window.removeEventListener("keydown", handleKeyboard)
  }, [userInput, selectedPersonas, selectedLayers, showHistory, showKeyboardShortcuts])

  const showNotification = (message: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  useEffect(() => {
    if (isPaused) return

    const filteredTemplates =
      selectedCategory === "All"
        ? QUICK_START_TEMPLATES
        : QUICK_START_TEMPLATES.filter((t) => t.category === selectedCategory)

    const interval = setInterval(() => {
      setActivePresetIndex((prev) => (prev + 1) % filteredTemplates.length)
    }, 3000) // Rotate every 3 seconds

    return () => clearInterval(interval)
  }, [isPaused, selectedCategory])

  const togglePersona = (personaId: string) => {
    setSelectedPersonas((prev) =>
      prev.includes(personaId) ? prev.filter((id) => id !== personaId) : [...prev, personaId],
    )
  }

  const toggleLayer = (layerId: string) => {
    setSelectedLayers((prev) => (prev.includes(layerId) ? prev.filter((id) => id !== layerId) : [...prev, layerId]))
  }

  const loadPreset = (preset: QuickStartTemplate, isRemix = false) => {
    setSelectedPersonas(preset.personas)
    setSelectedLayers(preset.layers)
    setPromptType(preset.type)
    setUserInput(preset.prefill)
    setCurrentTemplate(preset)
    setRemixMode(isRemix)

    if (!isRemix) {
      // Auto-generate if not in remix mode
      setTimeout(() => {
        generatePrompt()
      }, 100)
    } else {
      showNotification("Template loaded in remix mode. Customize and generate!", "info")
    }
  }

  const selectAllPersonas = () => setSelectedPersonas(PERSONAS.map((p) => p.id))
  const clearAllPersonas = () => setSelectedPersonas([])
  const selectEssentialLayers = () => setSelectedLayers(PROMPT_LAYERS.filter((l) => l.essential).map((l) => l.id))
  const selectAllLayers = () => setSelectedLayers(PROMPT_LAYERS.map((l) => l.id))
  const clearAllLayers = () => setSelectedLayers([])

  const categories = ["All", ...Array.from(new Set(QUICK_START_TEMPLATES.map((t) => t.category)))]
  const filteredTemplates =
    selectedCategory === "All"
      ? QUICK_START_TEMPLATES
      : QUICK_START_TEMPLATES.filter((t) => t.category === selectedCategory)

  const generatePrompt = async () => {
    if (!userInput.trim()) {
      showNotification("Please enter your task or question", "error")
      return
    }
    if (selectedPersonas.length === 0) {
      showNotification("Please select at least one persona", "error")
      return
    }
    if (selectedLayers.length === 0) {
      showNotification("Please select at least one layer", "error")
      return
    }

    setIsGenerating(true)

    // Simulate generation delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 800))

    try {
      const personas = PERSONAS.filter((p) => selectedPersonas.includes(p.id))
      const layers = PROMPT_LAYERS.filter((l) => selectedLayers.includes(l.id))

      let prompt = ""

      switch (promptType) {
        case "golden":
          prompt = generateGoldenPrompt(userInput, personas, layers)
          break
        case "meta":
          prompt = generateMetaPrompt(userInput, personas, layers)
          break
        case "context":
          prompt = generateContextEngineered(userInput, personas, layers)
          break
        case "chain":
          prompt = generateChainOfThought(userInput, personas, layers)
          break
        case "few_shot":
          prompt = generateFewShot(userInput, personas, layers)
          break
        case "zero_shot":
          prompt = generateZeroShot(userInput, personas, layers)
          break
        case "system":
          prompt = generateSystemInstruction(userInput, personas, layers)
          break
        case "recursive":
          prompt = generateRecursive(userInput, personas, layers)
          break
      }

      setGeneratedPrompt(prompt)

      const historyEntry: GeneratedPromptHistory = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        prompt,
        config: {
          id: Date.now().toString(),
          name: `Generated ${new Date().toLocaleString()}`,
          timestamp: Date.now(),
          userInput,
          selectedPersonas,
          selectedLayers,
          promptType,
          temperature,
          complexity,
        },
      }
      setPromptHistory((prev) => [historyEntry, ...prev].slice(0, 50)) // Keep last 50

      showNotification("Prompt generated successfully!", "success")
      setRemixMode(false)
    } catch (error) {
      showNotification("Error generating prompt. Please try again.", "error")
      console.error("[v0] Generation error:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const saveConfiguration = () => {
    if (!configName.trim()) {
      showNotification("Please enter a configuration name", "error")
      return
    }

    const config: SavedConfig = {
      id: Date.now().toString(),
      name: configName,
      timestamp: Date.now(),
      userInput,
      selectedPersonas,
      selectedLayers,
      promptType,
      temperature,
      complexity,
      isFavorite: false,
    }

    setSavedConfigs((prev) => [config, ...prev])
    setConfigName("")
    setShowSaveDialog(false)
    showNotification(`Configuration "${configName}" saved!`, "success")
  }

  const loadConfiguration = (config: SavedConfig) => {
    setUserInput(config.userInput)
    setSelectedPersonas(config.selectedPersonas)
    setSelectedLayers(config.selectedLayers)
    setPromptType(config.promptType)
    setTemperature(config.temperature)
    setComplexity(config.complexity)
    setShowSaved(false)
    showNotification(`Configuration "${config.name}" loaded!`, "success")
  }

  const deleteConfiguration = (id: string) => {
    setSavedConfigs((prev) => prev.filter((c) => c.id !== id))
    showNotification("Configuration deleted", "info")
  }

  const toggleFavorite = (id: string) => {
    setSavedConfigs((prev) => prev.map((c) => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c)))
  }

  const deleteHistoryEntry = (id: string) => {
    setPromptHistory((prev) => prev.filter((h) => h.id !== id))
    showNotification("History entry deleted", "info")
  }

  const loadFromHistory = (entry: GeneratedPromptHistory) => {
    setUserInput(entry.config.userInput)
    setSelectedPersonas(entry.config.selectedPersonas)
    setSelectedLayers(entry.config.selectedLayers)
    setPromptType(entry.config.promptType)
    setTemperature(entry.config.temperature)
    setComplexity(entry.config.complexity)
    setGeneratedPrompt(entry.prompt)
    setShowHistory(false)
    showNotification("Loaded from history", "success")
  }

  const handleImportComplete = (data: any) => {
    // Refresh data from localStorage
    const configs = localStorage.getItem("promptConfigs") // Corrected key name
    if (configs) {
      setSavedConfigs(JSON.parse(configs))
    }
    const history = localStorage.getItem("promptHistory")
    if (history) {
      setPromptHistory(JSON.parse(history))
    }
    showNotification("Import completed successfully!", "success")
  }

  const generateGoldenPrompt = (input: string, personas: Persona[], layers: PromptLayer[]) => {
    let prompt = "# GOLDEN PROMPT\n\n"

    if (layers.find((l) => l.id === "role")) {
      prompt += "## ROLE & EXPERTISE\n"
      personas.forEach((p) => {
        prompt += `You are a ${p.name}: ${p.description}\n`
      })
      prompt += "\n"
    }

    if (layers.find((l) => l.id === "context")) {
      prompt += "## CONTEXT\n"
      prompt += `Task Domain: ${input || "[User will specify their task]"}\n`
      prompt += `Complexity Level: ${complexity}\n`
      prompt += `Temperature Setting: ${temperature}\n\n`
    }

    if (layers.find((l) => l.id === "task")) {
      prompt += "## PRIMARY OBJECTIVE\n"
      prompt += `${input || "[Define your specific goal here]"}\n\n`
      prompt += "### Success Criteria:\n"
      prompt += "- Comprehensive coverage of all aspects\n"
      prompt += "- Actionable and practical recommendations\n"
      prompt += "- Clear reasoning and justification\n"
      prompt += "- Consideration of edge cases\n\n"
    }

    if (layers.find((l) => l.id === "format")) {
      prompt += "## OUTPUT FORMAT\n"
      prompt += "1. Executive Summary\n"
      prompt += "2. Detailed Analysis\n"
      prompt += "3. Step-by-Step Recommendations\n"
      prompt += "4. Potential Challenges & Solutions\n"
      prompt += "5. Next Steps\n\n"
    }

    if (layers.find((l) => l.id === "constraints")) {
      prompt += "## CONSTRAINTS & GUIDELINES\n"
      prompt += "- Maintain professional tone\n"
      prompt += "- Cite sources when applicable\n"
      prompt += "- Avoid assumptions without stating them\n"
      prompt += "- Consider multiple perspectives\n\n"
    }

    if (layers.find((l) => l.id === "validation")) {
      prompt += "## VALIDATION CHECKLIST\n"
      prompt += "Before finalizing, ensure:\n"
      prompt += "□ All requirements addressed\n"
      prompt += "□ Logic is sound and consistent\n"
      prompt += "□ Examples are relevant and clear\n"
      prompt += "□ Recommendations are actionable\n"
    }

    return prompt
  }

  const generateMetaPrompt = (input: string, personas: Persona[], layers: PromptLayer[]) => {
    return `#META PROMPT: Prompt Engineering Assistant

## YOUR ROLE
You are an expert prompt engineer who helps users create optimal prompts for AI systems.

## TASK
Analyze the user's request and generate a highly effective prompt that:
1. Clearly defines the AI's role and expertise
2. Provides comprehensive context
3. Specifies exact deliverables
4. Includes relevant examples
5. Sets appropriate constraints

## USER'S REQUEST
${input || "[User will describe what they want to accomplish]"}

## SELECTED PERSONAS
${personas.map((p) => `- ${p.name}: ${p.description}`).join("\n")}

## ACTIVE LAYERS
${layers.map((l) => `- ${l.name}: ${l.description}`).join("\n")}

## YOUR OUTPUT
Generate a complete, production-ready prompt that incorporates:
- Role definition with specific expertise areas
- Detailed context and background
- Clear task specification with success criteria
- Output format requirements
- Relevant examples (if applicable)
- Constraints and guidelines
- Validation criteria

## META-INSTRUCTIONS
1. First, analyze what makes this request unique
2. Identify potential ambiguities or gaps
3. Design the prompt structure
4. Generate the complete prompt
5. Add a brief explanation of your design choices

Begin your analysis and prompt generation now.`
  }

  const generateContextEngineered = (input: string, personas: Persona[], layers: PromptLayer[]) => {
    return `# CONTEXT-ENGINEERED PROMPT

## ENVIRONMENTAL CONTEXT
- **Domain**: ${input || "[Specify domain]"}
- **Complexity**: ${complexity}
- **Audience**: ${personas.map((p) => p.name).join(", ")}
- **Temperature**: ${temperature}

## SITUATIONAL FRAMING
You are operating in a scenario where:
- Precision and accuracy are critical
- Multiple perspectives must be considered
- Practical implementation is the end goal
- Trade-offs must be explicitly stated

## PERSONA SYNTHESIS
${personas
  .map(
    (p, i) => `
### Persona ${i + 1}: ${p.name}
**Perspective**: ${p.description}
**Key Contribution**: Brings ${p.name.toLowerCase()} viewpoint to the analysis
`,
  )
  .join("\n")}

## LAYERED CONTEXT STACK
${layers
  .map(
    (l, i) => `
**Layer ${i + 1} - ${l.name}**
${l.description}
`,
  )
  .join("\n")}

## PRIMARY DIRECTIVE
${input || "[Your specific task or question]"}

## CONTEXTUAL CONSTRAINTS
- Consider historical precedents
- Account for current best practices
- Anticipate future implications
- Balance theory with practicality

## OUTPUT REQUIREMENTS
Provide a response that:
1. Acknowledges all contextual layers
2. Integrates multiple persona perspectives
3. Delivers actionable insights
4. Includes reasoning transparency
5. Addresses potential objections

## QUALITY GATES
Your response must pass these checks:
✓ Contextually appropriate
✓ Persona-aligned
✓ Practically implementable
✓ Comprehensively reasoned
✓ Edge-case aware`
  }

  const generateChainOfThought = (input: string, personas: Persona[], layers: PromptLayer[]) => {
    return `# CHAIN-OF-THOUGHT PROMPT

## INSTRUCTION
Think through this problem step-by-step, showing your reasoning at each stage.

## PROBLEM
${input || "[Describe the problem or task]"}

## THINKING PROCESS
Follow this structured reasoning approach:

### Step 1: Problem Decomposition
- Break down the problem into smaller components
- Identify key variables and constraints
- List assumptions that need validation

### Step 2: Information Gathering
- What information do we have?
- What information is missing?
- What can we infer?

### Step 3: Analysis
${personas.map((p) => `- From ${p.name} perspective: [analyze]`).join("\n")}

### Step 4: Solution Development
- Generate potential approaches
- Evaluate pros and cons of each
- Select optimal path forward

### Step 5: Validation
- Test solution against requirements
- Check for logical consistency
- Identify potential issues

### Step 6: Refinement
- Optimize the solution
- Address edge cases
- Finalize recommendations

## OUTPUT FORMAT
For each step, explicitly show:
1. Your thinking process
2. Key insights discovered
3. Decisions made and why
4. Confidence level in conclusions

Begin your step-by-step analysis now.`
  }

  const generateFewShot = (input: string, personas: Persona[], layers: PromptLayer[]) => {
    return `# FEW-SHOT LEARNING PROMPT

## TASK
${input || "[Describe the task]"}

## EXAMPLES

### Example 1:
**Input**: "How do I improve my website's performance?"
**Output**: 
"To improve website performance:
1. **Optimize Images**: Compress and use modern formats (WebP)
2. **Minimize HTTP Requests**: Combine files, use CSS sprites
3. **Enable Caching**: Implement browser and server-side caching
4. **Use CDN**: Distribute content globally
5. **Minify Code**: Remove unnecessary characters from CSS/JS

Expected improvement: 40-60% faster load times"

### Example 2:
**Input**: "What's the best way to learn programming?"
**Output**:
"Effective programming learning strategy:
1. **Start with Fundamentals**: Variables, loops, functions
2. **Build Projects**: Apply knowledge practically
3. **Read Others' Code**: Learn from experienced developers
4. **Debug Regularly**: Develop problem-solving skills
5. **Join Communities**: Get feedback and support

Timeline: 3-6 months to basic proficiency"

### Example 3:
**Input**: "How can I make better decisions?"
**Output**:
"Decision-making framework:
1. **Define the Problem**: Clarify what needs deciding
2. **Gather Information**: Research relevant data
3. **List Options**: Generate alternatives
4. **Evaluate Trade-offs**: Pros/cons analysis
5. **Make Choice**: Commit and act

Key: Balance analysis with action"

## YOUR TURN
Now apply this same pattern to:
**Input**: ${input || "[Your specific question]"}

**Output**: [Generate response following the examples' structure and quality]`
  }

  const generateZeroShot = (input: string, personas: Persona[], layers: PromptLayer[]) => {
    return `# ZERO-SHOT PROMPT

## ROLE
${personas.map((p) => `You are a ${p.name} with expertise in ${p.description.toLowerCase()}`).join(". ")}

## TASK
${input || "[Describe what you need]"}

## REQUIREMENTS
- Provide comprehensive analysis
- Use clear, structured formatting
- Include specific examples
- Explain your reasoning
- Offer actionable recommendations

## APPROACH
Without prior examples, use your knowledge and reasoning to:
1. Understand the core request
2. Apply relevant principles
3. Generate high-quality output
4. Ensure practical applicability

## CONSTRAINTS
- Be concise yet thorough
- Avoid jargon unless necessary
- Provide evidence for claims
- Consider multiple angles

Proceed with your response.`
  }

  const generateSystemInstruction = (input: string, personas: Persona[], layers: PromptLayer[]) => {
    return `# SYSTEM INSTRUCTION

## CORE IDENTITY
${personas.map((p, i) => `${i > 0 ? "Additionally, you are" : "You are"} a ${p.name}: ${p.description}`).join(". ")}.

## OPERATIONAL PARAMETERS
- **Complexity Level**: ${complexity}
- **Response Style**: ${temperature}
- **Active Layers**: ${selectedLayers.length}/${PROMPT_LAYERS.length}

## BEHAVIORAL GUIDELINES
${layers.map((l) => `- **${l.name}**: ${l.description}`).join("\n")}

## PRIMARY FUNCTION
${input || "[Define the AI's primary function]"}

## RESPONSE PROTOCOL
1. Analyze user input thoroughly
2. Apply relevant expertise from your personas
3. Structure response according to active layers
4. Validate output against quality criteria
5. Deliver clear, actionable insights

## QUALITY STANDARDS
- Accuracy: Verify all factual claims
- Clarity: Use simple language when possible
- Completeness: Address all aspects of the query
- Practicality: Ensure recommendations are implementable
- Reasoning: Show your thought process

## INTERACTION STYLE
- Professional yet approachable
- Patient and thorough
- Proactive in identifying ambiguities
- Transparent about limitations

## ERROR HANDLING
If uncertain:
- State your confidence level
- Explain what information would help
- Offer alternative approaches
- Never fabricate information

This system instruction governs all subsequent interactions.`
  }

  const generateRecursive = (input: string, personas: Persona[], layers: PromptLayer[]) => {
    return `# RECURSIVE REFINEMENT PROMPT

## INITIAL PROMPT
${input || "[Your initial request]"}

## REFINEMENT PROCESS

### Iteration 1: Initial Response
Generate a first-pass response to the request above.

### Iteration 2: Self-Critique
Now critique your own response:
- What's missing?
- What could be clearer?
- What assumptions did you make?
- What edge cases weren't addressed?

### Iteration 3: Enhanced Response
Based on your critique, generate an improved version that:
- Fills identified gaps
- Clarifies ambiguous points
- Validates assumptions
- Addresses edge cases

### Iteration 4: Persona Integration
Enhance further by incorporating perspectives from:
${personas.map((p) => `- ${p.name}: ${p.description}`).join("\n")}

### Iteration 5: Layer Optimization
Ensure all required layers are thoroughly addressed:
${layers.map((l) => `- ${l.name}: ${l.description}`).join("\n")}

### Iteration 6: Final Polish
- Optimize structure and flow
- Ensure consistency
- Add relevant examples
- Verify completeness

## OUTPUT
Provide your final, recursively refined response that represents the best possible answer after multiple iterations of improvement.

## META-REFLECTION
After your final response, briefly explain:
1. How each iteration improved the output
2. What key insights emerged through refinement
3. What trade-offs you made

Begin the recursive refinement process now.`
  }

  const copyToClipboard = async (format: "plain" | "markdown" | "json" = "plain") => {
    let content = generatedPrompt

    if (format === "json") {
      content = JSON.stringify(
        {
          prompt: generatedPrompt,
          config: {
            userInput,
            selectedPersonas,
            selectedLayers,
            promptType,
            temperature,
            complexity,
          },
          timestamp: new Date().toISOString(),
        },
        null,
        2,
      )
    }

    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      showNotification(`Copied as ${format}!`, "success")
    } catch (error) {
      showNotification("Failed to copy", "error")
    }
  }

  const downloadPrompt = (format: "txt" | "md" | "json" = "txt") => {
    let content = generatedPrompt
    let mimeType = "text/plain"
    const extension = format

    if (format === "json") {
      content = JSON.stringify(
        {
          prompt: generatedPrompt,
          config: {
            userInput,
            selectedPersonas,
            selectedLayers,
            promptType,
            temperature,
            complexity,
          },
          timestamp: new Date().toISOString(),
        },
        null,
        2,
      )
      mimeType = "application/json"
    } else if (format === "md") {
      mimeType = "text/markdown"
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${promptType}-prompt-${Date.now()}.${extension}`
    a.click()
    URL.revokeObjectURL(url)
    showNotification(`Downloaded as ${format.toUpperCase()}!`, "success")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <GuidedTour tourId="main-app" steps={tourSteps} />

      {showToast && (
        <div
          className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300"
          role="alert"
          aria-live="polite"
        >
          <Card
            className={`p-4 shadow-lg border-2 ${
              toastType === "success"
                ? "border-green-500/50 bg-green-500/10"
                : toastType === "error"
                  ? "border-red-500/50 bg-red-500/10"
                  : "border-blue-500/50 bg-blue-500/10"
            }`}
          >
            <div className="flex items-center gap-3">
              {toastType === "success" && <Check className="w-5 h-5 text-green-500" />}
              {toastType === "error" && <AlertCircle className="w-5 h-5 text-red-500" />}
              {toastType === "info" && <Info className="w-5 h-5 text-blue-500" />}
              <span className="font-medium">{toastMessage}</span>
            </div>
          </Card>
        </div>
      )}

      {showKeyboardShortcuts && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowKeyboardShortcuts(false)}
        >
          <Card className="max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Keyboard className="w-5 h-5" />
                Keyboard Shortcuts
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setShowKeyboardShortcuts(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Generate Prompt</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">⌘ + Enter</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Save Configuration</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">⌘ + S</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Focus Input</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">⌘ + K</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Toggle History</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">⌘ + H</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Close Modals</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Esc</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Show Shortcuts</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">?</kbd>
              </div>
            </div>
          </Card>
        </div>
      )}

      {showSaveDialog && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowSaveDialog(false)}
        >
          <Card className="max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Save Configuration</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="config-name">Configuration Name</Label>
                <Input
                  id="config-name"
                  placeholder="e.g., My Golden Prompt Setup"
                  value={configName}
                  onChange={(e) => setConfigName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveConfiguration()}
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={saveConfiguration} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {showHistory && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowHistory(false)}
        >
          <Card
            className="max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <History className="w-5 h-5" />
                Prompt History ({promptHistory.length})
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setShowHistory(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {promptHistory.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No history yet. Generate your first prompt!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {promptHistory.map((entry) => (
                    <Card key={entry.id} className="p-4 hover:bg-accent/50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium mb-1">{entry.config.userInput.slice(0, 100)}...</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{new Date(entry.timestamp).toLocaleString()}</span>
                            <span>•</span>
                            <Badge variant="outline" className="text-xs">
                              {entry.config.promptType}
                            </Badge>
                            <span>•</span>
                            <span>{entry.prompt.length} chars</span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => loadFromHistory(entry)} title="Load">
                            <FolderOpen className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteHistoryEntry(entry.id)} title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {showSaved && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowSaved(false)}
        >
          <Card
            className="max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Save className="w-5 h-5" />
                Saved Configurations ({savedConfigs.length})
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setShowSaved(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {savedConfigs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Save className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No saved configurations yet.</p>
                  <p className="text-sm mt-2">Press ⌘+S to save your current setup</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedConfigs.map((config) => (
                    <Card key={config.id} className="p-4 hover:bg-accent/50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium">{config.name}</p>
                            {config.isFavorite && <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{config.userInput.slice(0, 80)}...</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{new Date(config.timestamp).toLocaleDateString()}</span>
                            <span>•</span>
                            <Badge variant="outline" className="text-xs">
                              {config.promptType}
                            </Badge>
                            <span>•</span>
                            <span>{config.selectedPersonas.length} personas</span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFavorite(config.id)}
                            title="Toggle Favorite"
                          >
                            <Star className={`w-4 h-4 ${config.isFavorite ? "fill-yellow-500 text-yellow-500" : ""}`} />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => loadConfiguration(config)} title="Load">
                            <FolderOpen className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteConfiguration(config.id)}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {showImportExport && (
        <ImportExportManager onClose={() => setShowImportExport(false)} onImport={handleImportComplete} />
      )}

      <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
        <header className="text-center space-y-3 mb-8 px-4">
          <div className="flex items-center justify-center gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 bg-primary/10 rounded-xl">
              <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Prompt Engineering Academy
            </h1>
          </div>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
            Generate golden prompts, meta prompts, and context-engineered prompts with advanced persona and layer
            customization
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-4 px-2">
            <Link href="/templates">
              <Button variant="outline" size="sm" className="gap-1.5 md:gap-2 bg-transparent text-xs md:text-sm">
                <Library className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Template Gallery</span>
                <span className="sm:hidden">Templates</span>
              </Button>
            </Link>
            <Link href="/tutorials">
              <Button variant="outline" size="sm" className="gap-1.5 md:gap-2 bg-transparent text-xs md:text-sm">
                <GraduationCap className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Tutorials</span>
                <span className="sm:hidden">Learn</span>
              </Button>
            </Link>
            <Link href="/library">
              <Button variant="outline" size="sm" className="gap-1.5 md:gap-2 bg-transparent text-xs md:text-sm">
                <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Prompt Library</span>
                <span className="sm:hidden">Library</span>
              </Button>
            </Link>
            <Link href="/help">
              <Button variant="outline" size="sm" className="gap-1.5 md:gap-2 bg-transparent text-xs md:text-sm">
                <HelpCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Help Center</span>
                <span className="sm:hidden">Help</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSaved(true)}
              className="gap-1.5 md:gap-2 text-xs md:text-sm"
            >
              <FolderOpen className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Saved ({savedConfigs.length})</span>
              <span className="sm:hidden">({savedConfigs.length})</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(true)}
              className="gap-1.5 md:gap-2 text-xs md:text-sm"
            >
              <History className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">History ({promptHistory.length})</span>
              <span className="sm:hidden">({promptHistory.length})</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSaveDialog(true)}
              className="gap-1.5 md:gap-2 text-xs md:text-sm"
            >
              <Save className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Save Config</span>
              <span className="sm:hidden">Save</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowKeyboardShortcuts(true)}
              className="gap-1.5 md:gap-2 text-xs md:text-sm hidden md:flex"
            >
              <Keyboard className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Shortcuts
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowImportExport(true)}
              className="gap-1.5 md:gap-2 text-xs md:text-sm"
            >
              <Upload className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Import/Export</span>
              <span className="sm:hidden">I/E</span>
            </Button>
            <Link href="/compare">
              <Button variant="outline" size="sm" className="gap-1.5 md:gap-2 bg-transparent text-xs md:text-sm">
                <GitCompare className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Compare</span>
              </Button>
            </Link>
          </div>
        </header>

        <InlineHelp type="tip" className="mb-6">
          <strong>Pro Tip:</strong> New to prompt engineering? Try a Quick Start Template below to see how different
          configurations work. Click "Use Template" for instant results or "Remix" to customize before generating.
        </InlineHelp>

        <Card className="p-4 md:p-6 mb-6 bg-gradient-to-r from-accent/30 via-primary/10 to-secondary/20 border-primary/30 shadow-lg">
          <div className="flex flex-col md:flex-row items-start gap-4">
            <Wand2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
                <h3 className="font-semibold text-base md:text-lg">Quick Start Templates</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? "default" : "ghost"}
                      size="sm"
                      onClick={() => {
                        setSelectedCategory(cat)
                        setActivePresetIndex(0)
                      }}
                      className="h-7 text-xs"
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mb-4">
                Pre-configured templates for developers, designers, artists, video creators, and automation experts •
                Auto-rotating every 3 seconds
              </p>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {filteredTemplates.map((preset, index) => {
                  const Icon = preset.icon
                  const isActive = activePresetIndex === index
                  return (
                    <Card
                      key={preset.name}
                      className={`p-4 transition-all duration-300 cursor-pointer ${
                        isActive
                          ? "scale-105 shadow-lg ring-2 ring-primary/50 bg-primary/5"
                          : "hover:bg-accent/50 hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm mb-1">{preset.name}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">{preset.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => loadPreset(preset, false)}
                          className="flex-1 h-8 text-xs"
                        >
                          Use Template
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => loadPreset(preset, true)}
                          className="h-8 px-2"
                          title="Remix this template"
                        >
                          <Shuffle className="w-3 h-3" />
                        </Button>
                      </div>
                    </Card>
                  )
                })}
              </div>

              {currentTemplate && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Next Ideas for {currentTemplate.name}
                  </h4>
                  <ul className="space-y-1">
                    {currentTemplate.nextIdeas.map((idea, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{idea}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center gap-2 mt-4">
                {filteredTemplates.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      activePresetIndex === index ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </Card>

        {remixMode && currentTemplate && (
          <Card className="p-4 mb-6 bg-secondary/20 border-secondary">
            <div className="flex items-center gap-3">
              <Pencil className="w-5 h-5 text-secondary" />
              <div className="flex-1">
                <h4 className="font-semibold text-sm">Remix Mode: {currentTemplate.name}</h4>
                <p className="text-xs text-muted-foreground">
                  Customize the template below and generate your unique prompt
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setRemixMode(false)
                  setCurrentTemplate(null)
                }}
              >
                Exit Remix
              </Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-4 md:gap-6">
          {/* Left Panel - Configuration */}
          <div className="space-y-4 md:space-y-6">
            <Card className="p-4 md:p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="user-input" className="text-lg font-semibold">
                      Your Task or Question
                    </Label>
                    <HelpTooltip
                      title="Task Input"
                      content="Describe your goal as specifically as possible. Include context about what you're trying to accomplish, who the audience is, and any constraints or requirements."
                      example="Instead of 'help me write code', try 'Create a React component for a pricing card with three tiers, hover effects, and mobile responsiveness'"
                      learnMoreUrl="/help"
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{userInput.length} characters</span>
                </div>
                <Textarea
                  id="user-input"
                  ref={textareaRef}
                  placeholder="Example: Help me analyze market trends for a new SaaS product targeting small businesses..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="min-h-[140px] resize-none text-base"
                  aria-label="Task or question input"
                />
                <p className="text-xs text-muted-foreground flex items-start gap-2">
                  <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    Be specific about your goal. The more context you provide, the better the generated prompt will be.
                  </span>
                </p>
              </div>
            </Card>

            <Card className="p-4 md:p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label className="text-lg font-semibold flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Prompt Type
                  </Label>
                  <HelpTooltip
                    title="Prompt Types"
                    content="Different prompt types are optimized for different use cases. Golden Prompts are comprehensive and production-ready. Chain-of-Thought shows reasoning steps. Meta Prompts help you create better prompts."
                    learnMoreUrl="/help"
                    position="bottom"
                  />
                </div>
                <Select value={promptType} onValueChange={setPromptType} aria-label="Select prompt type">
                  <SelectTrigger className="h-auto py-3" id="prompt-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PROMPT_TYPES).map(([key, data]) => (
                      <SelectItem key={key} value={key} className="py-3">
                        <div className="flex items-center justify-between gap-4 w-full">
                          <div className="flex-1">
                            <div className="font-medium">{data.name}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{data.description}</div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {data.difficulty}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">
                      {PROMPT_TYPES[promptType as keyof typeof PROMPT_TYPES].name}:
                    </strong>{" "}
                    {PROMPT_TYPES[promptType as keyof typeof PROMPT_TYPES].description}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 md:p-6">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between text-lg font-semibold hover:text-primary transition-colors"
                aria-expanded={showAdvanced}
                aria-controls="advanced-settings"
              >
                <span>Advanced Settings</span>
                {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>

              {showAdvanced && (
                <div id="advanced-settings" className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t">
                  <div>
                    <Label htmlFor="complexity" className="text-sm font-medium mb-2 block">
                      Complexity Level
                    </Label>
                    <Select value={complexity} onValueChange={setComplexity}>
                      <SelectTrigger id="complexity">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="temperature" className="text-sm font-medium mb-2 block">
                      Response Style
                    </Label>
                    <Select value={temperature} onValueChange={setTemperature}>
                      <SelectTrigger id="temperature">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="precise">Precise</SelectItem>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-4 md:p-6">
              <Tabs defaultValue="personas" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="personas" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Personas ({selectedPersonas.length})
                    <HelpTooltip
                      title="AI Personas"
                      content="Personas represent different expertise areas and thinking styles. Combining multiple personas gives you multi-faceted analysis from different perspectives."
                      example="Combine Expert Analyst + Creative Innovator for technical solutions with innovative approaches"
                      learnMoreUrl="/help"
                      position="bottom"
                    />
                  </TabsTrigger>
                  <TabsTrigger value="layers" className="flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Layers ({selectedLayers.length})
                    <HelpTooltip
                      title="Prompt Layers"
                      content="Layers are structural components that make up a complete prompt. Essential layers (Role, Context, Task) form the foundation. Add optional layers for more control and specificity."
                      learnMoreUrl="/help"
                      position="bottom"
                    />
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="personas" className="space-y-4 mt-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Select AI personas to combine perspectives</p>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={selectAllPersonas} className="h-7 text-xs">
                        All
                      </Button>
                      <Button variant="ghost" size="sm" onClick={clearAllPersonas} className="h-7 text-xs">
                        None
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-2 max-h-[400px] overflow-y-auto pr-2">
                    {PERSONAS.map((persona) => (
                      <label
                        key={persona.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all hover:border-primary/50 hover:bg-accent/50 ${
                          selectedPersonas.includes(persona.id) ? "border-primary bg-primary/5" : "border-border"
                        }`}
                      >
                        <Checkbox
                          checked={selectedPersonas.includes(persona.id)}
                          onCheckedChange={() => togglePersona(persona.id)}
                          className="mt-0.5"
                          aria-label={`Select ${persona.name}`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-lg" aria-hidden="true">
                              {persona.icon}
                            </span>
                            <span className="font-medium">{persona.name}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">{persona.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="layers" className="space-y-4 mt-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Choose prompt structure layers</p>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={selectEssentialLayers} className="h-7 text-xs">
                        Essential
                      </Button>
                      <Button variant="ghost" size="sm" onClick={selectAllLayers} className="h-7 text-xs">
                        All
                      </Button>
                      <Button variant="ghost" size="sm" onClick={clearAllLayers} className="h-7 text-xs">
                        None
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-2 max-h-[400px] overflow-y-auto pr-2">
                    {PROMPT_LAYERS.map((layer) => (
                      <label
                        key={layer.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all hover:border-primary/50 hover:bg-accent/50 ${
                          selectedLayers.includes(layer.id) ? "border-primary bg-primary/5" : "border-border"
                        }`}
                      >
                        <Checkbox
                          checked={selectedLayers.includes(layer.id)}
                          onCheckedChange={() => toggleLayer(layer.id)}
                          className="mt-0.5"
                          aria-label={`Select ${layer.name}`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{layer.name}</span>
                            {layer.essential && (
                              <Badge variant="secondary" className="text-xs">
                                Essential
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">{layer.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            <Button
              onClick={generatePrompt}
              className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              size="lg"
              disabled={
                !userInput.trim() || selectedPersonas.length === 0 || selectedLayers.length === 0 || isGenerating
              }
              aria-label="Generate prompt"
              id="generate" // Added id for tour target
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Prompt
                </>
              )}
            </Button>
            {(!userInput.trim() || selectedPersonas.length === 0 || selectedLayers.length === 0) && (
              <p className="text-xs text-center text-muted-foreground -mt-4" role="status">
                {!userInput.trim() && "Enter your task above to continue"}
                {userInput.trim() && selectedPersonas.length === 0 && "Select at least one persona"}
                {userInput.trim() &&
                  selectedPersonas.length > 0 &&
                  selectedLayers.length === 0 &&
                  "Select at least one layer"}
              </p>
            )}
            <p className="text-xs text-center text-muted-foreground -mt-2">
              Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">⌘ + Enter</kbd> to generate
            </p>
          </div>

          {/* Right Panel - Generated Output */}
          <div className="space-y-6">
            <Card className="p-6 sticky top-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b">
                  <div>
                    <Label className="text-lg font-semibold">Generated Prompt</Label>
                    {generatedPrompt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {generatedPrompt.length} characters • {Math.ceil(generatedPrompt.split(/\s+/).length)} words
                      </p>
                    )}
                  </div>
                  {generatedPrompt && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard("plain")}
                        className="gap-2 bg-transparent"
                        title="Copy as plain text"
                      >
                        <Copy className="w-4 h-4" />
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                      <Select onValueChange={(value) => downloadPrompt(value as "txt" | "md" | "json")}>
                        <SelectTrigger className="w-[140px] h-9" aria-label="Download format">
                          <Download className="w-4 h-4 mr-2" />
                          <SelectValue placeholder="Download" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="txt">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              Text (.txt)
                            </div>
                          </SelectItem>
                          <SelectItem value="md">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              Markdown (.md)
                            </div>
                          </SelectItem>
                          <SelectItem value="json">
                            <div className="flex items-center gap-2">
                              <FileJson className="w-4 h-4" />
                              JSON (.json)
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {generatedPrompt ? (
                  <div className="bg-muted/50 rounded-lg p-6 min-h-[600px] max-h-[calc(100vh-300px)] overflow-y-auto border">
                    <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground">
                      {generatedPrompt}
                    </pre>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-muted/30 to-muted/50 rounded-lg p-12 min-h-[600px] flex items-center justify-center border-2 border-dashed">
                    <div className="text-center space-y-6 max-w-md">
                      <div className="w-20 h-20 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
                        <Sparkles className="w-10 h-10 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">Ready to Generate</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Configure your settings on the left and click Generate to create your custom prompt
                        </p>
                      </div>
                      <div className="pt-4 space-y-2 text-sm text-muted-foreground text-left">
                        <p className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold">
                            1
                          </span>
                          Describe your task or question
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold">
                            2
                          </span>
                          Select prompt type and personas
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold">
                            3
                          </span>
                          Choose your prompt layers
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold">
                            4
                          </span>
                          Click Generate and copy your prompt
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Prompt Type Guide
              </h3>
              <div className="grid gap-3">
                {Object.entries(PROMPT_TYPES).map(([key, data]) => (
                  <div key={key} className="flex items-start gap-3 text-sm">
                    <Badge variant={promptType === key ? "default" : "outline"} className="mt-0.5 flex-shrink-0">
                      {data.difficulty}
                    </Badge>
                    <div>
                      <strong className="text-foreground">{data.name}:</strong>{" "}
                      <span className="text-muted-foreground">{data.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
