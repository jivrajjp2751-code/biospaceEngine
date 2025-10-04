import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send, Languages, HelpCircle, Loader2, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const LANGUAGES = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिंदी" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
];

interface Message {
  role: "user" | "assistant";
  content: string;
  language?: string;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your NASA Bioscience Research Assistant. I can help you explore publications, provide summaries, and translate content to Hindi, Marathi, and Gujarati. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const languageName = LANGUAGES.find(l => l.code === selectedLanguage)?.name || "English";
      
      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: {
          messages: [{ role: "user", content: input }],
          type: "chat",
          language: languageName,
        },
      });

      if (error) {
        console.error("AI chat error:", error);
        toast.error("Failed to get AI response. Please try again.");
        return;
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error calling AI:", error);
      toast.error("Failed to connect to AI assistant.");
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { icon: HelpCircle, text: "How to use this app", query: "How do I use this platform?" },
    { icon: Globe, text: "Change language", action: "language" },
    { icon: MessageCircle, text: "Get a summary", query: "How do I get a summary?" },
  ];

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-glow bg-gradient-cosmic hover:opacity-90 z-50"
        size="icon"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[600px] flex flex-col shadow-card border-border bg-card/95 backdrop-blur-sm z-50 animate-slide-up">
          {/* Header */}
          <div className="p-4 border-b border-border bg-gradient-cosmic">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-primary-foreground">AI Research Assistant</h3>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-primary-foreground/80">
                    Language: {LANGUAGES.find(l => l.code === selectedLanguage)?.native}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Language Selector */}
          <div className="p-3 border-b border-border bg-muted/20">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Select Language</span>
            </div>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="bg-background/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.native} ({lang.name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quick Actions */}
          <div className="p-3 border-b border-border bg-muted/20">
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="cursor-pointer hover:bg-accent/10 transition-colors border-accent/30"
                  onClick={() => {
                    if (action.query) {
                      setInput(action.query);
                      handleSend();
                    }
                  }}
                >
                  <action.icon className="w-3 h-3 mr-1" />
                  {action.text}
                </Badge>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-gradient-cosmic text-primary-foreground"
                      : "bg-muted/50 text-foreground"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                disabled={isLoading}
                className="bg-background/50 border-border"
              />
              <Button 
                onClick={handleSend}
                disabled={isLoading}
                className="bg-gradient-cosmic hover:opacity-90"
                size="icon"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default ChatBot;
