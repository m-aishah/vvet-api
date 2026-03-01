const {
  submitQuery,
  startTransaction,
  commitTransaction,
  rollbackTransaction
} = require("~root/lib/database");
const asyncParallel = require("~root/utils/asyncParallel");

const updateHealthFeatures = async ({ livestockId, healthFeatures }) => {
  const featureEntries = Object.entries(healthFeatures);

  if (featureEntries.length === 0) {
    return;
  }

  try {
    await startTransaction();

    await asyncParallel(featureEntries, async ([featureId, featureValue]) => {
      await submitQuery`
        INSERT INTO livestock_feature_values (livestock_id, feature_id, feature_value, recorded_at)
        VALUES (${livestockId}, ${featureId}, ${JSON.stringify(
        featureValue
      )}, CURRENT_TIMESTAMP)
        ON DUPLICATE KEY UPDATE 
          feature_value = VALUES(feature_value),
          recorded_at = CURRENT_TIMESTAMP
      `;
    });

    await commitTransaction();
  } catch (error) {
    await rollbackTransaction();
    throw error;
  }
};

module.exports = updateHealthFeatures;
