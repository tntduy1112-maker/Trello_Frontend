import { useState } from 'react';
import { Settings, Save, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const DEFAULT_NAV = {
  solutions: [
    { name: 'For Teams', href: '/solutions/teams', desc: 'Collaborate across projects and boards' },
    { name: 'For Startups', href: '/solutions/startups', desc: 'Move fast from idea to shipped product' },
    { name: 'For Builders', href: '/solutions/builders', desc: 'AI-assisted engineering workflows' },
  ],
  resources: [
    { name: 'Blog', href: '/resources/blog', desc: 'Product updates and engineering stories' },
    { name: 'Changelog', href: '/resources/changelog', desc: 'What shipped and when' },
    { name: 'How it works', href: '#how-it-works', desc: 'The full build workflow explained' },
  ],
};

function SectionEditor({ title, items, onChange }) {
  const [open, setOpen] = useState(true);

  const update = (i, field, val) => {
    const next = items.map((item, idx) => idx === i ? { ...item, [field]: val } : item);
    onChange(next);
  };

  const add = () => onChange([...items, { name: '', href: '', desc: '' }]);

  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="bg-white border border-trello-gray-border rounded-trello shadow-trello-card overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-trello-gray-light transition-colors"
      >
        <span className="text-sm font-semibold text-trello-navy">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-trello-gray-medium" /> : <ChevronDown className="w-4 h-4 text-trello-gray-medium" />}
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-trello-gray-border">
          <div className="space-y-4 mt-4">
            {items.map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <input
                    value={item.name}
                    onChange={(e) => update(i, 'name', e.target.value)}
                    placeholder="Label"
                    className="border border-trello-gray-border rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-trello-blue"
                  />
                  <input
                    value={item.href}
                    onChange={(e) => update(i, 'href', e.target.value)}
                    placeholder="URL or #anchor"
                    className="border border-trello-gray-border rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-trello-blue"
                  />
                  <input
                    value={item.desc}
                    onChange={(e) => update(i, 'desc', e.target.value)}
                    placeholder="Description"
                    className="border border-trello-gray-border rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-trello-blue"
                  />
                </div>
                <button
                  onClick={() => remove(i)}
                  className="text-red-400 hover:text-red-600 transition-colors p-1.5 mt-0.5"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={add}
            className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-trello-blue hover:text-trello-blue-dark transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add item
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdminSettingsPage() {
  const [nav, setNav] = useState(DEFAULT_NAV);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In production: POST /api/v1/admin/settings/nav
    // For now, just show feedback
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <div className="bg-white border-b border-trello-gray-border px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-trello-navy">Site Settings</h1>
          <p className="text-sm text-trello-secondary mt-0.5">Manage navigation and landing page content.</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-trello text-sm font-semibold transition-colors ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-trello-blue text-white hover:bg-trello-blue-dark'
          }`}
          style={{ background: saved ? undefined : '#0C66E4' }}
        >
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save changes'}
        </button>
      </div>

      <div className="p-8 space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="w-4 h-4 text-trello-gray-medium" />
          <span className="text-xs font-bold text-trello-gray-medium uppercase tracking-wider">Navigation menus</span>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-trello p-4 text-xs text-orange-700">
          <strong className="text-orange-800">Note:</strong> Changes here update the in-memory nav config. To persist across deploys, wire POST /api/v1/admin/settings on the backend and store in the database or a config file.
        </div>

        <SectionEditor
          title="Solutions menu"
          items={nav.solutions}
          onChange={(items) => setNav((v) => ({ ...v, solutions: items }))}
        />

        <SectionEditor
          title="Resources menu"
          items={nav.resources}
          onChange={(items) => setNav((v) => ({ ...v, resources: items }))}
        />

        <div className="bg-trello-gray-light border border-trello-gray-border rounded-trello p-4">
          <div className="text-xs font-bold text-trello-gray-medium uppercase tracking-wider mb-2">Config preview (JSON)</div>
          <pre className="text-xs text-trello-navy overflow-auto max-h-48 leading-relaxed">
            {JSON.stringify(nav, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
