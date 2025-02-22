export async function getDiagnosis(symptoms, medicalHistory = "") {
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: SYSTEM_PROMPTS.DIAGNOSIS,
                    },
                    {
                        role: "user",
                        content: `Symptoms: ${symptoms}\nMedical History: ${medicalHistory}`,
                    },
                ],
                temperature: 0.3,
            }),
        });

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Error getting diagnosis:", error);
        throw new Error("Failed to get diagnosis. Please try again later.");
    }
}