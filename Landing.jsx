import { Link } from 'react-router-dom'
import { Heart, Zap, MapPin, Star, ArrowRight, Users, Globe, Award } from 'lucide-react'

const STATS = [
  { value: '2,400+', label: 'Active Volunteers' },
  { value: '180+',   label: 'Partner NGOs' },
  { value: '12K+',   label: 'Hours Contributed' },
  { value: '94%',    label: 'Match Success Rate' },
]

const FEATURES = [
  {
    icon: Zap,
    title: 'Smart Skill Matching',
    desc: 'Our algorithm connects you with NGOs that need exactly what you offer — from coding to counselling.',
    color: 'from-brand-500 to-purple-500',
  },
  {
    icon: MapPin,
    title: 'Location-Based Search',
    desc: 'Find volunteer opportunities near you. Filter by city or let us detect your location automatically.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Star,
    title: 'Earn Points & Badges',
    desc: 'Every application and event you attend earns you recognition. Build your volunteer portfolio.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Heart,
    title: 'Real-Time Chat',
    desc: 'Connect directly with NGO coordinators. Ask questions, share updates, build relationships.',
    color: 'from-pink-500 to-rose-500',
  },
]

const CAUSES = [
  { emoji: '📚', name: 'Education' },
  { emoji: '🌱', name: 'Environment' },
  { emoji: '❤️', name: 'Health' },
  { emoji: '💻', name: 'Technology' },
  { emoji: '⚖️', name: 'Legal Aid' },
  { emoji: '🎨', name: 'Arts' },
  { emoji: '🏘️', name: 'Community' },
  { emoji: '🌍', name: 'Human Rights' },
]

export default function Landing() {
  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-24">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-brand-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)`,
              backgroundSize: '64px 64px',
            }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-sm font-medium mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse-slow" />
            Now live across 20+ Indian cities
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-white leading-[1.05] mb-6 animate-slide-up stagger-1">
            Find Your <span className="gradient-text">Purpose.</span>
            <br />Change the <span className="italic text-slate-300">World.</span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up stagger-2">
            Volunteer Connect matches passionate students with impactful NGOs
            using smart skill-based algorithms. No cold emails, no guesswork —
            just meaningful connections.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-3">
            <a href="/api/auth/google" className="btn-primary text-base px-7 py-3 shadow-xl shadow-brand-500/30">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link to="/ngos" className="btn-secondary text-base px-7 py-3">
              Browse NGOs
            </Link>
          </div>

          {/* Floating user avatars */}
          <div className="mt-14 flex items-center justify-center gap-3 animate-fade-in stagger-4">
            <div className="flex -space-x-3">
              {['A', 'B', 'C', 'D', 'E'].map((l, i) => (
                <div key={l}
                  className="w-9 h-9 rounded-full border-2 border-surface-900 flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: `hsl(${220 + i * 30}, 70%, 55%)`, zIndex: 5 - i }}
                >
                  {l}
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-400">
              Join <span className="text-white font-semibold">2,400+</span> volunteers already making a difference
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────── */}
      <section className="py-16 border-y border-surface-700/50">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <div className="font-display text-4xl text-white mb-1">{value}</div>
              <div className="text-slate-500 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-3">Why Volunteer Connect</p>
            <h2 className="section-heading">Everything you need to <br className="hidden sm:block" />start volunteering</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color }, i) => (
              <div key={title} className={`card-hover glow-hover p-6 animate-slide-up stagger-${i + 1}`}>
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-display text-lg text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Causes ───────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-surface-800/30 border-y border-surface-700/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="section-heading mb-4">Causes that matter</h2>
          <p className="text-slate-400 mb-12">From education to environment — find NGOs aligned with your passion.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {CAUSES.map(({ emoji, name }) => (
              <Link
                key={name}
                to={`/ngos?category=${name}`}
                className="flex items-center gap-2 px-5 py-3 card-hover rounded-full text-sm font-medium text-slate-300 hover:text-white"
              >
                <span className="text-xl">{emoji}</span>
                {name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-heading">How it works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-px bg-gradient-to-r from-brand-500/50 to-brand-500/50" />
            {[
              { step: '01', title: 'Create Your Profile', desc: 'Sign in with Google, pick your role, add your skills and location.' },
              { step: '02', title: 'Get Matched',         desc: 'Our algorithm ranks NGOs by skill compatibility and proximity.' },
              { step: '03', title: 'Volunteer & Earn',    desc: 'Apply, attend events, chat with coordinators, earn badges.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-brand-500/30">
                  <span className="font-mono text-white font-bold text-lg">{step}</span>
                </div>
                <h3 className="font-display text-xl text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="card p-12 glow-hover border-brand-500/20" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.08))' }}>
            <div className="text-4xl mb-4">🌟</div>
            <h2 className="section-heading mb-4">Ready to make a difference?</h2>
            <p className="text-slate-400 mb-8">Join thousands of students creating real impact across India.</p>
            <a href="/api/auth/google" className="btn-primary text-base px-8 py-3.5">
              Start Volunteering Today <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="border-t border-surface-700/50 py-10 px-4 text-center text-slate-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-4 h-4 text-brand-500" />
          <span className="font-display text-slate-300">VolunteerConnect</span>
        </div>
        <p>Built with ❤️ to connect students with meaningful causes. © 2025</p>
      </footer>
    </div>
  )
}
