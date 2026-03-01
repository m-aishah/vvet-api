const { submitQuery, camelKeys } = require("~root/lib/database");

const selectLivestockFeatures = ({ categoryId }) => submitQuery`
  SELECT 
    lf.feature_id,
    lf.category_id,
    lf.feature_name,
    lf.feature_type,
    lf.feature_options,
    lf.is_required,
    lf.display_order,
    lf.created_at,
    lc.category_name
  FROM livestock_features lf
  LEFT JOIN livestock_categories lc ON lf.category_id = lc.category_id
  WHERE lf.category_id = ${categoryId}
  ORDER BY lf.display_order ASC, lf.feature_name ASC
`;

module.exports = camelKeys(selectLivestockFeatures);
