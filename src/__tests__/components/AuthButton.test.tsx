import { render, screen, fireEvent, act } from "@testing-library/react";
import AuthButton from "@/components/AuthButton";
import { useAuthStore } from "@/store/authStore";

// Mock auth store
jest.mock("@/store/authStore", () => ({
  useAuthStore: jest.fn(),
}));

// Mock AuthModal to avoid rendering the actual modal
jest.mock("@/components/AuthModal", () => {
  const MockAuthModal = ({
    open,
    onClose,
  }: {
    open: boolean;
    onClose: () => void;
  }) => (open ? <div data-testid="auth-modal">Auth Modal</div> : null);
  MockAuthModal.displayName = "MockAuthModal";
  return MockAuthModal;
});

const mockLogout = jest.fn();

describe("AuthButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when user is not logged in", () => {
    beforeEach(() => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        user: null,
        logout: mockLogout,
      });
    });

    it("renders login button for desktop", () => {
      render(<AuthButton />);
      expect(screen.getByText(/login/i)).toBeInTheDocument();
    });

    it("renders login button for mobile", () => {
      render(<AuthButton variant="mobile" />);
      expect(screen.getByText(/login/i)).toBeInTheDocument();
    });

    it("opens auth modal when login clicked (desktop)", async () => {
      render(<AuthButton />);
      await act(async () => {
        fireEvent.click(screen.getByText(/login/i));
      });
      expect(screen.getByTestId("auth-modal")).toBeInTheDocument();
    });

    it("opens auth modal when login clicked (mobile)", async () => {
      const onLoginClick = jest.fn();
      render(<AuthButton variant="mobile" onLoginClick={onLoginClick} />);
      await act(async () => {
        fireEvent.click(screen.getByText(/login/i));
      });
      expect(onLoginClick).toHaveBeenCalled();
      expect(screen.getByTestId("auth-modal")).toBeInTheDocument();
    });
  });

  describe("when user is logged in", () => {
    const user = { email: "user@example.com" };

    beforeEach(() => {
      (useAuthStore as unknown as jest.Mock).mockReturnValue({
        user,
        logout: mockLogout,
      });
    });

    it("renders user email and logout button on mobile", () => {
      render(<AuthButton variant="mobile" />);
      expect(screen.getByText(user.email)).toBeInTheDocument();
      expect(screen.getByText(/logout/i)).toBeInTheDocument();
    });

    it("toggles user menu on desktop and logs out", async () => {
      render(<AuthButton />);
      const userButton = screen.getByText(user.email);

      await act(async () => {
        fireEvent.click(userButton); // open menu
      });
      expect(screen.getByText(/logout/i)).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(screen.getByText(/logout/i));
      });
      expect(mockLogout).toHaveBeenCalled();
    });
  });
});
