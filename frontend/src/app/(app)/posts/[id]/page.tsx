import PostDetails from "@/components/Posts/PostDetails";

export default async function Post({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PostDetails id={id} />;
}