import LandingNav from '../../components/layout/LandingNav';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Check } from 'lucide-react';

const SOLUTIONS = {
  teams: {
    icon: '👥',
    name: 'For Teams',
    tagline: 'Collaborate without chaos.',
    desc: 'TaskFlow gives every team a shared workspace to plan, track, and ship — without the overhead of enterprise project management tools.',
    benefits: [
      'Shared workspaces with role-based permissions',
      'Real-time board updates via WebSocket',
      'Invite members by email with one click',
      'Comment threads, @mentions, and activity feed',
      'Card checklists and attachments',
      'Custom labels per board',
    ],
    cta: 'Create your team workspace',
    ctaHref: '/register',
    secondaryCta: 'See pricing',
    secondaryHref: '/pricing',
  },
  startups: {
    icon: '🚀',
    name: 'For Startups',
    tagline: 'Move from idea to shipped in weeks.',
    desc: 'Productcon Lab was built to prove that small teams can ship quality software fast. Use the same workflow and tools we use internally.',
    benefits: [
      'Product intake survey generates a full spec',
      'Claude builds business case + user stories',
      'Structured workflow: spec - plan - build - ship',
      'No enterprise bloat - just what you need',
      'Open build process you can copy and adapt',
      'Real products, real quality gates',
    ],
    cta: 'Start your product survey',
    ctaHref: '/survey.html',
    secondaryCta: 'How it works',
    secondaryHref: '/#how-it-works',
  },
  builders: {
    icon: '🔧',
    name: 'For Builders',
    tagline: 'AI as your engineering partner.',
    desc: 'Use Claude Code and a structured workflow to build production-quality apps - with TDD, code review, and staged deploys baked in from day one.',
    benefits: [
      'Full development workflow: /spec /plan /build /review /deploy',
      'Test-driven development with 80%+ coverage requirement',
      'Five-axis code review on every PR',
      'Staged deploy: local - dev - prod with health checks',
      'Go + React + PostgreSQL reference architecture',
      'All project docs and CLAUDE.md configs available',
    ],
    cta: 'Explore the workflow',
    ctaHref: '/about',
    secondaryCta: 'Browse products',
    secondaryHref: '/#products',
  },
};

export default function SolutionPage() {
  const { slug } = useParams();
  const solution = SOLUTIONS[slug];

  if (!solution) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-white">
      <LandingNav />

      {/* Hero */}
      <section className="bg-gradient-to-b from-trello-blue-pale via-white to-white pt-20 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-trello bg-trello-blue-pale flex items-center justify-center text-2xl">
              {solution.icon}
            </div>
            <span className="text-xs font-bold text-trello-blue uppercase tracking-wider">
              {solution.name}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-semibold text-trello-navy leading-tight mb-5">
            {solution.tagline}
          </h1>
          <p className="text-lg text-trello-secondary leading-relaxed mb-8 max-w-xl">
            {solution.desc}
          </p>

          <div className="flex gap-3 flex-wrap">
            <Link to={solution.ctaHref} className="btn btn-primary text-sm">
              {solution.cta} →
            </Link>
            <Link to={solution.secondaryHref} className="btn btn-secondary text-sm">
              {solution.secondaryCta}
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-trello-navy mb-8">What you get</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {solution.benefits.map((b) => (
              <div key={b} className="flex items-start gap-3 bg-trello-gray-light rounded-trello p-4">
                <Check className="w-4 h-4 text-trello-blue flex-shrink-0 mt-0.5" />
                <span className="text-sm text-trello-secondary">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-trello-navy py-16 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-semibold text-white mb-3">Ready?</h2>
          <p className="text-sm text-white/60 mb-8">Get started today - no credit card required.</p>
          <Link to={solution.ctaHref} className="btn btn-primary text-sm">
            {solution.cta} →
          </Link>
        </div>
      </section>
    </div>
  );
}
