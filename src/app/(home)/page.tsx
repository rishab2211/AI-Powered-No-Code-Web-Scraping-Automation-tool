import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Globe,
  ShieldCheck,
  BarChart3,
  Workflow,
  Cpu,
  CheckCircle,
  ChevronRight,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">

      {/* ── HERO — left-aligned, asymmetric ────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* Background texture */}
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
          <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-violet-600/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-indigo-500/8 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-8 lg:px-16 w-full py-32 grid lg:grid-cols-2 gap-20 items-center">

          {/* Left — copy */}
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-violet-400 bg-violet-400/8 border border-violet-400/20 rounded-full px-3 py-1.5 mb-10 tracking-wider uppercase">
              <span className="size-1.5 rounded-full bg-violet-400 animate-pulse" />
              Now in beta
            </div>

            <h1 className="text-6xl lg:text-7xl font-black leading-[1.0] tracking-tight mb-8">
              Web scraping,
              <br />
              <span className="text-zinc-500">without the</span>
              <br />
              engineering.
            </h1>

            <p className="text-zinc-400 text-lg leading-relaxed max-w-md mb-10">
              Build automation workflows visually. Connect browser actions, AI extraction, and scheduling into a single pipeline — no engineers needed.
            </p>

            <div className="flex items-center gap-4">
              <Link href="/sign-up">
                <button className="group flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-semibold text-sm hover:bg-zinc-100 transition-colors">
                  Start building
                  <ChevronRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
              <Link href="/sign-in" className="text-zinc-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-1.5">
                Sign in <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-8 text-sm text-zinc-600">
              <span className="flex items-center gap-2"><CheckCircle className="size-4 text-emerald-500" />Free 250 credits</span>
              <span className="flex items-center gap-2"><CheckCircle className="size-4 text-emerald-500" />No card required</span>
              <span className="flex items-center gap-2"><CheckCircle className="size-4 text-emerald-500" />Open-source ready</span>
            </div>
          </div>

          {/* Right — product preview */}
          <div className="relative">
            {/* Glow behind card */}
            <div className="absolute inset-0 bg-violet-600/10 blur-3xl rounded-3xl scale-95" />

            <div className="relative rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl shadow-black/60">
              {/* Window bar */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-zinc-800/60 bg-black/40">
                <div className="size-3 rounded-full bg-zinc-800 hover:bg-red-500/60 transition-colors cursor-default" />
                <div className="size-3 rounded-full bg-zinc-800 hover:bg-yellow-500/60 transition-colors cursor-default" />
                <div className="size-3 rounded-full bg-zinc-800 hover:bg-emerald-500/60 transition-colors cursor-default" />
                <div className="flex-1 mx-3">
                  <div className="h-5 rounded-md bg-zinc-800/60 w-48 text-xs text-zinc-600 flex items-center px-2 font-mono">
                    flowcraft.app/workflows
                  </div>
                </div>
              </div>

              {/* Canvas */}
              <div
                className="h-72 relative p-6 overflow-hidden"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(139,92,246,.06) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              >
                {/* Workflow nodes */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 z" fill="#52525b" />
                    </marker>
                  </defs>
                  <line x1="170" y1="70" x2="270" y2="70" stroke="#3f3f46" strokeWidth="1.5" markerEnd="url(#arrow)" strokeDasharray="4 2" />
                  <line x1="420" y1="70" x2="510" y2="70" stroke="#3f3f46" strokeWidth="1.5" markerEnd="url(#arrow)" strokeDasharray="4 2" />
                  <line x1="420" y1="70" x2="480" y2="160" stroke="#3f3f46" strokeWidth="1.5" markerEnd="url(#arrow)" strokeDasharray="4 2" />
                </svg>

                {[
                  { x: 24, y: 48, label: "Launch Browser", color: "border-violet-500/40 bg-violet-500/10", dot: "bg-violet-400", tag: "input" },
                  { x: 270, y: 48, label: "Navigate to URL", color: "border-blue-500/40 bg-blue-500/10", dot: "bg-blue-400", tag: "action" },
                  { x: 510, y: 48, label: "Read HTML", color: "border-amber-500/40 bg-amber-500/10", dot: "bg-amber-400", tag: "extract" },
                  { x: 480, y: 145, label: "AI Extraction", color: "border-emerald-500/40 bg-emerald-500/10", dot: "bg-emerald-400", tag: "ai" },
                ].map((node, i) => (
                  <div
                    key={i}
                    className={`absolute border rounded-xl px-3.5 py-2.5 backdrop-blur-sm shadow-lg ${node.color}`}
                    style={{ left: node.x, top: node.y }}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`size-2 rounded-full ${node.dot} shadow-sm`} />
                      <span className="text-[11px] font-medium text-white whitespace-nowrap">{node.label}</span>
                    </div>
                    <div className="mt-1 text-[9px] text-zinc-500 font-mono">{node.tag}</div>
                  </div>
                ))}

                {/* Status bar at bottom */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-emerald-400">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Execution running...
                  </div>
                  <div className="text-xs text-zinc-600 font-mono">4 nodes · 2 credits</div>
                </div>
              </div>

              {/* Execution log strip */}
              <div className="border-t border-zinc-800/60 bg-black/30 px-4 py-3 font-mono text-[11px] space-y-1">
                <div className="text-zinc-500">
                  <span className="text-emerald-500">✓</span> Browser launched in 312ms
                </div>
                <div className="text-zinc-500">
                  <span className="text-emerald-500">✓</span> Navigated to target URL
                </div>
                <div className="text-zinc-400 flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-violet-400 animate-pulse" />
                  Extracting data with AI...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BENTO FEATURES — asymmetric grid ──────────────────── */}
      <section id="features" className="border-t border-zinc-900 py-24 px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">

          <div className="mb-14">
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-4">What you get</p>
            <h2 className="text-4xl font-black tracking-tight max-w-lg leading-tight">
              Everything needed to ship<br />
              <span className="text-zinc-500">data pipelines, fast.</span>
            </h2>
          </div>

          {/* Bento grid — intentionally asymmetric */}
          <div className="grid grid-cols-12 gap-4 auto-rows-[160px]">

            {/* Large card — spans 7 cols, 2 rows */}
            <div className="col-span-12 lg:col-span-7 row-span-2 rounded-2xl border border-zinc-800 bg-zinc-950 p-8 flex flex-col justify-between overflow-hidden relative group hover:border-zinc-700 transition-colors">
              <div className="absolute right-0 top-0 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl group-hover:bg-violet-600/10 transition-colors" />
              <div>
                <div className="size-10 rounded-xl bg-violet-600/15 border border-violet-500/20 flex items-center justify-center mb-5">
                  <Globe className="size-5 text-violet-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Visual Web Scraping</h3>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                  Point and click your way to powerful scrapers. The node-based canvas lets you chain browser actions — no CSS selectors to memorize, no Puppeteer boilerplate to write.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-600">
                <Play className="size-3" />
                Works with any website
              </div>
            </div>

            {/* Card — 5 cols, 1 row */}
            <div className="col-span-12 lg:col-span-5 row-span-1 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex items-center gap-5 group hover:border-zinc-700 transition-colors">
              <div className="size-10 shrink-0 rounded-xl bg-blue-600/15 border border-blue-500/20 flex items-center justify-center">
                <Zap className="size-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-base mb-1">Cron Scheduling</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">Set it and forget it. Run workflows on any schedule with standard cron expressions.</p>
              </div>
            </div>

            {/* Card — 5 cols, 1 row */}
            <div className="col-span-12 lg:col-span-5 row-span-1 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex items-center gap-5 group hover:border-zinc-700 transition-colors">
              <div className="size-10 shrink-0 rounded-xl bg-emerald-600/15 border border-emerald-500/20 flex items-center justify-center">
                <Cpu className="size-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-base mb-1">AI-Powered Extraction</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">Gemini understands messy HTML so you don't have to write brittle selectors.</p>
              </div>
            </div>

            {/* Card — 4 cols, 2 rows */}
            <div className="col-span-12 lg:col-span-4 row-span-2 rounded-2xl border border-zinc-800 bg-zinc-950 p-7 flex flex-col justify-between group hover:border-zinc-700 transition-colors">
              <div>
                <div className="size-10 rounded-xl bg-amber-600/15 border border-amber-500/20 flex items-center justify-center mb-5">
                  <ShieldCheck className="size-5 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">Encrypted Credentials</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Store API keys and passwords with AES-256 encryption. Reference them by name inside any workflow step.
                </p>
              </div>
              <div className="rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 font-mono text-xs text-zinc-500">
                <span className="text-amber-400">$</span> {"{{credentials.OPENAI_KEY}}"}
              </div>
            </div>

            {/* Card — 4 cols, 1 row */}
            <div className="col-span-12 lg:col-span-4 row-span-1 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 group hover:border-zinc-700 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="size-8 rounded-lg bg-pink-600/15 border border-pink-500/20 flex items-center justify-center">
                  <BarChart3 className="size-4 text-pink-400" />
                </div>
                <h3 className="font-bold text-sm">Execution Analytics</h3>
              </div>
              <p className="text-zinc-500 text-xs leading-relaxed">Track credits, success rates, and timeline history from one dashboard.</p>
            </div>

            {/* Card — 4 cols, 1 row */}
            <div className="col-span-12 lg:col-span-4 row-span-1 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 group hover:border-zinc-700 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="size-8 rounded-lg bg-violet-600/15 border border-violet-500/20 flex items-center justify-center">
                  <Workflow className="size-4 text-violet-400" />
                </div>
                <h3 className="font-bold text-sm">Composable Workflows</h3>
              </div>
              <p className="text-zinc-500 text-xs leading-relaxed">Chain any combination of browser tasks, AI calls, and data transforms.</p>
            </div>

          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS — horizontal steps, not cards ──────── */}
      <section className="border-t border-zinc-900 py-24 px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">

            {/* Left sticky header */}
            <div className="lg:sticky lg:top-24">
              <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-4">Process</p>
              <h2 className="text-4xl font-black tracking-tight leading-tight mb-6">
                From idea to<br />
                running pipeline<br />
                <span className="text-zinc-500">in minutes.</span>
              </h2>
              <p className="text-zinc-400 text-base leading-relaxed max-w-sm">
                No deployment, no infrastructure, no code review. Just drag, connect, and run.
              </p>
              <Link href="/sign-up" className="mt-8 inline-flex items-center gap-2 text-white text-sm font-semibold border border-zinc-700 hover:border-zinc-500 rounded-lg px-5 py-2.5 transition-colors">
                Try it now <ArrowRight className="size-3.5" />
              </Link>
            </div>

            {/* Right — step list */}
            <div className="space-y-0">
              {[
                {
                  n: "01",
                  title: "Design your workflow on the canvas",
                  body: "Drag task nodes onto the visual canvas. Connect them with edges to define the execution order. Every node has typed inputs and outputs.",
                  tag: "Editor",
                },
                {
                  n: "02",
                  title: "Publish and configure a schedule",
                  body: "When the workflow looks right, publish it. Optionally set a cron expression to run it automatically every hour, day, or week.",
                  tag: "Scheduling",
                },
                {
                  n: "03",
                  title: "Monitor runs and collect data",
                  body: "Every execution is logged with per-phase timing, credit cost, and output. Drill in to see exactly what happened at each step.",
                  tag: "Analytics",
                },
              ].map((s, i) => (
                <div key={i} className="group relative flex gap-8 py-8 border-b border-zinc-900 last:border-none hover:bg-zinc-900/20 -mx-4 px-4 rounded-xl transition-colors">
                  <div className="shrink-0 font-mono text-xs text-zinc-700 mt-1 w-6 group-hover:text-zinc-500 transition-colors">{s.n}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-base">{s.title}</h3>
                      <span className="text-xs text-zinc-600 border border-zinc-800 rounded-full px-2 py-0.5 font-mono">{s.tag}</span>
                    </div>
                    <p className="text-zinc-400 text-sm leading-relaxed">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING — left-anchored, not symmetric ───────────── */}
      <section id="pricing" className="border-t border-zinc-900 py-24 px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-16">

            {/* Left */}
            <div className="lg:col-span-1">
              <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-4">Pricing</p>
              <h2 className="text-4xl font-black tracking-tight leading-tight mb-4">
                Usage-based.<br />
                <span className="text-zinc-500">No subscriptions.</span>
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                You start with 250 free credits. Buy more when you need them. Credits don't expire.
              </p>
            </div>

            {/* Right — plans */}
            <div className="lg:col-span-2 space-y-3">
              {[
                { credits: "250", price: "Free", desc: "New accounts start here", highlight: false },
                { credits: "1,000", price: "$9", desc: "For individuals automating personal workflows", highlight: false },
                { credits: "5,000", price: "$29", desc: "For small teams and recurring data jobs", highlight: true },
                { credits: "15,000", price: "$79", desc: "For agencies and high-volume scraping pipelines", highlight: false },
              ].map((p, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between px-6 py-5 rounded-xl border transition-colors ${
                    p.highlight
                      ? "border-violet-500/40 bg-violet-600/5"
                      : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div className="font-black text-2xl w-20 shrink-0">{p.credits}</div>
                    <div>
                      <div className="text-sm font-semibold text-white flex items-center gap-2">
                        {p.desc}
                        {p.highlight && <span className="text-[10px] font-mono text-violet-400 border border-violet-400/30 bg-violet-400/10 rounded-full px-2 py-0.5">popular</span>}
                      </div>
                      <div className="text-xs text-zinc-600 mt-0.5">credits</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="font-black text-xl">{p.price}</div>
                    {i === 0 ? (
                      <Link href="/sign-up">
                        <button className="text-xs font-semibold border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white rounded-lg px-4 py-2 transition-colors">
                          Get started
                        </button>
                      </Link>
                    ) : (
                      <Link href="/sign-up">
                        <button className={`text-xs font-semibold rounded-lg px-4 py-2 transition-colors ${p.highlight ? "bg-violet-600 hover:bg-violet-500 text-white" : "border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white"}`}>
                          Buy credits
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA — left-anchored ────────────────────────── */}
      <section className="border-t border-zinc-900 py-24 px-8 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12">
          <div>
            <h2 className="text-5xl font-black tracking-tight leading-tight mb-4">
              Build something<br />
              <span className="text-zinc-500">that runs itself.</span>
            </h2>
            <p className="text-zinc-400 max-w-sm">
              Join the beta. Get 250 free credits, no card required.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <Link href="/sign-up">
              <button className="bg-white text-black font-semibold text-sm px-6 py-3 rounded-lg hover:bg-zinc-100 transition-colors">
                Create free account
              </button>
            </Link>
            <Link href="/sign-in" className="text-zinc-400 hover:text-white text-sm font-medium transition-colors">
              I have an account →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="border-t border-zinc-900 py-8 px-8 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="size-6 bg-violet-600 rounded-md flex items-center justify-center">
              <Workflow className="size-3.5 text-white" />
            </div>
            <span className="font-bold text-sm text-zinc-300">FlowCraft</span>
          </div>
          <div className="flex items-center gap-8 text-xs text-zinc-600">
            <Link href="#features" className="hover:text-zinc-400 transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-zinc-400 transition-colors">Pricing</Link>
            <Link href="/sign-in" className="hover:text-zinc-400 transition-colors">Sign In</Link>
            <Link href="/sign-up" className="hover:text-zinc-400 transition-colors">Sign Up</Link>
          </div>
          <p className="text-xs text-zinc-700">© {new Date().getFullYear()} FlowCraft</p>
        </div>
      </footer>
    </div>
  );
}