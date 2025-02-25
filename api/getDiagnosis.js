// api/getDiagnosis.js
const SYSTEM_PROMPTS = {
    DIAGNOSIS: `You are an AI medical assistant helping with diagnosis suggestions. 
    If the input is not related to medicine or health, respond with: "This query does not match my functions. I am designed to assist with medical and health-related questions only."
    For medical queries, follow this structure:
    1. Symptom Analysis
    2. Potential Diagnoses
    3. Risk Factors
    4. Next Steps
    5. Important Notes: Always consult a healthcare professional for accurate diagnosis and treatment.`,
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