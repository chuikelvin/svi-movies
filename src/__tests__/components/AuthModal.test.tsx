import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AuthModal from "@/components/AuthModal";
import { useAuthStore } from "@/store/authStore";

// Mock the auth store
jest.mock("@/store/authStore", () => ({
  useAuthStore: jest.fn(),
}));

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    p: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("AuthModal", () => {
  const mockOnClose = jest.fn();
  const mockLoginWithEmail = jest.fn();
  const mockLoginWithGoogle = jest.fn();
  const mockRegisterWithEmail = jest.fn();
  const mockResetAuthState = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthStore as unknown as jest.Mock).mockImplementation(() => ({
      loginWithEmail: mockLoginWithEmail,
      loginWithGoogle: mockLoginWithGoogle,
      registerWithEmail: mockRegisterWithEmail,
      resetAuthState: mockResetAuthState,
      loading: false,
      error: null,
      adminMessage: null,
    }));
  });

  it("renders login form by default", () => {
    render(<AuthModal open={true} onClose={mockOnClose} />);

    expect(
      screen.getByRole("button", { name: "Switch to login form" })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your password")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Submit login" })
    ).toBeInTheDocument();
  });

  it("switches to register form", () => {
    render(<AuthModal open={true} onClose={mockOnClose} />);

    // Click the register tab button
    fireEvent.click(
      screen.getByRole("button", { name: "Switch to register form" })
    );

    // Verify the register form is shown
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your password")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Confirm your password")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Submit registration" })
    ).toBeInTheDocument();
  });

  it("handles email login submission", async () => {
    render(<AuthModal open={true} onClose={mockOnClose} />);

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "password123" },
    });
    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(mockLoginWithEmail).toHaveBeenCalledWith(
        "test@example.com",
        "password123"
      );
    });
  });

  it("handles registration submission", async () => {
    render(<AuthModal open={true} onClose={mockOnClose} />);

    // Switch to register form
    fireEvent.click(
      screen.getByRole("button", { name: "Switch to register form" })
    );

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "new@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm your password"), {
      target: { value: "password123" },
    });
    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(mockRegisterWithEmail).toHaveBeenCalledWith(
        "new@example.com",
        "password123"
      );
    });
  });

  it("handles Google login", () => {
    render(<AuthModal open={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByText("Continue with Google"));

    expect(mockLoginWithGoogle).toHaveBeenCalled();
  });

  it("validates email format", async () => {
    render(<AuthModal open={true} onClose={mockOnClose} />);

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "invalid-email" },
    });
    fireEvent.submit(screen.getByRole("form"));

    expect(await screen.findByText("Invalid email format")).toBeInTheDocument();
    expect(mockLoginWithEmail).not.toHaveBeenCalled();
  });

  it("validates password length", async () => {
    render(<AuthModal open={true} onClose={mockOnClose} />);

    // Switch to register form
    fireEvent.click(
      screen.getByRole("button", { name: "Switch to register form" })
    );

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "123" },
    });
    fireEvent.submit(screen.getByRole("form"));

    expect(
      await screen.findByText("Password must be at least 6 characters")
    ).toBeInTheDocument();
    expect(mockRegisterWithEmail).not.toHaveBeenCalled();
  });

  it("validates password confirmation", async () => {
    render(<AuthModal open={true} onClose={mockOnClose} />);

    // Switch to register form
    fireEvent.click(
      screen.getByRole("button", { name: "Switch to register form" })
    );

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm your password"), {
      target: { value: "different123" },
    });
    fireEvent.submit(screen.getByRole("form"));

    expect(
      await screen.findByText("Passwords do not match")
    ).toBeInTheDocument();
    expect(mockRegisterWithEmail).not.toHaveBeenCalled();
  });

  it("displays error messages from auth store", () => {
    const errorMessage = "Authentication failed";
    (useAuthStore as unknown as jest.Mock).mockImplementation(() => ({
      loginWithEmail: mockLoginWithEmail,
      loginWithGoogle: mockLoginWithGoogle,
      registerWithEmail: mockRegisterWithEmail,
      resetAuthState: mockResetAuthState,
      loading: false,
      error: errorMessage,
      adminMessage: null,
    }));

    render(<AuthModal open={true} onClose={mockOnClose} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("displays admin message when admin logs in", () => {
    const adminMessage = "Welcome, admin!";
    (useAuthStore as unknown as jest.Mock).mockImplementation(() => ({
      loginWithEmail: mockLoginWithEmail,
      loginWithGoogle: mockLoginWithGoogle,
      registerWithEmail: mockRegisterWithEmail,
      resetAuthState: mockResetAuthState,
      loading: false,
      error: null,
      adminMessage,
    }));

    render(<AuthModal open={true} onClose={mockOnClose} />);

    expect(screen.getByText(adminMessage)).toBeInTheDocument();
  });

  it("resets state when modal is closed", () => {
    render(<AuthModal open={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByRole("button", { name: /close/i }));

    expect(mockOnClose).toHaveBeenCalled();
    expect(mockResetAuthState).toHaveBeenCalled();
  });
});
