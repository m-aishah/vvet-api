const { submitQuery, camelKeys, getFirst } = require("~root/lib/database");

const selectCategoryById = ({ categoryId }) => submitQuery`
  SELECT 
    category_id,
    category_name,
    description
  FROM livestock_categories
  WHERE category_id = ${categoryId}
`;

module.exports = getFirst(camelKeys(selectCategoryById));
