"use client";

import { createContext, useCallback, useContext, useState } from "react";

interface SnackbarContextType {
    showSnackbar: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextType>({
    showSnackbar: () => {},
});

export function useSnackbar() {
    return useContext(SnackbarContext);
}

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
    const [message, setMessage] = useState<string | null>(null);
    const [visible, setVisible] = useState(false);

    const showSnackbar = useCallback((msg: string) => {
        setMessage(msg);
        setVisible(true);
        setTimeout(() => {
            setVisible(false);
        }, 3000);
    }, []);

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            {message && (
                <div
                    className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all duration-300 ${
                        visible
                            ? "translate-y-0 opacity-100"
                            : "translate-y-4 opacity-0 pointer-events-none"
                    }`}
                    onTransitionEnd={() => {
                        if (!visible) setMessage(null);
                    }}
                >
                    {message}
                </div>
            )}
        </SnackbarContext.Provider>
    );
}
