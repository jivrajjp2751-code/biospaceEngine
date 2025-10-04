import Hero from "@/components/Hero";
import PublicationsExplorer from "@/components/PublicationsExplorer";
import WhyUse from "@/components/WhyUse";
import FeaturedDiscoveries from "@/components/FeaturedDiscoveries";
import ChatBot from "@/components/ChatBot";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedDiscoveries />
      <PublicationsExplorer />
      <WhyUse />
      <ChatBot />
      
      {/* Footer */}
      <footer className="py-8 px-4 bg-muted/20 border-t border-border">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            © 2025 NASA Bioscience Publications Hub. Powered by AI for space exploration research.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
