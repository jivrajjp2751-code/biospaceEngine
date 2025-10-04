import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, type = "chat", language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    
    if (type === "summary") {
      const langInstruction = language && language !== "English" 
        ? `Generate the summary in ${language} language. Use proper scientific terminology in ${language} while maintaining accuracy.`
        : "";
      
      systemPrompt = `You are an expert NASA bioscience research analyst. Generate concise, informative summaries of scientific publications. 
      Focus on: key findings, methodology, implications for space exploration, and potential applications.
      Keep summaries clear and accessible to a general audience while maintaining scientific accuracy.
      ${langInstruction}`;
    } else if (type === "translation") {
      systemPrompt = `You are a multilingual scientific translator specializing in NASA bioscience research.
      Translate the content to ${language} while preserving technical accuracy and scientific terminology.
      Maintain the original meaning and context. Use appropriate scientific terms in the target language.
      Ensure the translation is natural and fluent in ${language}.`;
    } else {
      const langInstruction = language && language !== "English"
        ? `Please respond in ${language} language. Provide clear, friendly responses in ${language}.`
        : "";
        
      systemPrompt = `You are a helpful NASA Bioscience Research Assistant. 
      Help users navigate the platform, understand research papers, and answer questions about NASA bioscience publications.
      Provide clear, friendly, and informative responses. Guide users on how to use features like AI summaries, filters, and translations.
      ${langInstruction}`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add more credits in workspace settings." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error("AI Gateway error");
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
