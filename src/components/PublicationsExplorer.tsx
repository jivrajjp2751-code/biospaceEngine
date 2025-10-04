import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Sparkles, Calendar, Tag, Loader2, Languages } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { loadPublications, type Publication } from "@/utils/publicationsData";

const LANGUAGES = [
  // International
  { code: "en", name: "English", native: "English" },
  { code: "es", name: "Spanish", native: "Español" },
  { code: "fr", name: "French", native: "Français" },
  { code: "de", name: "German", native: "Deutsch" },
  { code: "pt", name: "Portuguese", native: "Português" },
  { code: "ru", name: "Russian", native: "Русский" },
  { code: "ja", name: "Japanese", native: "日本語" },
  { code: "ko", name: "Korean", native: "한국어" },
  { code: "zh", name: "Chinese", native: "中文" },
  { code: "ar", name: "Arabic", native: "العربية" },
  
  // Major Indian Languages
  { code: "hi", name: "Hindi", native: "हिंदी" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", native: "മലയാളം" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "or", name: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "as", name: "Assamese", native: "অসমীয়া" },
  { code: "ur", name: "Urdu", native: "اردو" },
  
  // Other Indian Languages
  { code: "sa", name: "Sanskrit", native: "संस्कृतम्" },
  { code: "ks", name: "Kashmiri", native: "कॉशुर" },
  { code: "sd", name: "Sindhi", native: "سنڌي" },
  { code: "ne", name: "Nepali", native: "नेपाली" },
  { code: "kok", name: "Konkani", native: "कोंकणी" },
  { code: "mai", name: "Maithili", native: "मैथिली" },
  { code: "sat", name: "Santali", native: "ᱥᱟᱱᱛᱟᱲᱤ" },
  { code: "mni", name: "Manipuri", native: "মৈতৈলোন্" },
  { code: "brx", name: "Bodo", native: "बड़ो" },
  { code: "doi", name: "Dogri", native: "डोगरी" },
  
  // Regional Indian Languages
  { code: "bh", name: "Bhojpuri", native: "भोजपुरी" },
  { code: "raj", name: "Rajasthani", native: "राजस्थानी" },
  { code: "mag", name: "Magahi", native: "मगही" },
  { code: "awh", name: "Awadhi", native: "अवधी" },
  { code: "tcy", name: "Tulu", native: "ತುಳು" },
  { code: "gom", name: "Goan Konkani", native: "गोंयची कोंकणी" },
  { code: "kha", name: "Khasi", native: "Khasi" },
  { code: "grt", name: "Garo", native: "Garo" },
  { code: "lus", name: "Mizo", native: "Mizo ṭawng" },
  { code: "nag", name: "Naga", native: "Naga" },
  
  // South Asian Languages
  { code: "si", name: "Sinhala", native: "සිංහල" },
  { code: "dv", name: "Dhivehi", native: "ދިވެހި" },
  { code: "my", name: "Burmese", native: "မြန်မာဘာသာ" },
  { code: "th", name: "Thai", native: "ไทย" },
  { code: "vi", name: "Vietnamese", native: "Tiếng Việt" },
  { code: "id", name: "Indonesian", native: "Bahasa Indonesia" },
  { code: "ms", name: "Malay", native: "Bahasa Melayu" },
  { code: "tl", name: "Tagalog", native: "Tagalog" },
  
  // Additional Languages
  { code: "tr", name: "Turkish", native: "Türkçe" },
  { code: "fa", name: "Persian", native: "فارسی" },
  { code: "he", name: "Hebrew", native: "עברית" },
  { code: "sw", name: "Swahili", native: "Kiswahili" },
  { code: "pl", name: "Polish", native: "Polski" },
  { code: "uk", name: "Ukrainian", native: "Українська" },
  { code: "it", name: "Italian", native: "Italiano" },
];


const PublicationsExplorer = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [showSummary, setShowSummary] = useState<number | null>(null);
  const [loadingSummary, setLoadingSummary] = useState<number | null>(null);
  const [summaries, setSummaries] = useState<Record<number, string>>({});
  const [displayCount, setDisplayCount] = useState(12);

  useEffect(() => {
    loadPublications().then(setPublications);
  }, []);

  const years = ["all", "2024", "2023", "2022", "2021", "2020"];
  const topics = ["all", "Bone & Skeletal", "Cellular Biology", "Plant Science", "Radiation Biology", "Human Physiology", "Microbiology", "Genomics", "Immunology", "Other"];

  const filteredPublications = publications.filter((pub) => {
    const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = selectedYear === "all" || pub.year.toString() === selectedYear;
    const matchesTopic = selectedTopic === "all" || pub.topic === selectedTopic;
    return matchesSearch && matchesYear && matchesTopic;
  });

  const handleGetSummary = async (pubId: number, title: string) => {
    const cacheKey = `${pubId}-${selectedLanguage}`;
    
    if (summaries[cacheKey]) {
      setShowSummary(showSummary === pubId ? null : pubId);
      return;
    }

    setLoadingSummary(pubId);
    setShowSummary(pubId);

    try {
      const languageName = LANGUAGES.find(l => l.code === selectedLanguage)?.name || "English";
      
      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: {
          messages: [
            {
              role: "user",
              content: `Generate a detailed, accurate summary for this NASA bioscience research paper: "${title}". Focus on key findings, methodology, and implications for space exploration. Be scientifically precise and comprehensive.`,
            },
          ],
          type: "summary",
          language: languageName,
        },
      });

      if (error) {
        console.error("Summary error:", error);
        toast.error("Failed to generate summary. Please try again.");
        return;
      }

      setSummaries((prev) => ({ ...prev, [cacheKey]: data.response }));
    } catch (error) {
      console.error("Error generating summary:", error);
      toast.error("Failed to connect to AI service.");
    } finally {
      setLoadingSummary(null);
    }
  };

  return (
    <section id="explorer" className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-aurora bg-clip-text text-transparent">
            Explore Publications
          </h2>
          <p className="text-xl text-muted-foreground">
            Browse through {publications.length} NASA bioscience research papers
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8 bg-card/50 backdrop-blur-sm border-border shadow-card">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search publications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-border"
              />
            </div>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="bg-background/50 border-border">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year === "all" ? "All Years" : year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger className="bg-background/50 border-border">
                <Tag className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by topic" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic === "all" ? "All Topics" : topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="bg-background/50 border-border">
                <Languages className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.native} ({lang.name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {Math.min(displayCount, filteredPublications.length)} of {filteredPublications.length} publications (Total: {publications.length})
            </p>
            <p className="text-sm text-accent">
              <Languages className="w-4 h-4 inline mr-1" />
              {LANGUAGES.length} languages available
            </p>
          </div>
        </Card>

        {/* Publications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPublications.slice(0, displayCount).map((pub) => (
            <Card 
              key={pub.id}
              className="p-6 bg-card/50 backdrop-blur-sm border-border hover:border-accent/50 hover:shadow-glow transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <Badge 
                  variant="outline" 
                  className={`
                    ${pub.impact === "High" ? "border-accent/50 text-accent" : ""}
                    ${pub.impact === "Critical" ? "border-secondary/50 text-secondary" : ""}
                    ${pub.impact === "Medium" ? "border-primary/50 text-primary" : ""}
                  `}
                >
                  {pub.impact} Impact
                </Badge>
                <span className="text-sm text-muted-foreground">{pub.year}</span>
              </div>
              
              <a 
                href={pub.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-lg font-semibold mb-2 text-foreground group-hover:text-accent transition-colors line-clamp-2 hover:underline block"
              >
                {pub.title}
              </a>
              
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{pub.topic}</span>
              </div>

              {showSummary === pub.id && (
                <div className="text-sm text-muted-foreground mb-4 animate-fade-in">
                  {loadingSummary === pub.id ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating accurate AI summary in {LANGUAGES.find(l => l.code === selectedLanguage)?.name}...</span>
                    </div>
                  ) : (
                    <p className="leading-relaxed">{summaries[`${pub.id}-${selectedLanguage}`]}</p>
                  )}
                </div>
              )}
              
              <Button 
                className="w-full bg-gradient-cosmic hover:opacity-90"
                onClick={() => handleGetSummary(pub.id, pub.title)}
                disabled={loadingSummary === pub.id}
              >
                {loadingSummary === pub.id ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                {showSummary === pub.id ? "Hide Summary" : "AI Summary"}
              </Button>
            </Card>
          ))}
        </div>

        {filteredPublications.length > displayCount && (
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              variant="outline" 
              className="border-accent/50 hover:bg-accent/10"
              onClick={() => setDisplayCount(prev => prev + 12)}
            >
              Load More Publications ({filteredPublications.length - displayCount} remaining)
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PublicationsExplorer;
