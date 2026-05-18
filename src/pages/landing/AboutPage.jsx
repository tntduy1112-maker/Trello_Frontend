import LandingNav from '../../components/layout/LandingNav';
import { Link } from 'react-router-dom';

const TIMELINE = [
  { date: 'Jan 2025', event: 'Project started', desc: 'Idea: can Claude build production-quality software end-to-end?' },
  { date: 'Feb 2025', event: 'TaskFlow spec complete', desc: 'Business case, PRD, and user stories written entirely with Claude.' },
  { date: 'Mar 2025', event: 'TaskFlow shipped', desc: 'Go + React + PostgreSQL app deployed to production in ~6 weeks.' },
  { date: 'Apr 2025', event: 'Productcon Lab launched', desc: 'Landing page and brand launched. DiaryFlow in progress.' },
  { date: 'Now', event: 'Growing the suite', desc: 'Each new product tests the same hypothesis at a different domain.' },
];

const STACK = [
  { label: 'Backend', value: 'Go 1.22 + Gin', icon: '⚙️' },
  { label: 'Frontend', value: 'React + Vite', icon: '⚛️' },
  { label: 'Database', value: 'PostgreSQL 16 + sqlc', icon: '🗄️' },
  { label: 'Cache', value: 'Redis', icon: '⚡' },
  { label: 'Auth', value: 'JWT RS256 + bcrypt', icon: '🔐' },
  { label: 'AI partner', value: 'Claude (Anthropic)', icon: '🤖' },
];

const VALUES = [
  {
    title: 'Hypothesis first',
    desc: 'Every feature starts with a measurable hypothesis. If we cannot define success, we do not build.',
  },
  {
    title: 'Ship real things',
    desc: 'No demos. No prototypes presented as products. Everything here is live, tested, and in use.',
  },
  {
    title: 'Quality gates',
    desc: '80% test coverage, code review, and staged rollout on every release. AI-built does not mean untested.',
  },
  {
    title: 'Open workflow',
    desc: 'Our entire development process - specs, plans, and decisions - is documented and available to read.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNav />

      {/* Hero */}
      <section className="bg-gradient-to-b from-trello-blue-pale via-white to-white pt-20 pb-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-trello-blue bg-trello-blue-pale px-3 py-1.5 rounded-trello-pill mb-6">
            About Productcon Lab
          </span>
          <h1 className="text-4xl md:text-5xl font-semibold text-trello-navy leading-tight mb-5">
            An experiment in{' '}
            <span className="text-trello-blue">AI-assisted engineering.</span>
          </h1>
          <p className="text-lg text-trello-secondary leading-relaxed">
            Productcon Lab is a live portfolio of production software built from scratch using Claude as the engineering partner. Every product here proves that AI-assisted development can deliver real, quality software - fast.
          </p>
        </div>
      </section>

      {/* The hypothesis */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <span className="text-xs font-bold text-trello-blue uppercase tracking-wider bg-trello-blue-pale px-3 py-1 rounded-trello-pill">
              The hypothesis
            </span>
          </div>
          <blockquote className="border-l-4 border-trello-blue pl-6 mb-8">
            <p className="text-xl font-medium text-trello-navy leading-relaxed mb-2">
              "A structured AI workflow can produce production-quality software in weeks, not months - without sacrificing code quality, test coverage, or maintainability."
            </p>
          </blockquote>
          <p className="text-base text-trello-secondary leading-relaxed mb-4">
            Every product in the Productcon Lab suite is a test of this idea. Not a demo. Not a proof-of-concept. A fully deployed, tested, monitored application with real users.
          </p>
          <p className="text-base text-trello-secondary leading-relaxed">
            The workflow follows a strict sequence: business case - product spec - user stories - implementation plan - build (TDD) - code review - staged deploy. Claude participates in every phase. The human sets direction, validates decisions, and approves releases.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-trello-gray-light py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <span className="text-xs font-bold text-trello-blue uppercase tracking-wider bg-trello-blue-pale px-3 py-1 rounded-trello-pill">
              Principles
            </span>
            <h2 className="text-2xl font-semibold text-trello-navy mt-3">How we build</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {VALUES.map((v) => (
              <div key={v.title} className="bg-white border border-trello-gray-border rounded-trello p-6 shadow-trello-card">
                <div className="text-base font-semibold text-trello-navy mb-2">{v.title}</div>
                <p className="text-sm text-trello-secondary leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-10 text-center">
            <span className="text-xs font-bold text-trello-blue uppercase tracking-wider bg-trello-blue-pale px-3 py-1 rounded-trello-pill">
              Timeline
            </span>
            <h2 className="text-2xl font-semibold text-trello-navy mt-3">How we got here</h2>
          </div>
          <div className="relative">
            <div className="absolute left-[72px] top-2 bottom-2 w-px bg-trello-gray-border" />
            <div className="space-y-8">
              {TIMELINE.map((item, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="w-[72px] flex-shrink-0 text-right">
                    <span className="text-xs font-bold text-trello-gray-medium">{item.date}</span>
                  </div>
                  <div className="relative flex-shrink-0 mt-0.5">
                    <div className="w-3 h-3 rounded-full bg-trello-blue border-2 border-white ring-2 ring-trello-blue" />
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="text-sm font-semibold text-trello-navy mb-1">{item.event}</div>
                    <p className="text-sm text-trello-secondary leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="bg-trello-gray-light py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 text-center">
            <span className="text-xs font-bold text-trello-blue uppercase tracking-wider bg-trello-blue-pale px-3 py-1 rounded-trello-pill">
              Stack
            </span>
            <h2 className="text-2xl font-semibold text-trello-navy mt-3">What we build with</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {STACK.map((s) => (
              <div key={s.label} className="bg-white border border-trello-gray-border rounded-trello p-4 shadow-trello-card flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-trello-blue-pale flex items-center justify-center text-lg flex-shrink-0">
                  {s.icon}
                </div>
                <div>
                  <div className="text-xs font-bold text-trello-gray-medium uppercase tracking-wider">{s.label}</div>
                  <div className="text-sm font-medium text-trello-navy">{s.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-trello-navy py-16 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-semibold text-white mb-3">Want to build something?</h2>
          <p className="text-sm text-white/60 mb-8">
            Fill in the product intake survey and Claude will generate a full spec. Then bring it to life.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <a href="/survey.html" target="_blank" rel="noreferrer" className="btn btn-primary text-sm">
              Start the survey →
            </a>
            <Link to="/#how-it-works" className="btn text-sm text-white/70 border-white/20 hover:bg-white/10" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
              How it works
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
