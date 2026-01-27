import { Link } from "wouter";
import { ArrowRight, Activity, Zap, TrendingUp, Video } from "lucide-react";

export default function Landing() {
  return (
    <div className="relative overflow-hidden bg-background min-h-screen">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl text-neon-green neon-glow">◆</span>
            <span className="text-xl font-bold font-display text-white">SoftballProAI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/api/login" className="text-sm font-medium text-gray-400 hover:text-neon-green transition-colors">Sign In</Link>
            <Link href="/api/login">
              <button className="px-5 py-2.5 rounded-full bg-neon-green text-black font-bold text-sm hover:shadow-lg hover:shadow-neon-green/30 transition-all hover:-translate-y-0.5">
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-pink/20 text-neon-pink text-xs font-bold uppercase tracking-wider mb-6 border border-neon-pink/30">
              <Zap className="h-3 w-3" />
              AI-Powered Coaching
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold font-display text-white leading-[1.1] mb-6">
              The Ultimate <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green via-neon-pink to-neon-yellow">Softball Coach</span>
            </h1>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed max-w-lg">
              Analyze windmill mechanics instantly with AI video breakdown. Track athlete progress, assign personalized drills, and build championship fastpitch teams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/api/login">
                <button className="h-12 px-8 rounded-full bg-neon-green text-black font-bold text-lg hover:shadow-xl hover:shadow-neon-green/40 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 neon-glow">
                  Start Coaching Free
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
              <Link href="#features">
                <button className="h-12 px-8 rounded-full bg-transparent border border-white/20 text-white font-semibold text-lg hover:bg-white/5 hover:border-neon-pink/50 transition-all hover:-translate-y-1">
                  View Features
                </button>
              </Link>
            </div>
            
            <div className="mt-10 flex items-center gap-4 text-sm text-gray-500">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-8 rounded-full bg-gradient-to-br from-neon-green/30 to-neon-pink/30 border-2 border-black" />
                ))}
              </div>
              <p>Trusted by 500+ coaches</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-neon-green/30 via-neon-pink/20 to-neon-yellow/20 rounded-[2rem] blur-2xl opacity-70 -z-10" />
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black aspect-[4/3]">
              {/* Abstract dashboard representation */}
              <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900 p-8 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div className="h-8 w-32 bg-white/10 rounded-lg animate-pulse" />
                  <div className="h-8 w-8 bg-neon-green rounded-full animate-pulse neon-glow" />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/5 p-4 rounded-2xl h-32 animate-pulse border border-neon-green/20" />
                  <div className="bg-white/5 p-4 rounded-2xl h-32 animate-pulse border border-neon-pink/20" />
                </div>
                <div className="flex-1 bg-white/5 rounded-2xl border border-neon-yellow/20 p-4 flex items-center justify-center">
                  <p className="text-neon-green font-medium">AI Analysis in progress...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold font-display text-white mb-4">Everything you need to win</h2>
            <p className="text-gray-400 text-lg">From windmill mechanics to roster management, SoftballProAI gives you the tools to develop elite fastpitch athletes.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Video,
                title: "AI Video Analysis",
                desc: "Upload game footage and get instant biomechanical feedback on windmill pitching and hitting form.",
                color: "neon-green",
                glow: "neon-glow"
              },
              {
                icon: Activity,
                title: "Progress Tracking",
                desc: "Visualize improvement over time with automated metric tracking for drag foot, arm circle speed, and release point.",
                color: "neon-pink",
                glow: "neon-glow-pink"
              },
              {
                icon: TrendingUp,
                title: "Smart Drills",
                desc: "Receive personalized drill recommendations for rise ball, drop ball, and change-up mechanics.",
                color: "neon-yellow",
                glow: "neon-glow-yellow"
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-white/20 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 group">
                <div className={`h-12 w-12 rounded-2xl bg-${feature.color}/20 text-${feature.color} flex items-center justify-center mb-6 group-hover:${feature.glow} transition-all`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold font-display text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-green/10 via-neon-pink/10 to-neon-yellow/10 blur-3xl" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold font-display text-white mb-6">Ready to dominate the circle?</h2>
          <p className="text-gray-400 text-lg mb-8">Join thousands of fastpitch coaches using AI to develop elite athletes.</p>
          <Link href="/api/login">
            <button className="h-14 px-10 rounded-full bg-neon-green text-black font-bold text-lg hover:shadow-xl hover:shadow-neon-green/40 transition-all hover:-translate-y-1 neon-glow">
              Start Free Trial
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
