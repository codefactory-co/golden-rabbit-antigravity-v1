import Link from "next/link";
import { Container } from "./container";
import { SnackbarLink } from "./snackbar-link";

export function Navbar() {
    return (
        <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <Container className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-xl font-bold tracking-tight">
                        WriteFlow
                    </Link>
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                        <Link href="#features" className="hover:text-gray-900 transition-colors">
                            기능
                        </Link>
                        <Link href="#pricing" className="hover:text-gray-900 transition-colors">
                            요금제
                        </Link>
                        <Link href="#faq" className="hover:text-gray-900 transition-colors">
                            FAQ
                        </Link>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <SnackbarLink
                        className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        로그인
                    </SnackbarLink>
                    <SnackbarLink
                        className="rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 transition-colors"
                    >
                        무료 체험 시작
                    </SnackbarLink>
                </div>
            </Container>
        </nav>
    );
}
