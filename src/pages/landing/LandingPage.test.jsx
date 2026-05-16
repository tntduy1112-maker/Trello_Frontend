import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders } from '../../test/renderWithProviders';
import LandingPage from './LandingPage';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('LandingPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders hero heading', () => {
    renderWithProviders(<LandingPage />);
    expect(screen.getByText(/Products built fast/i)).toBeInTheDocument();
  });

  it('renders all three product cards', () => {
    renderWithProviders(<LandingPage />);
    expect(screen.getAllByText('TaskFlow').length).toBeGreaterThan(0);
    expect(screen.getAllByText('BudgetFlow').length).toBeGreaterThan(0);
    expect(screen.getAllByText('HireFlow').length).toBeGreaterThan(0);
  });

  it('shows Live badge on TaskFlow card', () => {
    renderWithProviders(<LandingPage />);
    expect(screen.getByText('● Live')).toBeInTheDocument();
  });

  it('shows In progress badge on BudgetFlow card', () => {
    renderWithProviders(<LandingPage />);
    expect(screen.getByText('⏳ In progress')).toBeInTheDocument();
  });

  it('shows Planned badge on HireFlow card', () => {
    renderWithProviders(<LandingPage />);
    expect(screen.getByText('💡 Planned')).toBeInTheDocument();
  });

  it('navigates to /login when unauthenticated user clicks Open app on TaskFlow', () => {
    renderWithProviders(<LandingPage />, {
      preloadedState: { auth: { isAuthenticated: false, user: null } },
    });
    fireEvent.click(screen.getByRole('button', { name: /Open app/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('navigates to /app/home when authenticated user clicks Open app on TaskFlow', () => {
    renderWithProviders(<LandingPage />, {
      preloadedState: {
        auth: { isAuthenticated: true, user: { full_name: 'Test User', email: 'test@example.com' } },
      },
    });
    fireEvent.click(screen.getByRole('button', { name: /Open app/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/app/home');
  });

  it('renders survey CTA section', () => {
    renderWithProviders(<LandingPage />);
    expect(screen.getByText(/Have a product idea/i)).toBeInTheDocument();
  });

  it('renders How it works section', () => {
    renderWithProviders(<LandingPage />);
    expect(screen.getByText(/From idea to production in weeks/i)).toBeInTheDocument();
  });

  it('renders footer with brand name', () => {
    renderWithProviders(<LandingPage />);
    expect(screen.getAllByText(/Productcon Lab/i).length).toBeGreaterThan(0);
  });

  it('BudgetFlow and HireFlow buttons are disabled', () => {
    renderWithProviders(<LandingPage />);
    const disabledButtons = screen.getAllByRole('button', { name: /In progress|Coming soon/i });
    disabledButtons.forEach((btn) => expect(btn).toBeDisabled());
  });
});
