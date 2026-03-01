const { submitQuery, getProperty } = require("~root/lib/database");

const countLivestockAdmin = async ({ category, healthStatus, search, farmerId, farmId }) => {
  let query = submitQuery`
    SELECT COUNT(*) as total
    FROM livestock l
    LEFT JOIN livestock_categories lc ON l.category_id = lc.category_id
    LEFT JOIN farms f ON l.farm_id = f.farm_id
    LEFT JOIN users u ON f.farmer_id = u.user_id
    WHERE 1=1
  `;

  if (category) {
    query = submitQuery`${query} AND lc.category_name = ${category}`;
  }
  
  if (healthStatus) {
    query = submitQuery`${query} AND l.current_health_status = ${healthStatus}`;
  }

  if (search) {
    query = submitQuery`${query} AND (
      l.name LIKE ${`%${search}%`} OR 
      l.tag_number LIKE ${`%${search}%`} OR
      f.farm_name LIKE ${`%${search}%`} OR
      u.first_name LIKE ${`%${search}%`} OR
      u.last_name LIKE ${`%${search}%`}
    )`;
  }

  if (farmerId) {
    query = submitQuery`${query} AND f.farmer_id = ${farmerId}`;
  }

  if (farmId) {
    query = submitQuery`${query} AND l.farm_id = ${farmId}`;
  }

  return getProperty(query, "total", 0);
};

module.exports = countLivestockAdmin;