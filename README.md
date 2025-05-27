# SVI Movies - Modern Movie & TV Show Streaming Platform

A modern, responsive web application for browsing movies and TV shows, built with Next.js 13+, TypeScript, and Tailwind CSS.

## Features

- 🎬 Browse popular movies, TV series, and family-friendly content
- 🔍 Real-time search functionality
- 🎨 Beautiful, responsive UI with dark/light mode support
- ⚡ Fast page loads with Next.js server components
- 🎭 Detailed movie and TV show information
- 🎯 User authentication and personalized experience
- 🎨 Smooth animations with Framer Motion

## Tech Stack

- **Framework:** Next.js 13+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Animations:** Framer Motion
- **API:** TMDB (The Movie Database)
- **Authentication:** Custom auth implementation
- **Icons:** React Icons

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── movie/             # Movie listing and details
│   ├── tv/                # TV series listing and details
│   ├── kids/              # Family-friendly content
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # UI components
│   ├── AuthButton.tsx    # Authentication button
│   ├── ContentSection.tsx # Content grid section
│   ├── MovieDetails.tsx  # Movie details view
│   └── MovieSearch.tsx   # Search functionality
├── lib/                  # Utility functions
│   └── tmdb.ts          # TMDB API integration
├── store/               # State management
│   ├── authStore.ts    # Authentication state
│   └── movieStore.ts   # Movie data state
└── styles/             # Global styles
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- TMDB API key (get it from [TMDB](https://www.themoviedb.org/settings/api))

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/svi-movies.git
   cd svi-movies
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   # Copy the example environment file
   cp env.example .env.local

   # Edit .env.local with your values   
   ```

# Admin Credentials

NEXT_PUBLIC_ADMIN_EMAIL=admin@svi.com
NEXT_PUBLIC_ADMIN_PASSWORD=svi2025rocks!

````

4. Run the development server:

```bash
npm run dev
````

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

The application requires the following environment variables:

- `NEXT_PUBLIC_TMDB_BEARER_TOKEN`: Your TMDB API bearer token
  - Get it from [TMDB API Settings](https://www.themoviedb.org/settings/api)
  - Required for fetching movie and TV show data

Optional variables (if using authentication):

- `NEXT_PUBLIC_AUTH_SECRET`: Secret key for authentication
- `NEXT_PUBLIC_AUTH_URL`: Authentication service URL

### Building for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## API Integration

The application uses The Movie Database (TMDB) API for movie and TV show data. You'll need to:

1. Create an account at [TMDB](https://www.themoviedb.org/)
2. Generate an API key
3. Add the API key to your `.env.local` file

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [TMDB](https://www.themoviedb.org/) for providing the movie and TV show data
- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for the smooth animations
