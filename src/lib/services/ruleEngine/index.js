const axios = require("axios");

/**
 * Rule Engine Service
 * Handles communication with the external AI diagnosis rule engine
 */

const RULE_ENGINE_BASE_URL =
  process.env.RULE_ENGINE_API_URL || "https://api.ruleengine.example.com";
const API_KEY = process.env.RULE_ENGINE_API_KEY;

/**
 * Generate diagnosis for livestock based on health data
 * @param {Object} livestockData - Complete livestock information
 * @param {Object} healthFeatures - Health features and symptoms
 * @returns {Promise<Object>} Diagnosis response from rule engine
 */
const generateDiagnosis = async ({ livestockData, healthFeatures }) => {
  try {
    const requestPayload = {
      livestock: {
        category: livestockData.category_name,
        breed: livestockData.breed,
        age_months: livestockData.age_months,
        weight_kg: livestockData.weight_kg,
        gender: livestockData.gender
      },
      health_data: healthFeatures,
      timestamp: new Date().toISOString()
    };

    const response = await axios.post(
      `${RULE_ENGINE_BASE_URL}/v1/diagnose`,
      requestPayload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
          "X-API-Version": "1.0"
        },
        timeout: 30000 // 30 second timeout
      }
    );

    return {
      success: true,
      diagnosis: response.data.diagnosis,
      confidence_score: response.data.confidence_score,
      recommended_treatment: response.data.recommended_treatment,
      severity_level: response.data.severity_level,
      raw_response: response.data
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      "Rule Engine API Error:",
      (error.response && error.response.data) || error.message
    );

    // Return a fallback response structure
    return {
      success: false,
      error:
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message,
      diagnosis:
        "Unable to generate diagnosis - please consult with a veterinarian",
      confidence_score: 0.0,
      severity_level: "medium",
      raw_response: null
    };
  }
};

/**
 * Validate livestock health data before sending to rule engine
 * @param {Object} healthFeatures - Health features to validate
 * @returns {Object} Validation result
 */
const validateHealthData = healthFeatures => {
  const requiredFields = ["body_temperature", "symptoms_observed"];
  const missingFields = [];

  requiredFields.forEach(field => {
    if (!healthFeatures[field] || healthFeatures[field].trim() === "") {
      missingFields.push(field);
    }
  });

  return {
    isValid: missingFields.length === 0,
    missingFields,
    message:
      missingFields.length > 0
        ? `Missing required fields: ${missingFields.join(", ")}`
        : "Health data is valid"
  };
};

/**
 * Get rule engine health status
 * @returns {Promise<Object>} Health check response
 */
const getHealthStatus = async () => {
  try {
    const response = await axios.get(`${RULE_ENGINE_BASE_URL}/v1/health`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`
      },
      timeout: 5000
    });

    return {
      status: "healthy",
      response_time: response.headers["x-response-time"] || "unknown",
      version: response.data.version || "unknown"
    };
  } catch (error) {
    return {
      status: "unhealthy",
      error: error.message
    };
  }
};

module.exports = {
  generateDiagnosis,
  validateHealthData,
  getHealthStatus
};
