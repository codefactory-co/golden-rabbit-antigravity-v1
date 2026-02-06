import AuthForm from "@/components/auth/auth-form";

export default function AuthPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative bg-[var(--background)]">
            <div className="w-full flex justify-center px-4 sm:px-6 lg:px-8">
                <AuthForm />
            </div>
        </div>
    );
}
