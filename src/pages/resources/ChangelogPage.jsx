import LandingNav from '../../components/layout/LandingNav';

const RELEASES = [
  {
    version: 'v1.3.0',
    date: 'Apr 2025',
    tag: 'Feature',
    tagColor: 'bg-green-50 text-green-700',
    changes: [
      'Card detail modal: checklist section with progress bar',
      'File attachment support (images, PDFs, up to 10MB)',
      '@mention support in card comments with live notifications',
      'Invite members by email from the board header',
    ],
  },
  {
    version: 'v1.2.0',
    date: 'Mar 2025',
    tag: 'Feature',
    tagColor: 'bg-green-50 text-green-700',
    changes: [
      'Real-time board updates via WebSocket',
      'Notification center with unread badge',
      'Card label picker with custom colors',
      'Drag-and-drop card reordering across lists',
    ],
  },
  {
    version: 'v1.1.0',
    date: 'Feb 2025',
    tag: 'Improvement',
    tagColor: 'bg-blue-50 text-blue-700',
    changes: [
      'Password reset flow with email verification',
      'Profile page with avatar upload',
      'Workspace settings: rename, description, delete',
      'Improved mobile layout for boards',
    ],
  },
  {
    version: 'v1.0.0',
    date: 'Jan 2025',
    tag: 'Launch',
    tagColor: 'bg-trello-blue-pale text-trello-blue',
    changes: [
      'Initial production launch',
      'Workspaces, boards, lists, and cards',
      'JWT RS256 authentication with refresh tokens',
      'Email verification on signup',
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNav />

      <section className="bg-gradient-to-b from-trello-blue-pale via-white to-white pt-20 pb-12 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-trello-blue bg-trello-blue-pale px-3 py-1.5 rounded-trello-pill mb-6">
            Changelog
          </span>
          <h1 className="text-4xl font-semibold text-trello-navy mb-4">What shipped and when</h1>
          <p className="text-lg text-trello-secondary">
            Every release, every change. No marketing spin.
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto space-y-10">
          {RELEASES.map((release) => (
            <div key={release.version} className="flex gap-6">
              <div className="flex-shrink-0 w-20 text-right">
                <div className="text-xs font-bold text-trello-navy">{release.version}</div>
                <div className="text-xs text-trello-gray-dark">{release.date}</div>
              </div>
              <div className="flex-1 border-l border-trello-gray-border pl-6">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-trello-pill mb-3 inline-block ${release.tagColor}`}>
                  {release.tag}
                </span>
                <ul className="space-y-2">
                  {release.changes.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-sm text-trello-secondary">
                      <span className="text-trello-blue mt-1 flex-shrink-0">+</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
