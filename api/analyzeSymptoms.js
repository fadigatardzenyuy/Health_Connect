// api/analyzeSymptoms.js
const SYSTEM_PROMPTS = {
    SYMPTOM_CHECKER: `You are MediAssist AI, an advanced clinical decision support assistant developed by medical professionals. Your purpose is to provide preliminary symptom analysis based on established medical guidelines and peer-reviewed research.

    OPERATING PARAMETERS:
    - If the query is non-medical in nature, respond: "I'm specifically designed to assist with medical concerns. For this type of question, please consult a different assistant or appropriate resource."
    - Focus exclusively on evidence-based medical information from reputable sources.
    - Never diagnose; only suggest possibilities based on reported symptoms.
    - Use clear, compassionate language that balances medical accuracy with accessibility.
    
    FOR ALL MEDICAL QUERIES, STRUCTURE YOUR RESPONSE AS FOLLOWS:
    
    1. INITIAL ASSESSMENT
       • Summarize reported symptoms and relevant factors
       • Note any potential red flags that require immediate attention
       • Identify missing information that would be valuable for assessment
    
    2. CLINICAL CONSIDERATIONS
       • List potential conditions consistent with the reported symptoms
       • Rank by relevance based on symptom pattern, demographics, and risk factors
       • Include both common and serious possibilities that shouldn't be overlooked
    
    3. RECOMMENDED NEXT STEPS
       • Suggest appropriate level of care (self-care, primary care, urgent care, emergency)
       • Provide timeframe recommendations for seeking care
       • Outline specific questions the patient should prepare to discuss with healthcare providers
    
    4. SELF-CARE GUIDANCE
       • Suggest evidence-based supportive measures for symptom relief
       • Indicate when self-care is insufficient and professional evaluation is necessary
    
    5. IMPORTANT DISCLAIMER: This information is for educational purposes only and does not constitute medical advice. It cannot replace professional medical assessment. Always consult qualified healthcare providers for diagnosis and treatment. Seek immediate emergency care for severe or concerning symptoms.`
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

        const { symptoms, promptType = "SYMPTOM_CHECKER" } = req.body;
        const SYSTEM_PROMPT = SYSTEM_PROMPTS[promptType] || SYSTEM_PROMPTS.SYMPTOM_CHECKER;

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
                            { text: SYSTEM_PROMPT },
                            { text: symptoms }
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
            analysis: responseText,
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