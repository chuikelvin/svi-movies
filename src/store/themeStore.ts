import { create } from 'zustand';

interface ThemeState {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    setTheme: (theme: 'light' | 'dark') => void;
}

const getInitialTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('theme');
        if (stored === 'light' || stored === 'dark') return stored;
        // Default to system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
};

export const useThemeStore = create<ThemeState>((set, get) => ({
    theme: typeof window !== 'undefined' ? getInitialTheme() : 'light',
    toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: newTheme });
        if (typeof window !== 'undefined') {
            localStorage.setItem('theme', newTheme);
            document.documentElement.classList.toggle('dark', newTheme === 'dark');
        }
    },
    setTheme: (theme) => {
        set({ theme });
        if (typeof window !== 'undefined') {
            localStorage.setItem('theme', theme);
            document.documentElement.classList.toggle('dark', theme === 'dark');
        }
    },
}));

// Apply theme on load (for SSR/CSR consistency)
if (typeof window !== 'undefined') {
    const theme = getInitialTheme();
    document.documentElement.classList.toggle('dark', theme === 'dark');
} 