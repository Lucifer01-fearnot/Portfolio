// Modernize the function using Deno.serve instead of the old std/http/server
const HF_TOKEN = Deno.env.get('HF_TOKEN')
const MODEL_NAME = "Qwen/Qwen2.5-72B-Instruct"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        if (!HF_TOKEN) {
            throw new Error('HF_TOKEN is not set in the environment variables')
        }

        const body = await req.json().catch(() => ({}));
        const { messages } = body;

        if (!messages || !Array.isArray(messages)) {
            return new Response(
                JSON.stringify({ error: "Missing or invalid 'messages' array in request body" }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        console.log(`Sending request to AI router for model: ${MODEL_NAME}`)

        // Note: Qwen3-Coder-480B-A35B-Instruct:novita is typically hosted on Novita AI.
        // If the Hugging Face router fails, consider switching the URL to Novita's API:
        // https://api.novita.ai/v3/openai/chat/completions
        const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${HF_TOKEN}`
            },
            body: JSON.stringify({
                model: MODEL_NAME,
                messages: messages,
                max_tokens: 1000,
                temperature: 0.7,
            }),
        })

        if (!response.ok) {
            const errorData = await response.text();
            console.error("AI Provider Error:", errorData);
            return new Response(
                JSON.stringify({ error: "AI Engine error", details: errorData }),
                { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const data = await response.json();
        const aiMessage = data.choices?.[0]?.message?.content;

        if (!aiMessage) {
            throw new Error("Invalid response format from AI provider");
        }

        return new Response(
            JSON.stringify({ message: aiMessage }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Edge Function Error:", errorMessage);
        return new Response(
            JSON.stringify({ error: errorMessage }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
