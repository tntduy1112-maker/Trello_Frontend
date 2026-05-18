import LandingNav from '../../components/layout/LandingNav';

const POSTS = [
  {
    date: 'Apr 2025',
    tag: 'Engineering',
    title: 'How we built TaskFlow in 6 weeks with Claude',
    excerpt: 'A walkthrough of the full development workflow: from business case to production deploy, using Claude Code at every step.',
    readTime: '8 min read',
  },
  {
    date: 'Mar 2025',
    tag: 'Product',
    title: 'Why we write a business case before writing any code',
    excerpt: 'The Five Case Model forces you to answer "why" before "how". It has saved us from building the wrong thing more than once.',
    readTime: '5 min read',
  },
  {
    date: 'Feb 2025',
    tag: 'Engineering',
    title: 'sqlc vs GORM: why we chose compile-time SQL generation',
    excerpt: 'GORM is magic. sqlc is transparent. For a system where correctness matters, we chose transparency.',
    readTime: '6 min read',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNav />

      <section className="bg-gradient-to-b from-trello-blue-pale via-white to-white pt-20 pb-12 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-trello-blue bg-trello-blue-pale px-3 py-1.5 rounded-trello-pill mb-6">
            Blog
          </span>
          <h1 className="text-4xl font-semibold text-trello-navy mb-4">
            Product updates & engineering stories
          </h1>
          <p className="text-lg text-trello-secondary">
            How we build, what we learned, and what ships next.
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {POSTS.map((post) => (
            <article
              key={post.title}
              className="bg-white border border-trello-gray-border rounded-trello p-6 shadow-trello-card hover:shadow-trello-card-hover transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold text-trello-blue bg-trello-blue-pale px-2.5 py-0.5 rounded-trello-pill">
                  {post.tag}
                </span>
                <span className="text-xs text-trello-gray-dark">{post.date}</span>
                <span className="text-xs text-trello-gray-dark ml-auto">{post.readTime}</span>
              </div>
              <h2 className="text-lg font-semibold text-trello-navy mb-2 hover:text-trello-blue transition-colors">
                {post.title}
              </h2>
              <p className="text-sm text-trello-secondary leading-relaxed">{post.excerpt}</p>
              <div className="mt-4">
                <span className="text-sm font-semibold text-trello-blue hover:underline">
                  Read more →
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
