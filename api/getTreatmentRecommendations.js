// api/getTreatmentRecommendations.js
const SYSTEM_PROMPTS = {
    DOCTOR_CHAT: `You are an AI medical assistant designed to act like a friendly and knowledgeable doctor. Your role is to provide accurate, empathetic, and helpful medical advice to users. Engage in natural, conversational dialogue while maintaining a professional tone. Follow these guidelines:

1. **Introduction**: Start by introducing yourself as a virtual doctor and ask how you can assist the user.
2. **Medical Advice**: Provide clear, concise, and evidence-based medical advice. Structure your responses as follows:
   - General Treatment Approaches
   - Lifestyle Recommendations
   - Warning Signs to Watch For
   - When to Seek Immediate Medical Help
3. **Empathy and Support**: Show empathy and understanding. Acknowledge the user's concerns and provide reassurance when appropriate.
4. **Follow-Up Questions**: Ask follow-up questions to gather more information and provide personalized advice.
5. **Disclaimer**: Always include a disclaimer at the end of your response, reminding the user that your advice is not a substitute for professional medical care. Encourage them to consult a healthcare provider for specific concerns.

Example Interaction:
- User: "I've been having headaches lately. What should I do?"
- AI: "Hello! I'm Dr. AI, your virtual medical assistant. I'm here to help. Headaches can have many causes, so let's explore this further. Can you tell me more about your headaches? For example, how often do they occur, and where is the pain located?"

Remember: If the input is not related to medicine or health, respond with: "This query does not match my functions. I am designed to assist with medical and health-related questions only."`,
};

export default async (req, res) => {
    console.log("Incoming request method:", req.method);

    // Handle CORS
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Origin", "https://health-connect-pi.vercel.app");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    );

    // Handle preflight request
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    // Check if it's a POST request
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed",
            message: "Only POST requests are supported",
        });
    }

    try {
        const { condition } = req.body;

        // Validate input
        if (!condition || typeof condition !== "string") {
            return res.status(400).json({
                error: "Bad Request",
                message: "Condition must be a string",
            });
        }

        // Use environment variables for sensitive data
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if (!GEMINI_API_KEY) {
            return res.status(500).json({
                error: "Internal Server Error",
                message: "Gemini API key is not configured.",
            });
        }

        // Gemini API endpoint
        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: [
                                { text: SYSTEM_PROMPTS.DOCTOR_CHAT }, // Use the DOCTOR_CHAT system prompt
                                { text: `Provide treatment information for: ${condition}` },
                            ],
                        },
                    ],
                    generationConfig: {
                        temperature: 0.3, // Adjust for creativity vs. precision
                    },
                }),
            }
        );

        // Check if Gemini response is ok
        if (!geminiResponse.ok) {
            const errorData = await geminiResponse.json().catch(() => ({
                error: "Gemini API error",
                message: geminiResponse.statusText,
            }));
            console.error("Gemini API error:", errorData);
            return res.status(geminiResponse.status).json(errorData);
        }

        const data = await geminiResponse.json();

        // Extract response content from Gemini format
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated";

        // Send successful response
        return res.status(200).json({
            success: true,
            model: "emini-1.5-pro",
            timestamp: new Date().toISOString(),
            treatment: responseText,
        });
    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).json({
            error: "Internal Server Error",
            message: "Failed to process the request",
            details: error.message,
        });
    }
};