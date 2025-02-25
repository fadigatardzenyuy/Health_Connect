import { useToast } from "@/components/ui/use-toast";

// api/medicalServices.js

/**
 * Analyzes symptoms and returns a medical assessment
 * @param {string} symptoms - User's symptoms description
 * @returns {Promise<string>} Analysis result
 */
export async function analyzeSymptoms(symptoms) {
  try {
    const response = await fetch("http://localhost:3000/api/analyzeSymptoms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ symptoms }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.analysis;
  } catch (error) {
    console.error("Error analyzing symptoms:", error);
    throw error;
  }
}

/**
 * Gets diagnosis suggestions based on symptoms and medical history
 * @param {string} symptoms - User's symptoms description
 * @param {string} medicalHistory - Optional medical history
 * @returns {Promise<string>} Diagnosis information
 */
export async function getDiagnosis(symptoms, medicalHistory = "") {
  try {
    const response = await fetch("http://localhost:3000/api/getDiagnosis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ symptoms, medicalHistory }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.diagnosis;
  } catch (error) {
    console.error("Error getting diagnosis:", error);
    throw error;
  }
}

/**
 * Gets treatment recommendations for a specific medical condition
 * @param {string} condition - The medical condition to get treatments for
 * @returns {Promise<string>} Treatment recommendations
 */
export async function getTreatmentRecommendations(condition) {
  try {
    const response = await fetch("http://localhost:3000/api/getTreatmentRecommendations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ condition }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.treatment;
  } catch (error) {
    console.error("Error getting treatment recommendations:", error);
    throw error;
  }
}