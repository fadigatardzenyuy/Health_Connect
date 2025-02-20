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
console.log(import.meta.env.VITE_OPENAI_API_KEY);

export async function analyzeSymptoms(symptoms) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Use "gpt-4" or "gpt-4-turbo" depending on your access
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPTS.SYMPTOM_CHECKER, // Ensure SYSTEM_PROMPTS is defined
          },
          {
            role: "user",
            content: symptoms,
          },
        ],
        temperature: 0.3, // Adjust temperature for more deterministic responses
      }),
    });

    // Check if the response is OK (status code 200-299)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `API request failed with status ${response.status}: ${errorData.error?.message || "Unknown error"}`
      );
    }

    const data = await response.json();
    // Return the assistant's response
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
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
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
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Adjusted model name to a correct one
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

    // Check if the response is OK (status code 200-299)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error: ${errorData.error.message || "Something went wrong"}`);
    }

    const data = await response.json();

    // Check if choices are available
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    } else {
      throw new Error("No treatment recommendations found.");
    }
  } catch (error) {
    console.error("Error getting treatment recommendations:", error);
    throw new Error("Failed to get treatment recommendations. Please try again later.");
  }
}