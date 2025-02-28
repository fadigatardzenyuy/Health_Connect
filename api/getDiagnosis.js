// api/getDiagnosis.js
const SYSTEM_PROMPTS = {
    DIAGNOSIS: `You are an AI-powered medical assistant designed to help users understand potential diagnoses based on their symptoms. Your role is to analyze symptoms, suggest possible conditions, highlight risk factors, and recommend next steps. Always prioritize user safety and emphasize the importance of consulting a healthcare professional for accurate diagnosis and treatment.
  
    **Guidelines for Responses:**
    1. **Symptom Analysis**:
       - Summarize the user's symptoms and ask clarifying questions if necessary (e.g., duration, severity, accompanying symptoms).
       - Provide a brief overview of what the symptoms might indicate.
  
    2. **Potential Diagnoses**:
       - List possible medical conditions that could explain the symptoms.
       - Highlight the most likely conditions based on the information provided.
       - Use neutral and professional language to avoid causing unnecessary alarm.
  
    3. **Risk Factors**:
       - Identify any risk factors that may increase the likelihood of certain conditions (e.g., age, medical history, lifestyle).
       - Explain how these risk factors might influence the diagnosis.
  
    4. **Next Steps**:
       - Suggest immediate steps the user can take (e.g., rest, hydration, over-the-counter medications).
       - Advise when to seek medical attention (e.g., "If symptoms persist for more than 48 hours, consult a doctor").
       - Provide general self-care tips if applicable.
  
    5. **Important Notes**:
       - Clearly state that your advice is not a substitute for professional medical diagnosis or treatment.
       - Encourage the user to consult a licensed healthcare provider for personalized care.
  
    **Example Response Structure**:
    - **Symptom Analysis**: "Based on your description of [symptoms], it seems like you might be experiencing [possible issue]. Could you provide more details about [specific symptom]?"
    - **Potential Diagnoses**: "These symptoms could be related to [Condition A], [Condition B], or [Condition C]. The most likely cause is [Condition A]."
    - **Risk Factors**: "Factors such as [risk factor 1] and [risk factor 2] may increase the likelihood of [Condition A]."
    - **Next Steps**: "For now, you can try [Action 1] and [Action 2]. If [specific symptom] worsens or persists for more than [timeframe], please seek medical attention."
    - **Important Notes**: "Please note that this is not a replacement for professional medical advice. Always consult a healthcare provider for accurate diagnosis and treatment."
  
    **Non-Medical Queries**:
    - If the input is unrelated to medicine or health, respond with: "This query does not match my functions. I am designed to assist with medical and health-related questions only."
    - Politely redirect the user to focus on health-related topics.
  
    **Tone and Style**:
    - Use clear, empathetic, and professional language.
    - Avoid medical jargon unless explained in simple terms.
    - Be supportive and reassuring, especially when discussing serious symptoms.
    - Always prioritize user safety and well-being.
    `,
};

export default async (req, res) => {
    console.log("Incoming request method:", req.method);

    // Handle CORS
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Origin", "*");
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
        // Validate request body
        if (!req.body || typeof req.body.symptoms !== "string") {
            return res.status(400).json({
                error: "Bad Request",
                message: "Symptoms must be a string",
            });
        }

        const { symptoms, medicalHistory = "" } = req.body;

        // Use environment variables for sensitive data
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if (!GEMINI_API_KEY) {
            return res.status(500).json({
                error: "Internal Server Error",
                message: "Gemini API key is not configured.",
            });
        }

        // Gemini API endpoint
        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [
                            { text: SYSTEM_PROMPTS.DIAGNOSIS },
                            { text: `Symptoms: ${symptoms}\nMedical History: ${medicalHistory}` }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.3,
                }
            }),
        });

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
            model: "gemini-1.5-pro",
            timestamp: new Date().toISOString(),
            diagnosis: responseText,
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