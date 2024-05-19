import { fetchAllFeedPostsAction, fetchProfileAction } from "@/actions";
import Feed from "@/components/feed";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function FeedPage() {
  const user = await currentUser();
  const profileInfo = await fetchProfileAction(user?.id);
  if (!profileInfo) redirect("/onboard");

  const allFeedPosts = await fetchAllFeedPostsAction();

  return (
    <Feed
      allFeedPosts={allFeedPosts}
      user={JSON.parse(JSON.stringify(user))}
      profileInfo={profileInfo}
    />
  );
}

export default FeedPage;
