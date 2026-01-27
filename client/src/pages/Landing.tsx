import { Link } from "wouter";
import { ArrowRight, Activity, Zap, TrendingUp, Video } from "lucide-react";

export default function Landing() {
  return (
    <div className="relative overflow-hidden min-h-screen" style={{ backgroundColor: '#050505' }}>
      {/* Navbar */}
      <nav className="fixed w-full z-50 glass-panel border-b border-brand-neon/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl neon-glow" style={{ color: '#39FF14' }}>◆</span>
            <span className="text-xl font-bold font-display text-white">SoftballProAI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/api/login" className="text-sm font-medium text-gray-400 hover:text-brand-neon transition-colors" data-testid="link-signin">Sign In</Link>
            <Link href="/api/login">
              <button className="px-5 py-2.5 rounded-full btn-primary-glow text-sm" data-testid="button-get-started">
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border" style={{ backgroundColor: 'rgba(255, 16, 240, 0.15)', color: '#FF10F0', borderColor: 'rgba(255, 16, 240, 0.4)' }}>
              <Zap className="h-3 w-3" />
              AI-Powered Coaching
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold font-display leading-[1.1] mb-6 text-white">
              The Ultimate <br/>
              <span className="gradient-text">Softball Coach</span>
            </h1>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed max-w-lg">
              Analyze windmill mechanics instantly with AI video breakdown. Track athlete progress, assign personalized drills, and build championship fastpitch teams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
              <Link href="/api/login">
                <button className="h-12 px-8 rounded-full btn-primary-glow text-lg flex items-center justify-center gap-2" data-testid="button-start-coaching">
                  Start Coaching Free
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
              <Link href="#features">
                <button className="h-12 px-8 rounded-full bg-transparent font-semibold text-lg text-white transition-all hover:-translate-y-1 border" style={{ borderColor: 'rgba(57, 255, 20, 0.4)' }} data-testid="button-view-features">
                  View Features
                </button>
              </Link>
            </div>
            
            <div className="mt-10 flex items-center gap-4 text-sm text-gray-500 flex-wrap">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-8 rounded-full border-2" style={{ background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.3), rgba(255, 16, 240, 0.3))', borderColor: '#050505' }} />
                ))}
              </div>
              <p>Trusted by 500+ coaches</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] blur-2xl opacity-70 -z-10" style={{ background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.3), rgba(255, 16, 240, 0.2), rgba(250, 255, 0, 0.2))' }} />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] border" style={{ backgroundColor: '#050505', borderColor: 'rgba(57, 255, 20, 0.3)' }}>
              {/* Abstract dashboard representation */}
              <div className="absolute inset-0 p-8 flex flex-col" style={{ background: 'linear-gradient(135deg, #050505, #0a0a0a)' }}>
                <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
                  <div className="h-8 w-32 rounded-lg animate-pulse" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                  <div className="h-8 w-8 rounded-full animate-pulse neon-glow" style={{ backgroundColor: '#39FF14' }} />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 rounded-2xl h-32 animate-pulse border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(57, 255, 20, 0.3)' }} />
                  <div className="p-4 rounded-2xl h-32 animate-pulse border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 16, 240, 0.3)' }} />
                </div>
                <div className="flex-1 rounded-2xl p-4 flex items-center justify-center border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(250, 255, 0, 0.3)' }}>
                  <p className="font-medium" style={{ color: '#39FF14' }}>AI Analysis in progress...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold font-display mb-4" style={{ color: '#39FF14' }}>Everything you need to win</h2>
            <p className="text-gray-400 text-lg">From windmill mechanics to roster management, SoftballProAI gives you the tools to develop elite fastpitch athletes.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Video,
                title: "AI Video Analysis",
                desc: "Upload game footage and get instant biomechanical feedback on windmill pitching and hitting form.",
                borderColor: "#39FF14",
                iconBg: "rgba(57, 255, 20, 0.2)",
                iconColor: "#39FF14"
              },
              {
                icon: Activity,
                title: "Progress Tracking",
                desc: "Visualize improvement over time with automated metric tracking for drag foot, arm circle speed, and release point.",
                borderColor: "#FF10F0",
                iconBg: "rgba(255, 16, 240, 0.2)",
                iconColor: "#FF10F0"
              },
              {
                icon: TrendingUp,
                title: "Smart Drills",
                desc: "Receive personalized drill recommendations for rise ball, drop ball, and change-up mechanics.",
                borderColor: "#FAFF00",
                iconBg: "rgba(250, 255, 0, 0.2)",
                iconColor: "#FAFF00"
              }
            ].map((feature, i) => (
              <div 
                key={i} 
                className="p-8 rounded-3xl transition-all duration-300 group card-hover"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  borderColor: `${feature.borderColor}40`
                }}
                data-testid={`card-feature-${i}`}
              >
                <div 
                  className="h-12 w-12 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110"
                  style={{ backgroundColor: feature.iconBg }}
                >
                  <feature.icon className="h-6 w-6" style={{ color: feature.iconColor }} />
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
        <div className="absolute inset-0 blur-3xl" style={{ background: 'linear-gradient(90deg, rgba(57, 255, 20, 0.1), rgba(255, 16, 240, 0.1), rgba(250, 255, 0, 0.1))' }} />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold font-display mb-6" style={{ color: '#39FF14' }}>Ready to dominate the circle?</h2>
          <p className="text-gray-400 text-lg mb-8">Join thousands of fastpitch coaches using AI to develop elite athletes.</p>
          <Link href="/api/login">
            <button className="h-14 px-10 rounded-full btn-primary-glow text-lg" data-testid="button-start-trial">
              Start Free Trial
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
