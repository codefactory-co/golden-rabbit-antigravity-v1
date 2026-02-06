import React from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-full w-full overflow-y-auto p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                {children}
            </div>
        </div>
    );
}
