import { HeroSection } from "./_components/landing/HeroSection";
import { PricingSection } from "./_components/landing/PricingSection";

export default function LandingPage() {
    return (
        <div className="flex min-h-screen flex-col bg-white dark:bg-[#0F172A]">
            <div className="flex-1">
                <HeroSection />
                <PricingSection />
            </div>
        </div>
    );
}
