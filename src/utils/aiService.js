import { useToast } from "@/components/ui/use-toast";

const SYSTEM_PROMPTS = {
  SYMPTOM_CHECKER: `You are an AI medical assistant. Analyze the symptoms provided and suggest possible conditions. 
  Always include a disclaimer that this is not a replacement for professional medical advice. 
  Format your response in this structure:
  1. Initial Assessment
  2. Possible Conditions
  3. Recommended Actions
  4. Disclaimer`,

  DIAGNOSIS: `You are an AI medical assistant helping with diagnosis suggestions. 
  Based on the symptoms and any provided medical history, suggest possible diagnoses. 
  Always emphasize the importance of consulting a healthcare professional.
  Format your response in this structure:
  1. Symptom Analysis
  2. Potential Diagnoses
  3. Risk Factors
  4. Next Steps
  5. Important Notes`,

  TREATMENT: `You are an AI medical assistant providing treatment information. 
  Provide general treatment information and management strategies. 
  Always emphasize the importance of following a healthcare provider's specific instructions.
  Format your response in this structure:
  1. General Treatment Approaches
  2. Lifestyle Recommendations
  3. Warning Signs
  4. When to Seek Help
  5. Disclaimer`
};

export async function analyzeSymptoms(symptoms) {
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
            content: SYSTEM_PROMPTS.SYMPTOM_CHECKER,
          },
          {
            role: "user",
            content: symptoms,
          },
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error analyzing symptoms:", error);
    throw new Error("Failed to analyze symptoms. Please try again later.");
  }
}

export async function getDiagnosis(symptoms, medicalHistory = "") {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
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

export async function getTreatmentRecommendations(condition) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPTS.TREATMENT,
          },
          {
            role: "user",
            content: `Provide treatment information for: ${condition}`,
          },
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error getting treatment recommendations:", error);
    throw new Error("Failed to get treatment recommendations. Please try again later.");
  }
}