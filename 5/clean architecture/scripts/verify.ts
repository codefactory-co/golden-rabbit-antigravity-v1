import { CreatePostUseCase } from "../src/core/application/use-cases/CreatePostUseCase";
import { InMemoryPostRepository } from "../src/infrastructure/repositories/InMemoryPostRepository";
import { Post } from "../src/core/domain/entities/Post";

async function verify() {
    console.log("Starting Verification...");

    const repo = InMemoryPostRepository.getInstance();
    const createUseCase = new CreatePostUseCase(repo);
    const userId = "test-user-1";

    // 1. Test Limit (10 posts)
    console.log("\n1. Testing Daily Limit (10 posts)");
    try {
        for (let i = 0; i < 10; i++) {
            await createUseCase.execute(`Test Title ${i}`, `Test Content Content ${i}`, userId);
            console.log(`Created post ${i + 1}`);
        }
        console.log("Created 10 posts successfully.");
    } catch (e: any) {
        console.error("Failed to create initial 10 posts:", e.message);
    }

    // 11th post
    try {
        console.log("Attempting 11th post...");
        await createUseCase.execute("11th Post", "Content Content Content", userId);
        console.error("FAIL: 11th post should have failed.");
    } catch (e: any) {
        if (e.message.includes("하루에 최대 10개의 글만 작성")) {
            console.log("PASS: 11th post failed as expected.");
        } else {
            console.error("FAIL: Unexpected error:", e.message);
        }
    }

    // 2. Test Content Length
    console.log("\n2. Testing Constraints");
    try {
        console.log("Attempting short title...");
        await createUseCase.execute("Hi", "Content Content Content", "user2");
        console.error("FAIL: Short title should have failed.");
    } catch (e: any) {
        if (e.message.includes("제목은 5자 이상")) {
            console.log("PASS: Short title failed as expected.");
        }
    }

    try {
        console.log("Attempting short content...");
        await createUseCase.execute("Valid Title", "Short", "user2");
        console.error("FAIL: Short content should have failed.");
    } catch (e: any) {
        if (e.message.includes("본문은 10자 이상")) {
            console.log("PASS: Short content failed as expected.");
        }
    }

    console.log("\nVerification Complete.");
}

verify().catch(console.error);
