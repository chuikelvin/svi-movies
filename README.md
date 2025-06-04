# SVI Movies - Modern Movie & TV Show Streaming Platform

![Linting and Tests](https://github.com/chuikelvin/svi-movies/actions/workflows/lint_and_test.yml/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/chuikelvin/svi-movies/badge.svg?branch=add-coverage-reporting)](https://coveralls.io/github/chuikelvin/svi-movies?branch=add-coverage-reporting)

A modern, responsive web application for browsing movies and TV shows, built with Next.js 13+, TypeScript, and Tailwind CSS.

## Features

- 🎬 Browse popular movies, TV series, and family-friendly content
- 🔍 Real-time search functionality
- 🎨 Beautiful, responsive UI with dark/light mode support
- ⚡ Fast page loads with Next.js server components
- 🎭 Detailed movie and TV show information
- 🎯 User authentication and personalized experience
- 🎨 Smooth animations with Framer Motion
- 🐳 Docker support for easy deployment

## Tech Stack

- **Framework:** Next.js 13+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Animations:** Framer Motion
- **API:** TMDB (The Movie Database)
- **Authentication:** Custom auth implementation
- **Icons:** React Icons
- **Containerization:** Docker

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
- Docker and Docker Compose (for containerized deployment)

### Setup

#### Local Development

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

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Docker Deployment

1. Build and run using Docker Compose:

   ```bash
   # Build and start the containers
   docker compose up -d

   # View logs
   docker compose logs -f

   # Stop the containers
   docker compose down
   ```

2. Environment Variables for Docker:
   Create a `.env` file in the project root with the following variables:

   ```env
   # Public Firebase config (available in browser)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

   # Server-side environment variables
   TMDB_BEARER_TOKEN=your_tmdb_bearer_token
   ```

3. Docker Commands:

   ```bash
   # Build the image
   docker compose build

   # Start the application
   docker compose up -d

   # View logs
   docker compose logs -f

   # Stop the application
   docker compose down

   # Rebuild and restart
   docker compose up -d --build
   ```

4. Access the application:
   - The application will be available at `http://localhost:3000`
   - Health check endpoint: `http://localhost:3000/api/health`

### Environment Variables

The application requires the following environment variables:

- `TMDB_BEARER_TOKEN`: Your TMDB API bearer token
  - Get it from [TMDB API Settings](https://www.themoviedb.org/settings/api)
  - Required for fetching movie and TV show data

Firebase Configuration (Required):
- `NEXT_PUBLIC_FIREBASE_API_KEY`: Your Firebase API key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Your Firebase project ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID`: Your Firebase app ID

Admin Credentials:
- `NEXT_PUBLIC_ADMIN_EMAIL`: Admin email for authentication
- `NEXT_PUBLIC_ADMIN_PASSWORD`: Admin password for authentication

### Building for Production

#### Local Build

```bash
# Build the application
npm run build

# Start the production server
npm start
```

#### Docker Production Build

```bash
# Build and start production containers
docker compose -f docker-compose.yml up -d --build
```

## API Integration

The application uses The Movie Database (TMDB) API for movie and TV show data. You'll need to:

1. Create an account at [TMDB](https://www.themoviedb.org/)
2. Generate an API key
3. Add the API key to your `.env.local` file or Docker environment variables

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
- [Docker](https://www.docker.com/) for containerization support
