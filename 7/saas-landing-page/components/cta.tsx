import { Container } from "./container";
import { SnackbarLink } from "./snackbar-link";

export function CTA() {
    return (
        <div className="bg-violet-700">
            <Container className="py-24 text-center sm:py-32">
                <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    글쓰기를 혁신할 준비가 되셨나요?
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-violet-200">
                    지금 바로 WriteFlow와 함께 더 나은 콘텐츠를 더 빠르게 만들어보세요.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <SnackbarLink
                        className="rounded-full bg-white px-8 py-3.5 text-base font-semibold text-violet-600 shadow-sm hover:bg-violet-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                        무료 체험 시작
                    </SnackbarLink>
                </div>
            </Container>
        </div>
    );
}
