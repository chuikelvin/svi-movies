import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MovieSearch from "@/components/MovieSearch";
import { useMovieStore } from "@/store/movieStore";
import { useRouter } from "next/navigation";

// Mock next/router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock Zustand store
jest.mock("@/store/movieStore", () => ({
  useMovieStore: jest.fn(),
}));

describe("MovieSearch", () => {
  const mockPush = jest.fn();
  const liveSearch = jest.fn();
  const clearSearchResults = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useMovieStore as unknown as jest.Mock).mockReturnValue({
      searchResults: [
        {
          id: 1,
          title: "Inception",
          release_date: "2010-07-16",
          poster_path: "/inception.jpg",
        },
      ],
      searchLoading: false,
      liveSearch,
      clearSearchResults,
    });

    jest.clearAllMocks();
  });

  it("renders input and handles typing", async () => {
    render(<MovieSearch />);

    const input = screen.getByPlaceholderText("Search for movies...");
    fireEvent.change(input, { target: { value: "inception" } });

    await waitFor(() => expect(liveSearch).toHaveBeenCalledWith("inception", "movie"));
  });

  it("displays search results and handles movie click", async () => {
    render(<MovieSearch />);

    const input = screen.getByPlaceholderText("Search for movies...");
    fireEvent.change(input, { target: { value: "inception" } });

    const result = await screen.findByText("Inception");
    expect(result).toBeInTheDocument();

    fireEvent.click(result);

    expect(mockPush).toHaveBeenCalledWith("/movie/1");
  });

  it("handles search form submit", () => {
    render(<MovieSearch />);

    const input = screen.getByPlaceholderText("Search for movies...");
    fireEvent.change(input, { target: { value: "avatar" } });

    const form = screen.getByTestId("search-form");
    fireEvent.submit(form);

    expect(mockPush).toHaveBeenCalledWith("/search?q=avatar&type=movie");
  });

  it("shows loading spinner when searchLoading is true", async () => {
    (useMovieStore as unknown as jest.Mock).mockReturnValue({
      searchResults: [],
      searchLoading: true,
      liveSearch,
      clearSearchResults,
    });

    render(<MovieSearch />);
    const input = screen.getByPlaceholderText("Search for movies...");
    fireEvent.change(input, { target: { value: "interstellar" } });

    // expect(screen.getByRole("status")).toBeInTheDocument();
    await expect(screen.findByRole("status")).resolves.toBeInTheDocument();
  });

  it("shows 'No movies found' if search returns nothing", async () => {
    (useMovieStore as unknown as jest.Mock).mockReturnValue({
      searchResults: [],
      searchLoading: false,
      liveSearch,
      clearSearchResults,
    });

    render(<MovieSearch />);
    const input = screen.getByPlaceholderText("Search for movies...");
    fireEvent.change(input, { target: { value: "xyz123" } });

    const noResult = await screen.findByText("No movies found");
    expect(noResult).toBeInTheDocument();
  });
});
