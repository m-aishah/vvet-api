const { submitQuery, camelKeys } = require("~root/lib/database");

const selectLivestockHealthFeatures = ({ livestockId }) => submitQuery`
  SELECT 
    lfv.value_id,
    lfv.livestock_id,
    lfv.feature_id,
    lfv.feature_value,
    lfv.recorded_at,
    lf.feature_name,
    lf.feature_type,
    lf.feature_options,
    lf.is_required,
    lf.display_order
  FROM livestock_feature_values lfv
  LEFT JOIN livestock_features lf ON lfv.feature_id = lf.feature_id
  WHERE lfv.livestock_id = ${livestockId}
  ORDER BY lf.display_order ASC, lf.feature_name ASC
`;

module.exports = camelKeys(selectLivestockHealthFeatures);
