"use client";

import { useSnackbar } from "./snackbar-provider";

export function SnackbarLink({
    className,
    children,
    message = "없는 페이지입니다",
}: {
    className?: string;
    children: React.ReactNode;
    message?: string;
}) {
    const { showSnackbar } = useSnackbar();

    return (
        <button
            className={className}
            onClick={(e) => {
                e.preventDefault();
                showSnackbar(message);
            }}
        >
            {children}
        </button>
    );
}
