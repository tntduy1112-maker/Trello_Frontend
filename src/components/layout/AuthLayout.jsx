import { Link } from 'react-router-dom';
import { Kanban } from 'lucide-react';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-trello-gray-light flex flex-col">
      <header className="p-4 md:p-6">
        <Link to="/" className="flex items-center gap-2 text-trello-blue font-bold text-xl">
          <Kanban className="w-7 h-7" />
          <span>TaskFlow</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div
            className="bg-white rounded-trello border border-trello-gray-border p-8"
            style={{ boxShadow: 'rgba(9, 30, 66, 0.15) 0px 8px 16px 0px' }}
          >
            {children}
          </div>
        </div>
      </main>

      <footer className="p-4 text-center text-trello-gray-medium text-sm">
        <p>&copy; 2024 TaskFlow. All rights reserved.</p>
      </footer>
    </div>
  );
}
