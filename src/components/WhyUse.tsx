import { Brain, Globe, TrendingUp, Zap, Shield, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "AI-Generated Summaries",
    description: "Get concise, intelligent summaries of complex research papers in seconds, saving hours of reading time.",
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    description: "Access research in Hindi, Marathi, and Gujarati—making science accessible across India.",
  },
  {
    icon: TrendingUp,
    title: "Interactive Visualizations",
    description: "Discover trends, gaps, and breakthroughs through knowledge graphs and data visualizations unavailable on Google.",
  },
  {
    icon: Zap,
    title: "Smart Search & Filters",
    description: "Find exactly what you need with advanced filtering by topic, year, impact area, and research keywords.",
  },
  {
    icon: Shield,
    title: "Mission-Focused Insights",
    description: "Tailored analysis for mission planners and researchers, highlighting actionable insights and scientific consensus.",
  },
  {
    icon: Users,
    title: "Centralized Knowledge",
    description: "All 608+ NASA bioscience publications organized in one comprehensive, easy-to-navigate dashboard.",
  },
];

const WhyUse = () => {
  return (
    <section id="why-use" className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-aurora bg-clip-text text-transparent">
            Why Choose This Platform?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            More than just a search engine—your intelligent companion for NASA bioscience research
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-6 bg-card/50 backdrop-blur-sm border-border hover:border-accent/50 hover:shadow-glow transition-all duration-300 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col items-start gap-4">
                <div className="p-3 rounded-lg bg-gradient-cosmic group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-accent transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUse;
