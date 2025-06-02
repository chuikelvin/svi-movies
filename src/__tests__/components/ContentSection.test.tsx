/* eslint-disable @next/next/no-img-element */
import { render, screen, fireEvent } from "@testing-library/react";
import ContentSection from "@/components/ContentSection"; // adjust to actual path
import { useMovieStore } from "@/store/movieStore";
import { useRouter } from "next/navigation";
import React from "react";

jest.mock("next/image", () => {
  const MockImage = (
    props: React.ImgHTMLAttributes<HTMLImageElement> & {
      fill?: boolean;
      sizes?: string;
    }
  ) => {
    // Extract Next.js specific props that shouldn't be passed to img
    const { fill, sizes, ...imgProps } = props;
    return (
      <img
        {...imgProps}
        alt={props.alt || "mock-image"}
        style={{ position: fill ? "absolute" : "relative" }}
      />
    );
  };
  MockImage.displayName = "MockNextImage";
  return MockImage;
});

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/store/movieStore", () => ({
  useMovieStore: jest.fn(),
}));

interface MotionProps {
  children?: React.ReactNode;
  whileHover?: Record<string, unknown>;
  whileTap?: Record<string, unknown>;
  variants?: Record<string, unknown>;
  initial?: Record<string, unknown>;
  animate?: Record<string, unknown>;
  [key: string]: unknown;
}

jest.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      whileHover,
      whileTap,
      variants,
      initial,
      animate,
      ...props
    }: MotionProps) => <div {...props}>{children}</div>,
    h2: ({ children, initial, animate, ...props }: MotionProps) => (
      <h2 {...props}>{children}</h2>
    ),
    button: ({ children, whileHover, whileTap, ...props }: MotionProps) => (
      <button {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("ContentSection", () => {
  const push = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading spinner", () => {
    (useMovieStore as unknown as jest.Mock).mockReturnValue({
      movies: { loading: true, error: null, items: [] },
      series: {},
      kidsContent: {},
      fetchMovies: jest.fn(),
    });

    render(<ContentSection title="Movies" type="movie" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders error state", () => {
    (useMovieStore as unknown as jest.Mock).mockReturnValue({
      movies: { loading: false, error: "Something went wrong", items: [] },
      series: {},
      kidsContent: {},
      fetchMovies: jest.fn(),
    });

    render(<ContentSection title="Movies" type="movie" />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders content items", () => {
    (useMovieStore as unknown as jest.Mock).mockReturnValue({
      movies: {
        loading: false,
        error: null,
        items: [
          {
            id: 1,
            title: "Movie Title",
            poster_path: "/poster.jpg",
            vote_average: 8.5,
            overview: "A short description.",
          },
        ],
      },
      series: {},
      kidsContent: {},
      fetchMovies: jest.fn(),
    });

    render(<ContentSection title="Movies" type="movie" />);
    expect(screen.getByText("Movie Title")).toBeInTheDocument();
    expect(screen.getByText("8.5")).toBeInTheDocument();
    expect(screen.getByText("A short description.")).toBeInTheDocument();
  });

  it("clicks 'View All' navigates to full list", () => {
    (useMovieStore as unknown as jest.Mock).mockReturnValue({
      movies: {
        loading: false,
        error: null,
        items: [],
      },
      series: {},
      kidsContent: {},
      fetchMovies: jest.fn(),
    });

    render(<ContentSection title="Movies" type="movie" />);
    const button = screen.getByText("View All");
    fireEvent.click(button);
    expect(push).toHaveBeenCalledWith("/movie");
  });

  it("clicks an item navigates to details page", () => {
    (useMovieStore as unknown as jest.Mock).mockReturnValue({
      movies: {
        loading: false,
        error: null,
        items: [
          {
            id: 123,
            title: "Clickable Movie",
            poster_path: "/click.jpg",
            vote_average: 7.2,
            overview: "Description here.",
          },
        ],
      },
      series: {},
      kidsContent: {},
      fetchMovies: jest.fn(),
    });

    render(<ContentSection title="Movies" type="movie" />);
    const card = screen.getByText("Clickable Movie").closest("div");
    if (card) {
      fireEvent.click(card);
      expect(push).toHaveBeenCalledWith("/movie/123");
    } else {
      throw new Error("Card not found");
    }
  });
});
