import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ThemeToggle from "../../components/ThemeToggle"; // adjust path as needed
import React from "react";

// Types for Framer Motion mock
type MotionButtonProps = {
  children?: React.ReactNode;
  whileHover?: Record<string, unknown>;
  whileTap?: Record<string, unknown>;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

type MotionDivProps = {
  children?: React.ReactNode;
  initial?: Record<string, unknown>;
  animate?: Record<string, unknown>;
  transition?: Record<string, unknown>;
} & React.HTMLAttributes<HTMLDivElement>;

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    button: ({
      children,
      whileHover,
      whileTap,
      ...props
    }: MotionButtonProps) => <button {...props}>{children}</button>,
    div: ({
      children,
      initial,
      animate,
      transition,
      ...props
    }: MotionDivProps) => <div {...props}>{children}</div>,
  },
}));

// Mock react-icons
jest.mock("react-icons/fi", () => ({
  FiSun: () => <span data-testid="sun-icon">☀️</span>,
  FiMoon: () => <span data-testid="moon-icon">🌙</span>,
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock window.matchMedia
const matchMediaMock = {
  matches: false,
  addListener: jest.fn(),
  removeListener: jest.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => matchMediaMock),
});

// Mock document.documentElement.setAttribute
const setAttributeMock = jest.fn();
Object.defineProperty(document.documentElement, "setAttribute", {
  value: setAttributeMock,
});

describe("ThemeToggle", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    matchMediaMock.matches = false;
  });

  it("renders with sun icon by default (light theme)", async () => {
    localStorageMock.getItem.mockReturnValue(null);
    matchMediaMock.matches = false;

    render(<ThemeToggle />);

    // The component starts with light theme, then useEffect may update it
    // Wait for the component to stabilize
    await waitFor(
      () => {
        expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      "Switch to dark theme"
    );
  });

  it("initializes with system preference (dark)", async () => {
    localStorageMock.getItem.mockReturnValue(null);
    matchMediaMock.matches = true;

    render(<ThemeToggle />);

    await waitFor(
      () => {
        expect(screen.getByTestId("moon-icon")).toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    expect(setAttributeMock).toHaveBeenCalledWith("data-theme", "dark");
  });

  it("initializes with saved theme from localStorage", async () => {
    localStorageMock.getItem.mockReturnValue("dark");
    matchMediaMock.matches = false;

    render(<ThemeToggle />);

    await waitFor(
      () => {
        expect(screen.getByTestId("moon-icon")).toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    expect(setAttributeMock).toHaveBeenCalledWith("data-theme", "dark");
  });

  it("prioritizes saved theme over system preference", async () => {
    localStorageMock.getItem.mockReturnValue("light");
    matchMediaMock.matches = true; // system prefers dark

    render(<ThemeToggle />);

    await waitFor(
      () => {
        expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    expect(setAttributeMock).toHaveBeenCalledWith("data-theme", "light");
  });

  it("toggles from light to dark theme when clicked", async () => {
    localStorageMock.getItem.mockReturnValue(null);
    matchMediaMock.matches = false;

    render(<ThemeToggle />);

    // Wait for initial render to complete
    await waitFor(
      () => {
        expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId("moon-icon")).toBeInTheDocument();
    });

    expect(setAttributeMock).toHaveBeenCalledWith("data-theme", "dark");
    expect(localStorageMock.setItem).toHaveBeenCalledWith("theme", "dark");
    expect(button).toHaveAttribute("aria-label", "Switch to light theme");
  });

  it("toggles from dark to light theme when clicked", async () => {
    localStorageMock.getItem.mockReturnValue("dark");
    matchMediaMock.matches = false;

    render(<ThemeToggle />);

    // Wait for initial render to complete
    await waitFor(
      () => {
        expect(screen.getByTestId("moon-icon")).toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
    });

    expect(setAttributeMock).toHaveBeenCalledWith("data-theme", "light");
    expect(localStorageMock.setItem).toHaveBeenCalledWith("theme", "light");
    expect(button).toHaveAttribute("aria-label", "Switch to dark theme");
  });

  it("applies correct CSS classes", () => {
    render(<ThemeToggle />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "w-10",
      "h-10",
      "rounded-full",
      "bg-[var(--color-background-secondary)]",
      "flex",
      "items-center",
      "justify-center",
      "text-[var(--color-text-primary)]",
      "hover:bg-[var(--color-background-tertiary)]",
      "transition-colors"
    );
  });

  it("calls localStorage.getItem on mount", () => {
    render(<ThemeToggle />);
    expect(localStorageMock.getItem).toHaveBeenCalledWith("theme");
  });

  it("calls window.matchMedia for system preference", () => {
    render(<ThemeToggle />);
    expect(window.matchMedia).toHaveBeenCalledWith(
      "(prefers-color-scheme: dark)"
    );
  });

  it("handles multiple theme toggles correctly", async () => {
    localStorageMock.getItem.mockReturnValue(null);
    matchMediaMock.matches = false;

    render(<ThemeToggle />);

    const button = screen.getByRole("button");

    // Initial state (light) - wait for useEffect to complete
    await waitFor(
      () => {
        expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    // First toggle (light -> dark)
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByTestId("moon-icon")).toBeInTheDocument();
    });

    // Second toggle (dark -> light)
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
    });

    // Third toggle (light -> dark)
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByTestId("moon-icon")).toBeInTheDocument();
    });

    expect(localStorageMock.setItem).toHaveBeenCalledTimes(3);
    expect(localStorageMock.setItem).toHaveBeenNthCalledWith(
      1,
      "theme",
      "dark"
    );
    expect(localStorageMock.setItem).toHaveBeenNthCalledWith(
      2,
      "theme",
      "light"
    );
    expect(localStorageMock.setItem).toHaveBeenNthCalledWith(
      3,
      "theme",
      "dark"
    );
  });
});
