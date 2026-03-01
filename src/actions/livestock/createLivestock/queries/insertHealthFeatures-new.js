const insertSingleHealthFeature = require("./insertSingleHealthFeature");

// This function is kept for backward compatibility but should ideally be removed
// Controllers should handle batch operations with asyncParallel and transactions
const insertHealthFeatures = async ({ livestockId, healthFeatures }) => {
  const featureEntries = Object.entries(healthFeatures);

  if (featureEntries.length === 0) {
    return;
  }

  // Simple sequential insertion for single features
  // In practice, controllers should handle batching with asyncParallel + transactions
  for (const [featureId, featureValue] of featureEntries) {
    await insertSingleHealthFeature({ livestockId, featureId, featureValue });
  }
};

module.exports = insertHealthFeatures;
