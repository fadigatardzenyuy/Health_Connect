const SYSTEM_PROMPTS = {
    SYMPTOM_CHECKER: `You are an AI medical assistant. Your role is to analyze symptoms and provide medical-related advice. 
    If the input is not related to medicine or health, respond with: "This query does not match my functions. I am designed to assist with medical and health-related questions only."
    For medical queries, follow this structure:
    1. Initial Assessment
    2. Possible Conditions
    3. Recommended Actions
    4. Disclaimer: This is not a replacement for professional medical advice.`,

    DIAGNOSIS: `You are an AI medical assistant helping with diagnosis suggestions. 
    If the input is not related to medicine or health, respond with: "This query does not match my functions. I am designed to assist with medical and health-related questions only."
    For medical queries, follow this structure:
    1. Symptom Analysis
    2. Potential Diagnoses
    3. Risk Factors
    4. Next Steps
    5. Important Notes: Always consult a healthcare professional for accurate diagnosis and treatment.`,

    TREATMENT: `You are an AI medical assistant providing treatment information. 
    If the input is not related to medicine or health, respond with: "This query does not match my functions. I am designed to assist with medical and health-related questions only."
    For medical queries, follow this structure:
    1. General Treatment Approaches
    2. Lifestyle Recommendations
    3. Warning Signs
    4. When to Seek Help
    5. Disclaimer: Always follow your healthcare provider's specific instructions.`
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

    const SYSTEM_PROMPT = SYSTEM_PROMPTS.SYMPTOM_CHECKER;

    try {
        // Validate request body
        if (!req.body || !req.body.symptoms) {
            return res.status(400).json({
                error: "Bad Request",
                message: "Symptoms are required",
            });
        }

        const { symptoms } = req.body;

        // Use environment variables for sensitive data
        const OPENAI_API_KEY = "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"; // Ensure this is set in your environment

        if (!OPENAI_API_KEY) {
            return res.status(500).json({
                error: "Internal Server Error",
                message: "OpenAI API key is not configured.",
            });
        }

        const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", // Ensure using a valid model
                messages: [
                    {
                        role: "system",
                        content: SYSTEM_PROMPT,
                    },
                    {
                        role: "user",
                        content: symptoms,
                    },
                ],
                temperature: 0.3,
            }),
        });

        // Check if OpenAI response is ok
        if (!openaiResponse.ok) {
            const errorData = await openaiResponse.json().catch(() => ({
                error: "OpenAI API error",
                message: openaiResponse.statusText,
            }));

            return res.status(openaiResponse.status).json(errorData);
        }

        const data = await openaiResponse.json();

        // Send successful response
        return res.status(200).json({
            success: true,
            analysis: data.choices[0].message.content,
        });
    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).json({
            error: "Internal Server Error",
            message: "Failed to process the request",
        });
    }
};