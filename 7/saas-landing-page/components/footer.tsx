import { Container } from "./container";
import { SnackbarLink } from "./snackbar-link";

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100">
            <Container className="py-12 md:flex md:items-center md:justify-between">
                <div className="flex justify-center space-x-6 md:order-2">
                    <SnackbarLink className="text-gray-400 hover:text-gray-500">
                        이용약관
                    </SnackbarLink>
                    <SnackbarLink className="text-gray-400 hover:text-gray-500">
                        개인정보처리방침
                    </SnackbarLink>
                    <SnackbarLink className="text-gray-400 hover:text-gray-500">
                        문의하기
                    </SnackbarLink>
                </div>
                <div className="mt-8 md:order-1 md:mt-0">
                    <p className="text-center text-xs leading-5 text-gray-500">
                        &copy; 2024 WriteFlow Inc. All rights reserved.
                    </p>
                </div>
            </Container>
        </footer>
    );
}
