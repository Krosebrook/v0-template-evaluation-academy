-- Additional resources to ensure at least 15 items in each type and difficulty level
-- This supplements the existing 140 resources from script 036

-- More BEGINNER level resources (ensuring 15+ in each category)
INSERT INTO public.resources (title, description, category, type, content, tags, difficulty, duration, featured, published) VALUES
-- Beginner Prompts
('Simple Bug Report Template', 'Create clear and actionable bug reports', 'Prompts', 'template', 'Describe the bug, steps to reproduce, expected vs actual behavior, environment details, and screenshots if applicable.', ARRAY['bug-report', 'qa', 'template'], 'beginner', 3, false, true),
('Feature Request Format', 'Structure feature requests effectively', 'Prompts', 'template', 'Describe the feature, user story, acceptance criteria, mockups/wireframes, and business value.', ARRAY['feature-request', 'product', 'template'], 'beginner', 3, false, true),
('Code Comment Generator', 'Write helpful code comments', 'Prompts', 'template', 'Generate clear, concise comments explaining: what the code does, why it exists, any gotchas, and usage examples.', ARRAY['comments', 'documentation', 'code'], 'beginner', 2, false, true),

-- Beginner Skills
('HTML Fundamentals', 'Master semantic HTML structure', 'Skills', 'tutorial', 'Learn HTML5 elements, semantic markup, forms, tables, and accessibility basics.', ARRAY['html', 'fundamentals', 'web'], 'beginner', 25, false, true),
('CSS Basics', 'Style web pages with CSS', 'Skills', 'tutorial', 'Master selectors, box model, positioning, colors, typography, and basic layouts.', ARRAY['css', 'styling', 'fundamentals'], 'beginner', 30, false, true),
('JavaScript Essentials', 'Core JavaScript concepts', 'Skills', 'tutorial', 'Learn variables, functions, arrays, objects, loops, and DOM manipulation.', ARRAY['javascript', 'fundamentals', 'programming'], 'beginner', 40, false, true),

-- Beginner Frameworks
('Bootstrap Grid System', 'Responsive layouts with Bootstrap', 'Frameworks', 'tutorial', 'Master Bootstrap grid, utilities, components, and responsive design patterns.', ARRAY['bootstrap', 'css', 'responsive'], 'beginner', 25, false, true),
('jQuery Basics', 'DOM manipulation with jQuery', 'Frameworks', 'tutorial', 'Learn selectors, events, animations, AJAX, and jQuery plugins.', ARRAY['jquery', 'javascript', 'dom'], 'beginner', 30, false, true),

-- Beginner Personas
('Bootcamp Graduate', 'Recent coding bootcamp graduate starting career', 'Personas', 'template', 'You recently completed a coding bootcamp and are: building portfolio projects, applying for junior roles, and learning industry best practices.', ARRAY['bootcamp', 'junior', 'career'], 'beginner', 5, false, true),
('Career Switcher', 'Professional transitioning to tech', 'Personas', 'template', 'You are switching careers to tech and bring: domain expertise, professional experience, and fresh perspective to software development.', ARRAY['career-change', 'transition', 'learning'], 'beginner', 5, false, true),

-- Beginner Tutorials
('Create Your First Website', 'Build a simple HTML/CSS website', 'Tutorials', 'video', '/tutorials/first-website', ARRAY['html', 'css', 'beginner'], 'beginner', 45, false, true),
('JavaScript Calculator', 'Build an interactive calculator', 'Tutorials', 'tutorial', '/tutorials/calculator', ARRAY['javascript', 'dom', 'project'], 'beginner', 50, false, true),
('Todo List App', 'Create a simple todo application', 'Tutorials', 'article', '/tutorials/todo-app', ARRAY['javascript', 'crud', 'beginner'], 'beginner', 55, false, true),

-- Beginner Tools
('Browser Inspector Guide', 'Use browser developer tools', 'Tools', 'article', '/tools/browser-inspector', ARRAY['devtools', 'debugging', 'browser'], 'beginner', 20, false, true),
('Markdown Cheat Sheet', 'Quick reference for Markdown syntax', 'Tools', 'tool', '/tools/markdown', ARRAY['markdown', 'documentation', 'writing'], 'beginner', 10, false, true),

-- Beginner Best Practices
('Naming Conventions', 'Choose clear and consistent names', 'Best Practices', 'article', 'Use descriptive names, follow language conventions, be consistent, and avoid abbreviations.', ARRAY['naming', 'conventions', 'clean-code'], 'beginner', 15, false, true),
('Version Control Basics', 'Essential Git workflows', 'Best Practices', 'article', 'Commit often, write clear messages, use branches, and sync regularly with remote.', ARRAY['git', 'version-control', 'workflow'], 'beginner', 20, false, true);

-- More ADVANCED level resources
INSERT INTO public.resources (title, description, category, type, content, tags, difficulty, duration, featured, published) VALUES
-- Advanced Prompts
('System Architecture Review', 'Comprehensive architecture evaluation', 'Prompts', 'template', 'Analyze system architecture for: scalability, reliability, security, maintainability, cost efficiency, and technology choices. Provide detailed recommendations.', ARRAY['architecture', 'system-design', 'review'], 'advanced', 15, false, true),
('Performance Optimization Plan', 'Create detailed performance improvement strategy', 'Prompts', 'template', 'Analyze performance bottlenecks, prioritize optimizations, estimate impact, create implementation plan, and define success metrics.', ARRAY['performance', 'optimization', 'strategy'], 'advanced', 12, false, true),
('Technical Debt Assessment', 'Evaluate and prioritize technical debt', 'Prompts', 'template', 'Identify technical debt, assess impact, estimate effort, prioritize by ROI, and create remediation roadmap.', ARRAY['technical-debt', 'refactoring', 'planning'], 'advanced', 10, false, true),

-- Advanced Skills
('Distributed Systems Design', 'Build scalable distributed systems', 'Skills', 'tutorial', 'Master CAP theorem, consistency models, distributed transactions, consensus algorithms, and fault tolerance.', ARRAY['distributed', 'systems', 'architecture'], 'advanced', 90, false, true),
('Kubernetes Orchestration', 'Container orchestration with K8s', 'Skills', 'tutorial', 'Learn pods, services, deployments, ingress, config maps, secrets, and production best practices.', ARRAY['kubernetes', 'containers', 'devops'], 'advanced', 80, false, true),
('Advanced TypeScript Patterns', 'Master complex TypeScript techniques', 'Skills', 'tutorial', 'Learn advanced generics, conditional types, template literals, type guards, and compiler API.', ARRAY['typescript', 'advanced', 'patterns'], 'advanced', 70, false, true),

-- Advanced Frameworks
('GraphQL Federation', 'Build federated GraphQL architectures', 'Frameworks', 'tutorial', 'Master schema stitching, Apollo Federation, distributed schemas, and microservices integration.', ARRAY['graphql', 'federation', 'microservices'], 'advanced', 75, false, true),
('Terraform Infrastructure', 'Infrastructure as Code with Terraform', 'Frameworks', 'tutorial', 'Learn modules, state management, workspaces, and multi-cloud deployments with Terraform.', ARRAY['terraform', 'iac', 'devops'], 'advanced', 70, false, true),

-- Advanced Personas
('Principal Engineer', 'Technical leadership across multiple teams', 'Personas', 'template', 'You are a principal engineer providing: technical direction, architecture guidance, and mentoring senior engineers across the organization.', ARRAY['principal', 'leadership', 'architecture'], 'advanced', 5, false, true),
('Platform Engineer', 'Building internal developer platforms', 'Personas', 'template', 'You build and maintain: internal platforms, developer tools, CI/CD systems, and infrastructure that enables other teams.', ARRAY['platform', 'infrastructure', 'devops'], 'advanced', 5, false, true),

-- Advanced Tutorials
('Build a Distributed Cache', 'Create a scalable caching system', 'Tutorials', 'video', '/tutorials/distributed-cache', ARRAY['caching', 'distributed', 'redis'], 'advanced', 120, false, true),
('Implement Event Sourcing', 'Build event-sourced applications', 'Tutorials', 'tutorial', '/tutorials/event-sourcing', ARRAY['event-sourcing', 'cqrs', 'architecture'], 'advanced', 110, false, true),
('Create a Service Mesh', 'Implement service mesh with Istio', 'Tutorials', 'article', '/tutorials/service-mesh', ARRAY['service-mesh', 'istio', 'microservices'], 'advanced', 100, false, true),

-- Advanced Tools
('Kubernetes Dashboard', 'Manage K8s clusters visually', 'Tools', 'tool', '/tools/k8s-dashboard', ARRAY['kubernetes', 'dashboard', 'management'], 'advanced', 40, false, true),
('Grafana Monitoring', 'Advanced metrics visualization', 'Tools', 'tool', '/tools/grafana', ARRAY['monitoring', 'metrics', 'visualization'], 'advanced', 50, false, true),

-- Advanced Best Practices
('Chaos Engineering', 'Build resilient systems through chaos', 'Best Practices', 'article', 'Implement chaos experiments, test failure scenarios, measure resilience, and improve system reliability.', ARRAY['chaos', 'resilience', 'testing'], 'advanced', 60, false, true),
('Zero-Trust Security', 'Implement zero-trust architecture', 'Best Practices', 'article', 'Design systems with: no implicit trust, verify everything, least privilege access, and continuous monitoring.', ARRAY['security', 'zero-trust', 'architecture'], 'advanced', 55, false, true);

-- More VIDEO type resources
INSERT INTO public.resources (title, description, category, type, url, tags, difficulty, duration, featured, published) VALUES
('React Hooks Deep Dive', 'Complete video course on React Hooks', 'Skills', 'video', '/tutorials/react-hooks-video', ARRAY['react', 'hooks', 'video-course'], 'intermediate', 120, false, true),
('TypeScript Masterclass', 'Comprehensive TypeScript video series', 'Skills', 'video', '/tutorials/typescript-video', ARRAY['typescript', 'video-course', 'advanced'], 'advanced', 180, false, true),
('Node.js Backend Development', 'Full backend development course', 'Tutorials', 'video', '/tutorials/nodejs-backend', ARRAY['nodejs', 'backend', 'video-course'], 'intermediate', 150, false, true),
('Docker & Kubernetes', 'Container orchestration video course', 'Frameworks', 'video', '/tutorials/docker-k8s', ARRAY['docker', 'kubernetes', 'video-course'], 'advanced', 200, false, true),
('Web Performance Optimization', 'Video guide to web performance', 'Best Practices', 'video', '/tutorials/web-performance', ARRAY['performance', 'optimization', 'video'], 'intermediate', 90, false, true);

-- More ARTICLE type resources
INSERT INTO public.resources (title, description, category, type, content, tags, difficulty, duration, featured, published) VALUES
('Understanding Closures', 'Deep dive into JavaScript closures', 'Skills', 'article', 'Comprehensive explanation of closures, lexical scope, and practical use cases in JavaScript.', ARRAY['javascript', 'closures', 'fundamentals'], 'intermediate', 25, false, true),
('Async/Await Patterns', 'Master asynchronous JavaScript', 'Skills', 'article', 'Learn async/await, promises, error handling, and concurrent operations in JavaScript.', ARRAY['javascript', 'async', 'promises'], 'intermediate', 30, false, true),
('CSS Grid Layout', 'Complete guide to CSS Grid', 'Skills', 'article', 'Master CSS Grid with practical examples, responsive patterns, and browser support.', ARRAY['css', 'grid', 'layout'], 'intermediate', 35, false, true),
('REST vs GraphQL', 'Compare API architectures', 'Best Practices', 'article', 'Detailed comparison of REST and GraphQL: use cases, trade-offs, and when to use each.', ARRAY['api', 'rest', 'graphql'], 'intermediate', 30, false, true),
('Microservices Patterns', 'Common microservices design patterns', 'Best Practices', 'article', 'Learn service discovery, circuit breakers, API gateways, and event-driven architecture.', ARRAY['microservices', 'patterns', 'architecture'], 'advanced', 45, false, true);

-- More TOOL type resources
INSERT INTO public.resources (title, description, category, type, url, tags, difficulty, duration, featured, published) VALUES
('Figma for Developers', 'Design tool for developer handoff', 'Tools', 'tool', '/tools/figma', ARRAY['figma', 'design', 'collaboration'], 'beginner', 30, false, true),
('Notion Workspace Setup', 'Organize projects with Notion', 'Tools', 'tool', '/tools/notion', ARRAY['notion', 'productivity', 'organization'], 'beginner', 25, false, true),
('Slack Integration Guide', 'Automate workflows with Slack', 'Tools', 'tool', '/tools/slack', ARRAY['slack', 'automation', 'collaboration'], 'intermediate', 35, false, true),
('Jira Project Management', 'Manage agile projects with Jira', 'Tools', 'tool', '/tools/jira', ARRAY['jira', 'agile', 'project-management'], 'beginner', 30, false, true),
('Datadog Monitoring', 'Application performance monitoring', 'Tools', 'tool', '/tools/datadog', ARRAY['monitoring', 'apm', 'observability'], 'advanced', 45, false, true);

-- Update statistics
SELECT get_resource_stats();
