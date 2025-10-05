import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-space.jpg";

const Hero = () => {
  const scrollToExplorer = () => {
    document.getElementById('explorer')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-aurora bg-clip-text text-transparent leading-tight">
          NASA Bioscience
          <br />
          Publications Hub
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
          Explore 600+ groundbreaking NASA research papers with AI-powered summaries, 
          multilingual support in 56+ languages, and intelligent insights—all in one place.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-lg px-8 shadow-glow"
            onClick={scrollToExplorer}
          >
            Explore Publications
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-accent/50 hover:bg-accent/10 text-lg px-8"
            onClick={() => document.getElementById('why-use')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Why Use This?
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          {[
            { num: "600+", label: "Research Papers of NASA Datasets" },
            { num: "56+", label: "Languages Available" },
            { num: "AI", label: "Powered Summaries" },
          ].map((stat, i) => (
            <div key={i} className="p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border shadow-card hover:shadow-glow transition-all duration-300">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-aurora bg-clip-text text-transparent mb-2">
                {stat.num}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
