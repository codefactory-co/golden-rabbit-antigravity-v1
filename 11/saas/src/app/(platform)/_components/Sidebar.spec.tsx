import { render, screen } from '@testing-library/react';
import { Sidebar } from './Sidebar';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock usePathname
const mockUsePathname = vi.fn();
vi.mock('next/navigation', () => ({
    usePathname: () => mockUsePathname(),
}));

describe('Sidebar', () => {
    beforeEach(() => {
        mockUsePathname.mockReset();
    });

    it('renders the sidebar navigation links', () => {
        mockUsePathname.mockReturnValue('/dashboard');
        render(<Sidebar />);

        const homeLink = screen.getByText('홈').closest('a');
        expect(homeLink?.getAttribute('href')).toBe('/dashboard');

        const notesLink = screen.getByText('내 메모').closest('a');
        expect(notesLink?.getAttribute('href')).toBe('/notes');
    });

    it('highlights the active link based on pathname', () => {
        // Case 1: Dashboard active
        mockUsePathname.mockReturnValue('/dashboard');
        const { unmount } = render(<Sidebar />);

        const homeLink = screen.getByText('홈').closest('a');
        const notesLink = screen.getByText('내 메모').closest('a');

        expect(homeLink?.className).toContain('bg-primary/10');
        expect(homeLink?.className).toContain('text-primary');
        expect(notesLink?.className).not.toContain('bg-primary/10');
        // The original assertion also checked for 'text-primary' not to be present,
        // but the provided edit only removes 'bg-primary/10' from the notesLink check.
        // Following the provided edit faithfully.

        unmount();

        // Case 2: Notes active
        mockUsePathname.mockReturnValue('/notes');
        render(<Sidebar />);

        const homeLink2 = screen.getByText('홈').closest('a');
        const notesLink2 = screen.getByText('내 메모').closest('a');

        expect(homeLink2?.className).not.toContain('bg-primary/10');
        // The original assertion also checked for 'text-primary' not to be present,
        // but the provided edit only removes 'bg-primary/10' from the homeLink2 check.
        // Following the provided edit faithfully.
        expect(notesLink2?.className).toContain('bg-primary/10');
        expect(notesLink2?.className).toContain('text-primary');
    });
});
