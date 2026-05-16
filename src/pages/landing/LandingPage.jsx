import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LandingNav from '../../components/layout/LandingNav';

const PRODUCTS = [
  {
    icon: '🗂️',
    name: 'TaskFlow',
    type: 'Team productivity · Kanban',
    status: 'live',
    desc: 'A Trello-inspired project management app with workspaces, boards, drag-and-drop cards, and real-time team collaboration.',
    tags: ['Go + Gin', 'React', 'PostgreSQL', 'Redis', 'WebSocket'],
    href: '/app/home',
    loginRequired: true,
  },
  {
    icon: '📊',
    name: 'BudgetFlow',
    type: 'Finance · Expense tracking',
    status: 'wip',
    desc: 'Track team expenses, set budgets per project, approve requests, and export reports. Built for small teams that outgrow spreadsheets.',
    tags: ['Go + Gin', 'Next.js', 'PostgreSQL'],
    href: null,
  },
  {
    icon: '🤝',
    name: 'HireFlow',
    type: 'HR · Recruitment pipeline',
    status: 'planned',
    desc: 'Manage job applications, track candidates through stages, schedule interviews, and collaborate with hiring managers.',
    tags: ['Go + Gin', 'React', 'PostgreSQL'],
    href: null,
  },
];

const STATUS_CONFIG = {
  live:    { label: '● Live',       className: 'bg-green-50 text-green-700' },
  wip:     { label: '⏳ In progress', className: 'bg-orange-50 text-orange-700' },
  planned: { label: '💡 Planned',   className: 'bg-trello-gray-light text-trello-gray-dark' },
};

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const isLive = product.status === 'live';
  const cfg = STATUS_CONFIG[product.status];

  const handleOpen = () => {
    if (!product.href) return;
    if (product.loginRequired && !isAuthenticated) {
      navigate('/login');
    } else {
      navigate(product.href);
    }
  };

  return (
    <div
      className={`bg-white border border-trello-gray-border rounded-trello p-6 flex flex-col shadow-trello-card transition-all duration-200 relative ${
        isLive ? 'hover:shadow-trello-card-hover hover:-translate-y-0.5 cursor-default' : 'opacity-60'
      }`}
    >
      <span className={`absolute top-4 right-4 text-xs font-bold px-2.5 py-0.5 rounded-trello-pill ${cfg.className}`}>
        {cfg.label}
      </span>

      <div className="flex items-start gap-3 mb-4">
        <div className="w-11 h-11 rounded-trello bg-trello-blue-pale flex items-center justify-center text-xl flex-shrink-0">
          {product.icon}
        </div>
        <div>
          <div className="text-base font-semibold text-trello-navy">{product.name}</div>
          <div className="text-xs text-trello-gray-dark mt-0.5">{product.type}</div>
        </div>
      </div>

      <p className="text-sm text-trello-gray-dark leading-relaxed mb-4 flex-1">{product.desc}</p>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {product.tags.map((t) => (
          <span key={t} className="text-xs text-trello-secondary bg-trello-gray-light px-2 py-0.5 rounded">
            {t}
          </span>
        ))}
      </div>

      <div className="pt-4 border-t border-trello-gray-border">
        {isLive ? (
          <button
            onClick={handleOpen}
            className="btn btn-primary w-full justify-center text-sm py-2 min-h-0"
          >
            Open app →
          </button>
        ) : (
          <button
            disabled
            className="btn btn-secondary w-full justify-center text-sm py-2 min-h-0 opacity-50 cursor-not-allowed"
          >
            {product.status === 'wip' ? 'In progress' : 'Coming soon'}
          </button>
        )}
      </div>
    </div>
  );
}

function HowStep({ num, title, desc }) {
  return (
    <div className="text-center">
      <div className="w-10 h-10 rounded-trello-pill bg-trello-blue-pale text-trello-blue text-base font-bold flex items-center justify-center mx-auto mb-4">
        {num}
      </div>
      <div className="text-base font-semibold text-trello-navy mb-2">{title}</div>
      <p className="text-sm text-trello-gray-dark leading-relaxed">{desc}</p>
    </div>
  );
}

export default function LandingPage() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <LandingNav />

      {/* ── HERO ── */}
      <section className="bg-gradient-to-b from-trello-blue-pale via-white to-white pt-20 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-trello-blue bg-trello-blue-pale px-3 py-1.5 rounded-trello-pill mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-trello-blue inline-block" />
            Built entirely with Claude AI
          </span>

          <h1 className="text-4xl md:text-5xl font-semibold text-trello-navy leading-tight mb-5 tracking-tight">
            Products built fast.{' '}
            <span className="text-trello-blue">Shipped with confidence.</span>
          </h1>

          <p className="text-lg text-trello-secondary max-w-xl mx-auto mb-8 leading-relaxed">
            A growing suite of tools for teams — each one designed, built, and deployed with Claude as the engineering partner.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a href="#products" className="btn btn-primary text-sm">
              Browse products →
            </a>
            <a href="#survey" className="btn btn-secondary text-sm">
              Have an idea? Build it
            </a>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-10 mt-14 pt-10 border-t border-trello-gray-border">
            {[
              { value: '1', label: 'Live product' },
              { value: '~6 wks', label: 'Zero to production' },
              { value: '100%', label: 'AI-assisted code' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold text-trello-navy">{s.value}</div>
                <div className="text-xs text-trello-gray-dark mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section id="products" className="bg-trello-gray-light py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <span className="text-xs font-bold text-trello-blue uppercase tracking-wider bg-trello-blue-pale px-3 py-1 rounded-trello-pill">
              Products
            </span>
            <h2 className="text-2xl font-semibold text-trello-navy mt-3 mb-2">
              Everything built here is real and in use
            </h2>
            <p className="text-sm text-trello-secondary">
              Each product solves a specific problem. New ones get added as ideas are validated.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRODUCTS.map((p) => (
              <ProductCard key={p.name} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="bg-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-trello-blue uppercase tracking-wider bg-trello-blue-pale px-3 py-1 rounded-trello-pill">
              Process
            </span>
            <h2 className="text-2xl font-semibold text-trello-navy mt-3 mb-2">
              From idea to production in weeks
            </h2>
            <p className="text-sm text-trello-secondary">
              Every product follows the same structured workflow with Claude as the engineering partner.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <HowStep
              num="1"
              title="Describe the idea"
              desc="Fill in a 5-minute intake survey. Claude generates a business case, product spec, and user stories automatically."
            />
            <HowStep
              num="2"
              title="Claude builds it"
              desc="Working through a structured workflow: plan → build → test → review. Each phase has a gate. Nothing ships until it passes."
            />
            <HowStep
              num="3"
              title="Ship to production"
              desc="Deploy to dev first, smoke test, then promote to production. Staged rollout with health checks at every step."
            />
          </div>
        </div>
      </section>

      {/* ── SURVEY CTA ── */}
      <section id="survey" className="bg-trello-navy py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-trello-blue-light uppercase tracking-wider mb-4">
              <span>⬡</span> Build with Claude
            </div>
            <h2 className="text-3xl font-semibold text-white leading-tight mb-3">
              Have a product idea?<br />Let's turn it into a spec.
            </h2>
            <p className="text-sm text-white/60 leading-relaxed mb-6">
              Answer a short survey about your idea. Claude will generate a business case, product requirements, and a build plan — ready to execute. No technical knowledge needed.
            </p>

            <div className="space-y-3 mb-8">
              {[
                { n: '1', text: <><strong className="text-white">Name your app</strong> and reference a similar product you have seen</> },
                { n: '2', text: <><strong className="text-white">Answer 8-15 questions</strong> in plain language — no tech knowledge needed</> },
                { n: '3', text: <><strong className="text-white">Copy the brief</strong> into Claude Code and start building immediately</> },
              ].map((s) => (
                <div key={s.n} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full border border-white/20 bg-white/10 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {s.n}
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3 flex-wrap">
              <a
                href="/survey.html"
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary text-sm"
              >
                Start the survey →
              </a>
              <a
                href="#how-it-works"
                className="btn text-sm text-white/70 border-white/20 hover:bg-white/10"
                style={{ borderColor: 'rgba(255,255,255,0.2)' }}
              >
                Read the guide
              </a>
            </div>
          </div>

          {/* Right: survey preview card */}
          <div className="bg-white rounded-trello p-6" style={{ boxShadow: 'rgba(9,30,66,0.4) 0px 16px 40px 0px' }}>
            {/* Progress dots */}
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full ${i < 2 ? 'bg-trello-blue' : i === 2 ? 'bg-trello-blue-light' : 'bg-trello-gray-border'}`}
                />
              ))}
            </div>

            <div className="text-xs font-bold text-trello-blue uppercase tracking-wider mb-2">
              Calibration — adjusts survey length
            </div>
            <div className="text-base font-semibold text-trello-navy mb-1">
              How much detail can you share right now?
            </div>
            <div className="text-xs text-trello-gray-dark mb-4">
              Your answer shapes the length of this survey.
            </div>

            <div className="space-y-2 mb-5">
              {['Just a rough idea', 'I have thought about it', 'I have detailed requirements', 'Other — I\'ll describe it myself'].map((opt, i) => (
                <div
                  key={opt}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-trello border text-sm cursor-pointer transition-all ${
                    i === 1
                      ? 'border-trello-blue bg-trello-blue-pale text-trello-navy font-medium'
                      : 'border-trello-gray-border text-trello-navy-2 hover:border-trello-blue-light hover:bg-trello-gray-light'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                    i === 1 ? 'border-trello-blue bg-trello-blue' : 'border-trello-gray-border'
                  }`}>
                    {i === 1 && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  {opt}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-trello-gray-dark">Question 2 of 14</span>
              <a href="/survey.html" target="_blank" rel="noreferrer" className="btn btn-primary text-xs py-1.5 px-3 min-h-0">
                Try it →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-trello-navy pt-12 pb-8 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-between gap-8 pb-8 mb-8 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 text-white font-bold mb-2">
                <div className="w-6 h-6 bg-trello-blue rounded flex items-center justify-center text-xs">P</div>
                Productcon Lab
              </div>
              <p className="text-xs text-white/40 max-w-[200px] leading-relaxed">
                Products built with Claude AI — from idea to production.
              </p>
            </div>

            <div className="flex gap-12 flex-wrap">
              {[
                { title: 'Products', links: ['TaskFlow', 'BudgetFlow', 'HireFlow'] },
                { title: 'Build', links: ['Product intake survey', 'How it works', 'Development guide'] },
                { title: 'Account', links: ['Sign in', 'Create account'] },
              ].map((group) => (
                <div key={group.title}>
                  <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">{group.title}</h4>
                  {group.links.map((l) => (
                    <a key={l} href="#" className="block text-sm text-white/60 hover:text-white mb-2 transition-colors">
                      {l}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-between items-center gap-4 text-xs text-white/30">
            <span>© 2025 Productcon Lab. All rights reserved.</span>
            <div className="flex items-center gap-2">
              <span>Built with</span>
              <span className="bg-white/10 text-white/50 px-2 py-0.5 rounded text-xs font-medium">Claude Code</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
