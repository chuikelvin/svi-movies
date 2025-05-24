import MovieDetails from "@/components/MovieDetails";

interface MoviePageProps {
  params: {
    id: string;
  };
}

export default function MoviePage({ params }: MoviePageProps) {
  return <MovieDetails movieId={parseInt(params.id)} />;
}
