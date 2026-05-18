import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Kanban, ChevronDown } from 'lucide-react';

const PRODUCTS = [
  {
    value: 'taskflow',
    icon: '🗂️',
    name: 'TaskFlow',
    desc: 'Kanban boards & team collaboration',
    status: 'live',
    href: '/app/home',
  },
  {
    value: 'diaryflow',
    icon: '📖',
    name: 'DiaryFlow',
    desc: 'Personal digital journal with AI',
    status: 'soon',
    href: null,
  },
  {
    value: 'budgetflow',
    icon: '📊',
    name: 'BudgetFlow',
    desc: 'Team expense tracking',
    status: 'soon',
    href: null,
  },
];

export default function LandingNav() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [productsOpen, setProductsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProductsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProductClick = (product) => {
    setProductsOpen(false);
    if (!product.href) return;
    if (product.value === 'taskflow' && !isAuthenticated) {
      navigate('/login');
    } else {
      navigate(product.href);
    }
  };

  const avatarInitial = user?.full_name?.charAt(0).toUpperCase() || '?';

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-trello-gray-border h-navbar flex items-center px-6 md:px-8 gap-0">
      {/* Brand */}
      <Link to="/" className="flex items-center gap-2 text-trello-navy font-bold text-base mr-8 flex-shrink-0">
        <div className="w-7 h-7 bg-trello-blue rounded flex items-center justify-center">
          <Kanban className="w-4 h-4 text-white" />
        </div>
        Productcon Lab
      </Link>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-1 flex-1">
        {/* Products dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProductsOpen((v) => !v)}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-trello-navy-2 hover:bg-trello-gray-light rounded-trello transition-colors"
          >
            Products
            <ChevronDown
              className={`w-3.5 h-3.5 text-trello-gray-neutral transition-transform duration-150 ${productsOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {productsOpen && (
            <div
              className="absolute top-[calc(100%+6px)] left-0 w-64 bg-white border border-trello-gray-border rounded-trello py-1.5 z-50"
              style={{ boxShadow: 'rgba(9,30,66,0.25) 0px 4px 8px 0px' }}
            >
              <p className="px-3 pt-1 pb-1.5 text-xs font-bold text-trello-gray-medium uppercase tracking-wider">
                Live
              </p>
              {PRODUCTS.filter((p) => p.status === 'live').map((p) => (
                <button
                  key={p.value}
                  onClick={() => handleProductClick(p)}
                  className="flex items-center gap-3 w-full px-3 py-2 hover:bg-trello-gray-light transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded bg-trello-blue-pale flex items-center justify-center text-base flex-shrink-0">
                    {p.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-trello-navy">{p.name}</div>
                    <div className="text-xs text-trello-gray-dark truncate">{p.desc}</div>
                  </div>
                  <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-trello-pill flex-shrink-0">
                    Live
                  </span>
                </button>
              ))}

              <div className="my-1 border-t border-trello-gray-border" />

              <p className="px-3 pt-1 pb-1.5 text-xs font-bold text-trello-gray-medium uppercase tracking-wider">
                Coming soon
              </p>
              {PRODUCTS.filter((p) => p.status === 'soon').map((p) => (
                <div
                  key={p.value}
                  className="flex items-center gap-3 w-full px-3 py-2 opacity-60 cursor-default"
                >
                  <div className="w-8 h-8 rounded bg-trello-gray-light flex items-center justify-center text-base flex-shrink-0">
                    {p.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-trello-navy">{p.name}</div>
                    <div className="text-xs text-trello-gray-dark truncate">{p.desc}</div>
                  </div>
                  <span className="text-xs font-semibold text-trello-gray-dark bg-trello-gray-light px-2 py-0.5 rounded-trello-pill flex-shrink-0">
                    Soon
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <a href="#how-it-works" className="px-3 py-2 text-sm font-medium text-trello-navy-2 hover:bg-trello-gray-light rounded-trello transition-colors">
          How it works
        </a>
        <a href="#survey" className="px-3 py-2 text-sm font-medium text-trello-navy-2 hover:bg-trello-gray-light rounded-trello transition-colors">
          Build with Claude
        </a>
      </div>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-2">
        {isAuthenticated ? (
          <Link
            to="/app/home"
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-trello-blue hover:bg-trello-blue-pale rounded-trello transition-colors"
          >
            <div className="w-7 h-7 rounded-trello-pill bg-trello-blue flex items-center justify-center text-white text-xs font-bold">
              {avatarInitial}
            </div>
            <span className="hidden sm:inline">Go to app</span>
          </Link>
        ) : (
          <a
            href="#survey"
            className="btn btn-primary text-sm py-2 px-4 min-h-0"
          >
            Start building →
          </a>
        )}
      </div>
    </nav>
  );
}
