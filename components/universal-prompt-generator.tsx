"use client"

import { useState, useMemo } from "react"
import { Search, AlertTriangle, CheckCircle, Zap, Shield, Code, FileText, Brain, TrendingUp } from "lucide-react"

const FRAMEWORKS = {
  RISE: { name: "R-I-S-E", desc: "Role, Input, Stops, Expectation", use: "Task execution" },
  ROSE: { name: "R-O-S-E", desc: "Role, Objective, Scenario, Expected", use: "Complex reasoning" },
  FLOW: { name: "F-L-O-W", desc: "Function, Limits, Output, Workflow", use: "Process automation" },
  COT: { name: "Chain-of-Thought", desc: "Step-by-step reasoning", use: "Problem solving" },
  TOT: { name: "Tree-of-Thought", desc: "Multi-path exploration", use: "Complex decisions" },
  RAG: { name: "RAG Pattern", desc: "Retrieve-Augment-Generate", use: "Knowledge tasks" },
  REACT: { name: "ReAct", desc: "Reason + Act loop", use: "Agent workflows" },
  APE: { name: "Auto Prompt Eng", desc: "Self-optimizing prompts", use: "Iteration heavy" },
}

const TEMPLATES = {
  codegen: [
    {
      name: "Secure API Builder",
      desc: "REST/GraphQL with auth, validation, tests",
      prompt: `**Role**: Staff Backend Engineer with OWASP expertise
**Context**: Building production API endpoint
**Requirements**:
- Input validation (sanitize, type-check, rate-limit)
- Auth: JWT/OAuth2 with least-privilege
- Error handling: structured errors, no leak
- Tests: unit + integration + security
- Docs: OpenAPI spec

**Stack**: {STACK}
**Endpoint**: {ENDPOINT_DESC}

**Deliverables**:
1. Schema/validation layer
2. Route handler with middleware
3. Test suite (happy + edge + attack vectors)
4. .env.example
5. Deployment checklist

**Quality Gates**:
- [ ] SQL injection proof
- [ ] XSS sanitization
- [ ] Rate limiting
- [ ] Secrets in env only
- [ ] Error messages safe

**Output Format**: Plan → Code → Tests → Docs → Security Review`,
      gaps: ["DB choice", "Load patterns", "Compliance needs"],
    },
    {
      name: "Observability Stack",
      desc: "Logging, metrics, traces, alerts",
      prompt: `**Role**: SRE with distributed systems experience
**Objective**: Full observability stack implementation

**Components Required**:
1. Structured logging (JSON, correlation IDs)
2. Metrics (RED: Rate, Errors, Duration)
3. Distributed tracing
4. Alerting rules (SLO-based)
5. Dashboards (P50/P95/P99)

**Stack**: {OBSERVABILITY_STACK}
**Integration Points**: {SERVICES}

**Anti-Patterns to Avoid**:
- Log spam (use levels correctly)
- Missing trace context
- Vanity metrics
- Alert fatigue

**Deliverables**:
- Config files (Prometheus, Jaeger, etc)
- SDK/client setup
- Dashboard JSON
- Runbook for common alerts

**Self-Healing**: Include graceful degradation if observability fails`,
      gaps: ["Retention policies", "Cost controls", "PII in logs"],
    },
  ],
  analysis: [
    {
      name: "Data Pipeline Builder",
      desc: "ETL with validation, monitoring",
      prompt: `**Role**: Data Engineer with data quality focus
**Task**: Build resilient data pipeline

**Pipeline Stages**:
1. Extract: {SOURCE} → validate schema
2. Transform: {LOGIC} → error handling
3. Load: {DEST} → idempotency

**Quality Controls**:
- Schema validation (Pydantic/Zod)
- Data freshness checks
- Null handling strategy
- Duplicate detection
- Audit logging

**Error Recovery**:
- Dead letter queue
- Retry with backoff
- Rollback mechanism
- Alert on anomalies

**Stack**: {STACK}
**SLAs**: Latency {X}, Uptime {Y}%

**Deliverables**:
1. Pipeline code (modular)
2. Config-driven logic
3. Monitoring/alerting
4. Backfill script
5. Data quality tests

**Gaps to Address**:
- Scale projections
- Cost optimization
- Compliance (GDPR deletes)`,
      gaps: ["Data volume trends", "Peak load timing", "Budget limits"],
    },
    {
      name: "Root Cause Analyzer",
      desc: "5-Whys + fishbone + data viz",
      prompt: `**Role**: Principal Engineer doing incident analysis
**Context**: {INCIDENT_SUMMARY}

**Analysis Framework**:
1. **Timeline**: Events in chronological order
2. **5-Whys**: Root cause chains
3. **Fishbone**: Categories (People, Process, Tech, Environment)
4. **Data**: Metrics/logs showing anomaly
5. **Impact**: User/business metrics

**Required Sections**:
- Executive Summary (2 para)
- Detailed Timeline
- Contributing Factors (ranked)
- Root Causes (technical + organizational)
- Action Items (owner, due date, prevent/detect/respond)

**Quality Checks**:
- [ ] Blameless tone
- [ ] Data-backed claims
- [ ] Actionable mitigations
- [ ] Feedback loops

**Output**: Markdown report + visualization of timeline`,
      gaps: ["Org context", "Historical incidents", "Budget for fixes"],
    },
  ],
  research: [
    {
      name: "Competitive Intelligence",
      desc: "Market research with SWOT",
      prompt: `**Role**: Strategic Analyst with market intelligence background
**Objective**: Comprehensive competitive analysis

**Research Scope**:
- Competitors: {LIST}
- Dimensions: Features, pricing, tech stack, go-to-market, funding
- Sources: Public docs, reviews, job posts, patents

**Deliverables**:
1. **Feature Matrix**: Side-by-side comparison table
2. **SWOT Analysis**: Per competitor
3. **Market Positioning**: Perceptual map
4. **Strategic Recommendations**: 3-5 moves with rationale
5. **Threat Assessment**: Emerging players, tech shifts

**Quality Gates**:
- [ ] Primary sources cited
- [ ] Date of data noted
- [ ] Assumptions explicit
- [ ] Confidence levels marked

**Output Format**:
- Executive Summary (1 page)
- Detailed Analysis (tables, charts)
- Appendix (methodology, sources)

**Gaps/Unknowns**:
- Private company data (estimate or flag)
- Future roadmaps (infer from hiring)
- Customer satisfaction (proxy metrics)`,
      gaps: ["Time horizon", "Confidential data access", "Update frequency"],
    },
  ],
  creative: [
    {
      name: "Narrative Generator",
      desc: "Story with arc, characters, tension",
      prompt: `**Role**: Senior Writer with {GENRE} expertise
**Brief**: {STORY_CONCEPT}

**Story Structure**:
1. **Setup**: World, characters, stakes (15%)
2. **Inciting Incident**: Change/disruption (10%)
3. **Rising Action**: Complications, tension (40%)
4. **Climax**: Peak conflict (10%)
5. **Resolution**: Aftermath, change (25%)

**Character Framework**:
- Protagonist: Want vs Need, Fatal flaw
- Antagonist: Motivation (not evil for evil's sake)
- Supporting: Distinct voices, arcs

**Constraints**:
- Length: {WORD_COUNT}
- Tone: {TONE}
- Themes: {THEMES}

**Quality Checks**:
- [ ] Show don't tell
- [ ] Active voice (80%+)
- [ ] Sensory details
- [ ] Emotional beats
- [ ] Satisfying ending

**Revision Loop**:
1. Generate draft
2. Self-critique (pacing, character, tension)
3. Revise weak sections
4. Final polish

**Output**: Full story + writer's notes on choices`,
      gaps: ["Target audience", "Publishing context", "Sensitive topics"],
    },
  ],
  security: [
    {
      name: "Threat Model Builder",
      desc: "STRIDE + attack trees + mitigations",
      prompt: `**Role**: AppSec Lead with threat modeling expertise
**System**: {SYSTEM_DESCRIPTION}

**Methodology**: STRIDE per component
- **S**poofing: Auth bypasses
- **T**ampering: Data integrity
- **R**epudiation: Audit gaps
- **I**nfo Disclosure: Data leaks
- **D**enial of Service: Resource exhaustion
- **E**levation of Privilege: Access control breaks

**Process**:
1. **Architecture Diagram**: Data flows, trust boundaries
2. **Asset Inventory**: Sensitive data, critical functions
3. **Threat Enumeration**: STRIDE per element
4. **Risk Scoring**: Likelihood × Impact (1-5 scale)
5. **Mitigations**: Prevent, Detect, Respond for each threat
6. **Test Cases**: Security test scenarios

**Deliverables**:
- Threat model doc (diagrams + threats table)
- Risk register (sorted by score)
- Security requirements
- Test plan

**Anti-Patterns**:
- "We'll add security later"
- Checkbox compliance
- Over-trusting frameworks

**Output Format**: Markdown + Mermaid diagrams

**Unknown Unknowns**:
- Supply chain risks
- Insider threats
- 0-day in dependencies`,
      gaps: ["Compliance regime", "Risk appetite", "Remediation budget"],
    },
  ],
}

const QUALITY_GATES = [
  { id: "clarity", label: "Clear objective", check: (p) => p.includes("objective") || p.includes("goal") },
  { id: "context", label: "Context provided", check: (p) => p.includes("context") || p.includes("background") },
  { id: "constraints", label: "Constraints listed", check: (p) => p.includes("constraint") || p.includes("limit") },
  { id: "output", label: "Output format specified", check: (p) => p.includes("format") || p.includes("deliverable") },
  {
    id: "validation",
    label: "Quality checks",
    check: (p) => p.includes("quality") || p.includes("gate") || p.includes("check"),
  },
  {
    id: "gaps",
    label: "Gaps identified",
    check: (p) => p.includes("gap") || p.includes("unknown") || p.includes("assumption"),
  },
]

const SELF_HEAL_PATTERNS = [
  { scenario: "Vague response", fix: 'Add: "Be specific. Cite sources. Use examples."' },
  { scenario: "Wrong format", fix: 'Add: "Output ONLY {format}. Start with {pattern}."' },
  { scenario: "Incomplete", fix: 'Add: "Continue until all {N} items complete. Track progress."' },
  { scenario: "Hallucination", fix: 'Add: "If uncertain, respond: I cannot verify this."' },
  { scenario: "Ignores constraints", fix: 'Restate constraints at END: "CRITICAL: Respect {constraint}."' },
  { scenario: "Too verbose", fix: 'Add: "Maximum {N} words/lines. Prioritize by impact."' },
]

const GOVERNANCE_RULES = [
  { rule: "No secrets in prompts", rationale: "Use env vars or keystore", check: "Scan for tokens/keys" },
  { rule: "Cite external facts", rationale: "Auditability", check: "Sources section required" },
  { rule: "Validate inputs", rationale: "Prevent injection", check: "Sanitization specified" },
  { rule: "Error handling explicit", rationale: "Graceful degradation", check: "Error section present" },
  { rule: "Review loop for high-risk", rationale: "Prevent harm", check: "Human-in-loop for security/legal/medical" },
]

function PromptGenerator() {
  const [category, setCategory] = useState("codegen")
  const [template, setTemplate] = useState(null)
  const [framework, setFramework] = useState("RISE")
  const [customVars, setCustomVars] = useState({})
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [activeTab, setActiveTab] = useState("builder")

  const categories = {
    codegen: { name: "Code Generation", icon: Code, color: "blue" },
    analysis: { name: "Data Analysis", icon: TrendingUp, color: "green" },
    research: { name: "Research", icon: Brain, color: "purple" },
    creative: { name: "Creative", icon: FileText, color: "pink" },
    security: { name: "Security", icon: Shield, color: "red" },
  }

  const qualityScore = useMemo(() => {
    if (!generatedPrompt) return 0
    const passed = QUALITY_GATES.filter((g) => g.check(generatedPrompt.toLowerCase())).length
    return Math.round((passed / QUALITY_GATES.length) * 100)
  }, [generatedPrompt])

  const generatePrompt = () => {
    if (!template) return

    let prompt = `# ${framework} Framework: ${template.name}\n\n`
    prompt += `## ${FRAMEWORKS[framework].desc}\n\n`
    prompt += template.prompt

    // Add framework-specific sections
    if (framework === "RISE") {
      prompt += `\n\n**Role**: {Specify role with expertise level}\n`
      prompt += `**Input**: {Data/context provided}\n`
      prompt += `**Stops**: {When to stop - token limit, completeness criteria}\n`
      prompt += `**Expectation**: {Exact output format, success criteria}\n`
    } else if (framework === "COT") {
      prompt += `\n\n**Thinking Process**: Break down into steps:\n`
      prompt += `1. Understand the problem\n2. Identify constraints\n3. Generate approach\n4. Validate solution\n5. Document reasoning\n`
    } else if (framework === "RAG") {
      prompt += `\n\n**Knowledge Sources**: {List sources to retrieve from}\n`
      prompt += `**Retrieval Strategy**: {Semantic search, keyword, hybrid}\n`
      prompt += `**Augmentation**: {How to integrate retrieved context}\n`
    }

    // Add self-healing section
    prompt += `\n\n---\n## Self-Healing Instructions\n`
    prompt += `If response is inadequate:\n`
    SELF_HEAL_PATTERNS.slice(0, 3).forEach((p) => {
      prompt += `- **${p.scenario}**: ${p.fix}\n`
    })

    // Add governance
    prompt += `\n\n---\n## Governance Checklist\n`
    GOVERNANCE_RULES.slice(0, 3).forEach((r) => {
      prompt += `- [ ] ${r.rule} (${r.rationale})\n`
    })

    // Add gaps/unknowns
    prompt += `\n\n---\n## Known Gaps & Unknowns\n`
    template.gaps.forEach((g) => {
      prompt += `- ⚠️ ${g}: {Clarify or state assumption}\n`
    })

    prompt += `\n\n---\n## Quality Gates (Score: ${qualityScore}%)\n`
    QUALITY_GATES.forEach((g) => {
      const passed = g.check(prompt.toLowerCase())
      prompt += `${passed ? "✅" : "⬜"} ${g.label}\n`
    })

    setGeneratedPrompt(prompt)
  }

  const CategoryIcon = categories[category]?.icon || Code

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-yellow-400" />
              <div>
                <h1 className="text-2xl font-bold">Universal Prompt Generator Pro</h1>
                <p className="text-slate-400 text-sm">Enterprise-grade prompt engineering with quality gates</p>
              </div>
            </div>
            <div className="flex gap-2">
              {["builder", "frameworks", "healing", "governance"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    activeTab === tab ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Builder Tab */}
        {activeTab === "builder" && (
          <div className="grid grid-cols-3 gap-6">
            {/* Left Panel - Selection */}
            <div className="space-y-6">
              {/* Category Selection */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Select Category
                </h3>
                <div className="space-y-2">
                  {Object.entries(categories).map(([key, cat]) => {
                    const Icon = cat.icon
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setCategory(key)
                          setTemplate(null)
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${
                          category === key ? "bg-blue-600 text-white" : "bg-slate-700 hover:bg-slate-600"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{cat.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Framework Selection */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold mb-4">Framework</h3>
                <select
                  value={framework}
                  onChange={(e) => setFramework(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {Object.entries(FRAMEWORKS).map(([key, fw]) => (
                    <option key={key} value={key}>
                      {fw.name} - {fw.use}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-slate-400 mt-2">{FRAMEWORKS[framework].desc}</p>
              </div>

              {/* Quality Score */}
              {generatedPrompt && (
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Quality Score
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-bold text-green-400">{qualityScore}%</div>
                    <div className="flex-1">
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 transition-all duration-500"
                          style={{ width: `${qualityScore}%` }}
                        />
                      </div>
                      <p className="text-sm text-slate-400 mt-2">
                        {qualityScore < 60 && "Needs improvement"}
                        {qualityScore >= 60 && qualityScore < 80 && "Good"}
                        {qualityScore >= 80 && "Excellent"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Middle Panel - Templates */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <CategoryIcon className="w-5 h-5" />
                {categories[category].name} Templates
              </h3>
              <div className="space-y-3">
                {TEMPLATES[category]?.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setTemplate(t)
                      generatePrompt()
                    }}
                    className={`w-full text-left p-4 rounded-lg border transition ${
                      template === t
                        ? "bg-blue-600 border-blue-500"
                        : "bg-slate-700 border-slate-600 hover:bg-slate-600"
                    }`}
                  >
                    <div className="font-bold mb-1">{t.name}</div>
                    <div className="text-sm text-slate-300">{t.desc}</div>
                    {t.gaps.length > 0 && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-yellow-400">
                        <AlertTriangle className="w-3 h-3" />
                        {t.gaps.length} gaps to address
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Panel - Output */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-bold mb-4">Generated Prompt</h3>
              {!generatedPrompt ? (
                <div className="text-center py-12 text-slate-400">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Select a template to generate a prompt</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-slate-900 rounded-lg p-4 max-h-[600px] overflow-y-auto border border-slate-700">
                    <pre className="text-sm text-slate-200 whitespace-pre-wrap font-mono">{generatedPrompt}</pre>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedPrompt)
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    Copy to Clipboard
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Frameworks Tab */}
        {activeTab === "frameworks" && (
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold mb-6">Prompt Engineering Frameworks</h2>
            <div className="grid grid-cols-2 gap-6">
              {Object.entries(FRAMEWORKS).map(([key, fw]) => (
                <div key={key} className="bg-slate-900 rounded-lg p-6 border border-slate-700">
                  <h3 className="text-xl font-bold text-blue-400 mb-2">{fw.name}</h3>
                  <p className="text-slate-300 mb-3">{fw.desc}</p>
                  <div className="text-sm text-slate-400">
                    <strong>Best for:</strong> {fw.use}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Self-Healing Tab */}
        {activeTab === "healing" && (
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Zap className="w-7 h-7 text-yellow-400" />
              Self-Healing Patterns
            </h2>
            <div className="space-y-4">
              {SELF_HEAL_PATTERNS.map((pattern, i) => (
                <div key={i} className="bg-slate-900 rounded-lg p-6 border border-slate-700">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-red-400 mb-2">Scenario: {pattern.scenario}</h3>
                      <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
                        <div className="font-bold text-green-400 mb-1">Fix:</div>
                        <code className="text-sm text-green-300">{pattern.fix}</code>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Governance Tab */}
        {activeTab === "governance" && (
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Shield className="w-7 h-7 text-blue-400" />
              Governance & Quality Rules
            </h2>
            <div className="space-y-4">
              {GOVERNANCE_RULES.map((rule, i) => (
                <div key={i} className="bg-slate-900 rounded-lg p-6 border border-slate-700">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2">{rule.rule}</h3>
                      <p className="text-slate-300 mb-3">
                        <strong className="text-blue-400">Why:</strong> {rule.rationale}
                      </p>
                      <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-3">
                        <div className="text-sm">
                          <strong className="text-blue-300">Check:</strong>{" "}
                          <code className="text-blue-200">{rule.check}</code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PromptGenerator
