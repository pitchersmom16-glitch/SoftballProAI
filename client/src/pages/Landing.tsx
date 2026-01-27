import { Link } from "wouter";
import { ArrowRight, Activity, Zap, TrendingUp, Video } from "lucide-react";
import logo from "@/assets/logo.jpg";
import heroImage from "@/assets/hero.jpg";

export default function Landing() {
  return (
    <div className="relative overflow-hidden min-h-screen" style={{ backgroundColor: '#050505' }}>
      {/* Navbar */}
      <nav className="fixed w-full z-50 border-b" style={{ backgroundColor: 'rgba(5, 5, 5, 0.8)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="SoftballProAI" className="h-14 w-auto object-contain" />
          </div>
          <div className="flex items-center gap-4">
            <Link href="/api/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors" data-testid="link-signin">Sign In</Link>
            <Link href="/api/login">
              <button className="px-5 py-2.5 rounded-full btn-primary-glow text-sm" data-testid="button-get-started">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center overflow-hidden bg-brand-black">
        {/* 1. BACKGROUND LAYER (The Skeleton) */}
        <div className="absolute inset-0 z-0 flex justify-end items-center">
          {/* Image is anchored to the RIGHT side */}
          <img
            src={heroImage}
            alt="Biomechanics Background"
            className="w-full lg:w-[65%] h-full object-contain object-right opacity-60 animate-pulse-slow"
          />
          {/* The Gradient Fade (Crucial for reading text) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/70 to-transparent" />
        </div>

        {/* CONTENT LAYER (On top) */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider mb-6 badge-glass">
              <Zap className="h-3 w-3" style={{ color: '#8B5CF6' }} />
              <span className="text-gray-300">AI-Powered Coaching</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-display leading-[1.1] mb-6 text-white">
              The Ultimate <br/>
              <span className="text-white">Softball Coach</span>
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
                <button className="h-12 px-8 rounded-full font-medium text-lg text-white transition-all hover:-translate-y-1" style={{ background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.2)' }} data-testid="button-view-features">
                  View Features
                </button>
              </Link>
            </div>
            
            <div className="mt-10 flex items-center gap-4 text-sm text-gray-500 flex-wrap">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-8 rounded-full border-2" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(255, 16, 240, 0.3))', borderColor: '#050505' }} />
                ))}
              </div>
              <p className="text-gray-500">Trusted by 500+ coaches</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
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
                desc: "Upload game footage and get instant biomechanical feedback on windmill pitching and hitting form."
              },
              {
                icon: Activity,
                title: "Progress Tracking",
                desc: "Visualize improvement over time with automated metric tracking for drag foot, arm circle speed, and release point."
              },
              {
                icon: TrendingUp,
                title: "Smart Drills",
                desc: "Receive personalized drill recommendations for rise ball, drop ball, and change-up mechanics."
              }
            ].map((feature, i) => (
              <div 
                key={i} 
                className="p-8 rounded-3xl transition-all duration-300 group hover:-translate-y-1"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
                data-testid={`card-feature-${i}`}
              >
                <div 
                  className="h-12 w-12 rounded-2xl flex items-center justify-center mb-6 transition-all"
                  style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)' }}
                >
                  <feature.icon className="h-6 w-6" style={{ color: '#8B5CF6' }} />
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
        <div className="absolute inset-0 blur-3xl opacity-30" style={{ background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.2), rgba(255, 16, 240, 0.1))' }} />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold font-display text-white mb-6">Ready to dominate the circle?</h2>
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
