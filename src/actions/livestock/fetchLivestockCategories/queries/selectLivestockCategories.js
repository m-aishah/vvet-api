const { submitQuery, camelKeys } = require("~root/lib/database");

const selectLivestockCategories = () => submitQuery`
  SELECT 
    category_id,
    category_name,
    description,
    created_at
  FROM livestock_categories
  ORDER BY category_name ASC
`;

module.exports = camelKeys(selectLivestockCategories);
