
import { HeroSection } from "@/components/home/HeroSection";
import { ModuleGrid } from "@/components/home/ModuleGrid";
import { QuickActions } from "@/components/home/QuickActions";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        <HeroSection />
        <ModuleGrid />
        <QuickActions />
      </div>
    </div>
  );
};

export default Index;
