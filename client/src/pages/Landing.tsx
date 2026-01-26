import { Link } from "wouter";
import { ArrowRight, Activity, Zap, TrendingUp, CheckCircle2 } from "lucide-react";

export default function Landing() {
  return (
    <div className="relative overflow-hidden">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl text-accent">✦</span>
            <span className="text-xl font-bold font-display text-slate-900">SwingAI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/api/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">Sign In</Link>
            <Link href="/api/login">
              <button className="px-5 py-2.5 rounded-full bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-all hover:shadow-lg hover:-translate-y-0.5">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent-foreground text-xs font-bold uppercase tracking-wider mb-6">
              <Zap className="h-3 w-3" />
              AI-Powered Coaching
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold font-display text-slate-900 leading-[1.1] mb-6">
              The Ultimate <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-600">Softball Coach</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
              Analyze mechanics instantly with AI video breakdown. Track athlete progress, assign personalized drills, and build championship teams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/api/login">
                <button className="h-12 px-8 rounded-full bg-accent text-slate-900 font-bold text-lg hover:bg-accent/90 transition-all shadow-xl shadow-accent/20 hover:shadow-accent/30 hover:-translate-y-1 flex items-center justify-center gap-2">
                  Start Coaching Free
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
              <Link href="#features">
                <button className="h-12 px-8 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold text-lg hover:bg-slate-50 transition-all hover:-translate-y-1">
                  View Features
                </button>
              </Link>
            </div>
            
            <div className="mt-10 flex items-center gap-4 text-sm text-slate-500">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-8 rounded-full bg-slate-200 border-2 border-white" />
                ))}
              </div>
              <p>Trusted by 500+ coaches</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-accent/30 to-purple-500/30 rounded-[2rem] blur-2xl opacity-70 -z-10" />
            <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-slate-900 aspect-[4/3]">
              {/* Abstract dashboard representation */}
              <div className="absolute inset-0 bg-slate-800/50 backdrop-blur-sm p-8 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div className="h-8 w-32 bg-slate-700 rounded-lg animate-pulse" />
                  <div className="h-8 w-8 bg-accent rounded-full animate-pulse" />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-700/50 p-4 rounded-2xl h-32 animate-pulse" />
                  <div className="bg-slate-700/50 p-4 rounded-2xl h-32 animate-pulse" />
                </div>
                <div className="flex-1 bg-slate-700/30 rounded-2xl border border-slate-600/50 p-4 flex items-center justify-center">
                  <p className="text-slate-400 font-medium">AI Analysis in progress...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold font-display text-slate-900 mb-4">Everything you need to win</h2>
            <p className="text-slate-600 text-lg">From swing mechanics to roster management, SwingAI gives you the tools to develop elite athletes.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Video,
                title: "AI Video Analysis",
                desc: "Upload game footage and get instant biomechanical feedback on pitching and hitting form."
              },
              {
                icon: Activity,
                title: "Progress Tracking",
                desc: "Visualize improvement over time with automated metric tracking and history logs."
              },
              {
                icon: TrendingUp,
                title: "Smart Drills",
                desc: "Receive personalized drill recommendations based on identified mechanical flaws."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="h-12 w-12 rounded-2xl bg-accent/10 text-accent-foreground flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold font-display text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
