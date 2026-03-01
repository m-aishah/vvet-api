const { submitQuery } = require("~root/lib/database");

const insertSingleHealthFeature = async ({
  livestockId,
  featureId,
  featureValue
}) => {
  return submitQuery`
    INSERT INTO livestock_feature_values (livestock_id, feature_id, feature_value, recorded_at)
    VALUES (${livestockId}, ${featureId}, ${JSON.stringify(
    featureValue
  )}, CURRENT_TIMESTAMP)
    ON DUPLICATE KEY UPDATE 
      feature_value = VALUES(feature_value),
      recorded_at = CURRENT_TIMESTAMP
  `;
};

module.exports = insertSingleHealthFeature;
