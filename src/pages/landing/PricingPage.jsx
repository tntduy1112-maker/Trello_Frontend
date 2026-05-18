import LandingNav from '../../components/layout/LandingNav';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Everything you need to get started.',
    highlight: false,
    cta: { label: 'Get started free', href: '/register' },
    features: [
      'Up to 3 workspaces',
      'Unlimited boards per workspace',
      'Unlimited cards',
      'Basic file attachments (10 MB)',
      'Email notifications',
      'Community support',
    ],
  },
  {
    name: 'Pro',
    price: '$9',
    period: 'per user / month',
    desc: 'For growing teams that need more power.',
    highlight: true,
    cta: { label: 'Start free trial', href: '/register?plan=pro' },
    features: [
      'Unlimited workspaces',
      'Advanced permissions',
      'Priority notifications',
      'File attachments up to 250 MB',
      'Custom labels & fields',
      'CSV export',
      'Priority email support',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    desc: 'For large teams with advanced needs.',
    highlight: false,
    cta: { label: 'Contact sales', href: 'mailto:hello@productconlab.com' },
    features: [
      'Everything in Pro',
      'SSO / SAML',
      'Audit logs',
      'Dedicated support',
      'Custom SLA',
      'On-premise option',
      'Advanced analytics',
    ],
  },
];

function PlanCard({ plan }) {
  return (
    <div
      className={`relative flex flex-col rounded-trello p-8 border ${
        plan.highlight
          ? 'border-trello-blue bg-trello-blue shadow-trello-elevated text-white scale-[1.02]'
          : 'border-trello-gray-border bg-white shadow-trello-card'
      }`}
    >
      {plan.highlight && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-0.5 rounded-trello-pill">
          Most popular
        </span>
      )}

      <div className="mb-6">
        <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${plan.highlight ? 'text-white/70' : 'text-trello-gray-medium'}`}>
          {plan.name}
        </div>
        <div className="flex items-end gap-1.5 mb-1">
          <span className={`text-4xl font-bold ${plan.highlight ? 'text-white' : 'text-trello-navy'}`}>{plan.price}</span>
          <span className={`text-sm pb-1 ${plan.highlight ? 'text-white/60' : 'text-trello-gray-dark'}`}>{plan.period}</span>
        </div>
        <p className={`text-sm ${plan.highlight ? 'text-white/70' : 'text-trello-secondary'}`}>{plan.desc}</p>
      </div>

      <ul className="flex-1 space-y-3 mb-8">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.highlight ? 'text-white' : 'text-trello-blue'}`} />
            <span className={plan.highlight ? 'text-white/80' : 'text-trello-secondary'}>{f}</span>
          </li>
        ))}
      </ul>

      <Link
        to={plan.cta.href}
        className={`block text-center py-2.5 px-4 rounded-trello text-sm font-semibold transition-colors ${
          plan.highlight
            ? 'bg-white text-trello-blue hover:bg-trello-blue-pale'
            : 'bg-trello-blue text-white hover:bg-trello-blue-dark'
        }`}
        style={!plan.highlight ? { background: '#0C66E4' } : {}}
      >
        {plan.cta.label}
      </Link>
    </div>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNav />

      {/* Hero */}
      <section className="bg-gradient-to-b from-trello-blue-pale via-white to-white pt-20 pb-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-trello-blue bg-trello-blue-pale px-3 py-1.5 rounded-trello-pill mb-6">
            Simple, transparent pricing
          </span>
          <h1 className="text-4xl md:text-5xl font-semibold text-trello-navy leading-tight mb-4">
            Pay for what you need.{' '}
            <span className="text-trello-blue">Nothing more.</span>
          </h1>
          <p className="text-lg text-trello-secondary leading-relaxed">
            Start free. Upgrade when you need more. No hidden fees, no lock-in.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-trello-gray-light py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-trello-navy text-center mb-10">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'Can I cancel anytime?',
                a: 'Yes. You can cancel your subscription at any time and you will not be charged again. Your access continues until the end of the billing period.',
              },
              {
                q: 'Is there a free trial for Pro?',
                a: 'Yes — 14 days free, no credit card required. You will only be charged if you choose to continue after the trial.',
              },
              {
                q: 'What happens to my data if I downgrade?',
                a: 'Your data is never deleted. If you exceed free plan limits after downgrading, your boards go read-only until you upgrade again or remove items.',
              },
              {
                q: 'Do you offer discounts for non-profits or education?',
                a: 'Yes. Contact us at hello@productconlab.com and we will set you up with a discounted plan.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-trello-gray-border pb-6 last:border-0">
                <div className="text-base font-semibold text-trello-navy mb-2">{q}</div>
                <p className="text-sm text-trello-secondary leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-trello-navy py-16 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-semibold text-white mb-3">Ready to get started?</h2>
          <p className="text-sm text-white/60 mb-8">Join teams already building with Productcon Lab.</p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link to="/register" className="btn btn-primary text-sm">
              Start for free →
            </Link>
            <Link to="/about" className="btn text-sm text-white/70 border-white/20 hover:bg-white/10" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
              Learn more
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
