const { submitQuery, getProperty } = require("~root/lib/database");

const countLivestock = async ({ farmId, category, healthStatus }) => {
  let query = submitQuery`
    SELECT COUNT(*) as total
    FROM livestock l
    LEFT JOIN livestock_categories lc ON l.category_id = lc.category_id
    WHERE l.farm_id = ${farmId}
  `;

  if (category) {
    query = submitQuery`${query} AND lc.category_name = ${category}`;
  }

  if (healthStatus) {
    query = submitQuery`${query} AND l.current_health_status = ${healthStatus}`;
  }

  return getProperty(query, "total", 0);
};

module.exports = countLivestock;
