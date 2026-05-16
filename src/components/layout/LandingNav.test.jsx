import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../../test/renderWithProviders';
import LandingNav from './LandingNav';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('LandingNav', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders brand name Productcon Lab', () => {
    renderWithProviders(<LandingNav />);
    expect(screen.getByText('Productcon Lab')).toBeInTheDocument();
  });

  it('opens Products dropdown when clicked', () => {
    renderWithProviders(<LandingNav />);
    fireEvent.click(screen.getByRole('button', { name: /Products/i }));
    expect(screen.getByText('TaskFlow')).toBeInTheDocument();
    expect(screen.getByText('BudgetFlow')).toBeInTheDocument();
    expect(screen.getByText('HireFlow')).toBeInTheDocument();
  });

  it('shows TaskFlow as Live in dropdown', () => {
    renderWithProviders(<LandingNav />);
    fireEvent.click(screen.getByRole('button', { name: /Products/i }));
    const liveElements = screen.getAllByText('Live');
    expect(liveElements.length).toBeGreaterThan(0);
  });

  it('shows BudgetFlow and HireFlow as Coming Soon in dropdown', () => {
    renderWithProviders(<LandingNav />);
    fireEvent.click(screen.getByRole('button', { name: /Products/i }));
    const soonBadges = screen.getAllByText('Soon');
    expect(soonBadges).toHaveLength(2);
  });

  it('shows Sign in and Start building when unauthenticated', () => {
    renderWithProviders(<LandingNav />, {
      preloadedState: { auth: { isAuthenticated: false, user: null } },
    });
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByText(/Start building/i)).toBeInTheDocument();
  });

  it('shows Go to app when authenticated', () => {
    renderWithProviders(<LandingNav />, {
      preloadedState: {
        auth: { isAuthenticated: true, user: { full_name: 'Danny Tran', email: 'test@example.com' } },
      },
    });
    expect(screen.getByText('Go to app')).toBeInTheDocument();
  });

  it('shows correct avatar initial when authenticated', () => {
    renderWithProviders(<LandingNav />, {
      preloadedState: {
        auth: { isAuthenticated: true, user: { full_name: 'Danny Tran', email: 'test@example.com' } },
      },
    });
    expect(screen.getByText('D')).toBeInTheDocument();
  });

  it('navigates to /login when unauthenticated user clicks TaskFlow in dropdown', () => {
    renderWithProviders(<LandingNav />, {
      preloadedState: { auth: { isAuthenticated: false, user: null } },
    });
    fireEvent.click(screen.getByRole('button', { name: /Products/i }));
    fireEvent.click(screen.getByRole('button', { name: /TaskFlow/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('closes dropdown when clicking outside', () => {
    renderWithProviders(<LandingNav />);
    fireEvent.click(screen.getByRole('button', { name: /Products/i }));
    expect(screen.getByText('TaskFlow')).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText('TaskFlow')).not.toBeInTheDocument();
  });
});
