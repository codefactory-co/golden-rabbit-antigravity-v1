"use client";

import { PostDto } from "@/core/application/dtos/PostDto";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deletePostAction, publishPostAction } from "@/app/actions";
import { useTransition } from "react";

interface PostListProps {
    posts: PostDto[];
    title: string;
    isOwner?: boolean;
}

export function PostList({ posts, title, isOwner = false }: PostListProps) {
    const [pending, startTransition] = useTransition();

    if (posts.length === 0) {
        return (
            <Card className="p-6 text-center text-gray-500 mb-8">
                <p>{title}이 없습니다.</p>
            </Card>
        );
    }

    return (
        <div className="space-y-4 mb-8">
            <h2 className="text-2xl font-bold">{title}</h2>
            <div className="grid gap-4">
                {posts.map((post) => (
                    <Card key={post.id} className={post.isPublished ? "border-l-4 border-l-green-500" : "border-l-4 border-l-yellow-500"}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{post.title}</CardTitle>
                                    <CardDescription className="mt-1">
                                        {new Date(post.createdAt).toLocaleString()}
                                    </CardDescription>
                                </div>
                                {isOwner && (
                                    <Badge variant={post.isPublished ? "default" : "secondary"}>
                                        {post.isPublished ? "발행됨" : "비공개"}
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap">{post.content}</p>
                        </CardContent>
                        {isOwner && (
                            <CardFooter className="gap-2">
                                {!post.isPublished && (
                                    <Button
                                        variant="outline"
                                        disabled={pending}
                                        onClick={() => startTransition(() => publishPostAction(post.id))}
                                    >
                                        발행하기
                                    </Button>
                                )}
                                <Button
                                    variant="destructive"
                                    disabled={pending}
                                    onClick={() => startTransition(() => deletePostAction(post.id))}
                                >
                                    삭제
                                </Button>
                            </CardFooter>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
}
