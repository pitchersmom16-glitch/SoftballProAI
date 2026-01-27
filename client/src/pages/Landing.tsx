import { Link } from "wouter";
import { Activity, TrendingUp, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      <section className="w-full min-h-screen bg-brand-black flex flex-col lg:flex-row items-center overflow-hidden relative">
        {/* === LAYER 1: THE SKELETON (Background & Position) === */}
        <div className="absolute inset-0 z-0">
          {/* MOBILE: Cover the screen, centered */}
          <img
            src={heroImage}
            alt="Biomechanics Background"
            className="absolute inset-0 w-full h-full object-cover object-center lg:hidden"
          />
          {/* DESKTOP: Positioned on right side, contained to fit properly */}
          <img
            src={heroImage}
            alt="Biomechanics Background"
            className="absolute top-0 right-0 h-full w-[65%] object-contain object-right hidden lg:block"
          />
          {/* MOBILE: Lighter gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/40 to-transparent lg:hidden" />
          {/* DESKTOP: Lighter gradient on left only, skeleton fully visible on right */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/30 to-transparent hidden lg:block" />
        </div>

        {/* === LAYER 2: THE TEXT (Content) === */}
        <div className="relative z-10 container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl text-left space-y-8">
            {/* The AI Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse"/>
              <span className="text-sm font-medium text-gray-300 tracking-wide">AI-POWERED ACADEMY</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
              The World's First <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-blue">
                AI-Powered Softball Academy
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed">
              Master mechanics, mental toughness, and strength with the only AI that sees what the human eye misses. Built specifically for 8U to 16U athletes.
            </p>

            {/* Feature Bullets */}
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-pink" />
                <span>Instant Pitching, Hitting & Catching Biometrics</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-pink" />
                <span>Daily Championship Mindset & Audio Visualization</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-pink" />
                <span>AI-Generated Strength & Conditioning Plans</span>
              </li>
            </ul>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/api/login">
                <Button 
                  className="h-14 px-8 text-lg bg-gradient-to-r from-brand-pink to-purple-600 transition-all shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                  data-testid="button-analyze-video"
                >
                  Analyze My Video
                </Button>
              </Link>
              <Link href="#features">
                <Button 
                  variant="outline" 
                  className="h-14 px-8 text-lg border-white/20 text-white backdrop-blur-md"
                  data-testid="button-for-teams"
                >
                  For Teams & Coaches
                </Button>
              </Link>
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
