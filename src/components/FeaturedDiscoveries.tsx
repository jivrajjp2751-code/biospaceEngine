import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useState } from "react";
import marsLab from "@/assets/mars-lab.jpg";
import moonResearch from "@/assets/moon-research.jpg";

const discoveries = [
  {
    title: "Microgravity Effects on Human Cellular Biology",
    description: "Groundbreaking research on how space affects human cells, with implications for long-duration missions.",
    image: moonResearch,
    year: "2024",
    impact: "High Impact",
  },
  {
    title: "Plant Growth Systems for Mars Colonization",
    description: "Revolutionary techniques for sustainable food production in Martian conditions using hydroponic systems.",
    image: marsLab,
    year: "2023",
    impact: "Critical Discovery",
  },
  {
    title: "Radiation Protection Through Biological Mechanisms",
    description: "Novel approaches to protecting astronauts from cosmic radiation using biological shielding methods.",
    image: moonResearch,
    year: "2024",
    impact: "Breakthrough",
  },
];

const FeaturedDiscoveries = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % discoveries.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + discoveries.length) % discoveries.length);

  const current = discoveries[currentIndex];

  return (
    <section className="py-20 px-4 bg-muted/20">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-aurora bg-clip-text text-transparent">
            Featured Discoveries
          </h2>
          <p className="text-xl text-muted-foreground">
            Breakthrough research shaping the future of space exploration
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-border shadow-card hover:shadow-glow transition-all duration-300">
            <div className="grid md:grid-cols-2 gap-0">
              <div 
                className="h-64 md:h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${current.image})` }}
              />
              <div className="p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium">
                      {current.year}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-secondary/20 text-secondary text-sm font-medium">
                      {current.impact}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    {current.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {current.description}
                  </p>
                </div>
                <Button className="bg-gradient-cosmic hover:opacity-90 w-full">
                  View AI Summary
                  <ExternalLink className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          <div className="flex items-center justify-center gap-4 mt-6">
            <Button 
              variant="outline" 
              size="icon"
              onClick={prev}
              className="border-accent/50 hover:bg-accent/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex gap-2">
              {discoveries.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex 
                      ? 'bg-accent w-8' 
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={next}
              className="border-accent/50 hover:bg-accent/10"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDiscoveries;
