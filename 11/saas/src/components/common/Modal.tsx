import React, { useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, description, children, footer }: ModalProps) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleEsc);
        }
        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // Use portal if possible, but for simplicity in this refactor I'll render it inline or check if document exists
    // Next.js App Router handles this fine usually, but Portal is safer for z-index.
    // I'll assume a basic implementation first.

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Panel */}
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg dark:bg-surface-dark border border-gray-100 dark:border-gray-700">
                    <div className="bg-white px-4 py-5 sm:p-6 pb-0 dark:bg-surface-dark">
                        {title && (
                            <h3 className="text-lg font-bold leading-6 text-gray-900 dark:text-white">
                                {title}
                            </h3>
                        )}
                        {description && (
                            <div className="mt-2">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {description}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="px-4 py-4 sm:p-6 space-y-4">
                        {children}
                    </div>

                    {footer && (
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 dark:bg-gray-800/50">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
