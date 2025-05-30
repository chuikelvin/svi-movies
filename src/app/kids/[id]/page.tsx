import ContentDetails from "@/components/ContentDetails";

export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ContentDetails id={parseInt(id)} type="kids" />;
}
