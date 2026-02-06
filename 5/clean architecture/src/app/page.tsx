import { getMyPostsAction, getPostsAction } from "./actions";
import { PostForm } from "@/components/PostForm";
import { PostList } from "@/components/PostList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function Home() {
  const newsFeed = await getPostsAction();
  const myPosts = await getMyPostsAction();

  return (
    <main className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Clean Architecture Blog</h1>

      <div className="grid gap-8">
        <section>
          <PostForm />
        </section>

        <section>
          <Tabs defaultValue="feed" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="feed">뉴스 피드 (공개글)</TabsTrigger>
              <TabsTrigger value="my-posts">내 작성글 (관리)</TabsTrigger>
            </TabsList>

            <TabsContent value="feed">
              <PostList posts={newsFeed} title="최신 글" />
            </TabsContent>

            <TabsContent value="my-posts">
              <PostList posts={myPosts} title="내 게시글" isOwner={true} />
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </main>
  );
}
