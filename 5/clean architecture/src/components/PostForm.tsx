"use client";

import { useState } from "react";
import { createPostAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export function PostForm() {
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setMessage("");

        const result = await createPostAction(null, formData);

        setMessage(result.message);
        setIsSuccess(result.success);
        setLoading(false);

        if (result.success) {
            // Reset form (hacky but works for standard HTML form)
            (document.getElementById("post-form") as HTMLFormElement).reset();
        }
    }

    return (
        <Card className="w-full mb-8">
            <CardHeader>
                <CardTitle>새 게시글 작성</CardTitle>
            </CardHeader>
            <CardContent>
                <form id="post-form" action={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">제목 (5~100자)</Label>
                        <Input id="title" name="title" placeholder="제목을 입력하세요" required minLength={5} maxLength={100} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">본문 (10~10,000자)</Label>
                        <Textarea
                            id="content"
                            name="content"
                            placeholder="내용을 입력하세요"
                            className="min-h-[150px]"
                            required
                            minLength={10}
                            maxLength={10000}
                        />
                    </div>
                    <Button type="submit" disabled={loading}>
                        {loading ? "작성 중..." : "작성하기"}
                    </Button>
                </form>
            </CardContent>
            {message && (
                <CardFooter>
                    <p className={isSuccess ? "text-green-600" : "text-red-600"}>{message}</p>
                </CardFooter>
            )}
        </Card>
    );
}
