const { submitQuery, camelKeys } = require("~root/lib/database");

const selectLivestockAdmin = ({
  limit,
  offset,
  category,
  healthStatus,
  search,
  farmerId,
  farmId
}) => {
  let query = submitQuery`    SELECT       l.livestock_id,      l.farm_id,      l.category_id,      l.name,      l.tag_number,      l.breed,      l.age_months,      l.weight_kg,      l.gender,      l.birth_date,      l.acquisition_date,      l.current_health_status,      l.notes,      l.created_at,      l.updated_at,      lc.category_name,      lc.description as category_description,      f.farm_name,      f.farmer_id,      u.first_name as farmer_first_name,      u.last_name as farmer_last_name,      u.email as farmer_email    FROM livestock l    LEFT JOIN livestock_categories lc ON l.category_id = lc.category_id    LEFT JOIN farms f ON l.farm_id = f.farm_id    LEFT JOIN users u ON f.farmer_id = u.user_id    WHERE 1=1  `;
  if (category) {
    query = submitQuery`${query} AND lc.category_name = ${category}`;
  }
  if (healthStatus) {
    query = submitQuery`${query} AND l.current_health_status = ${healthStatus}`;
  }
  if (search) {
    query = submitQuery`${query} AND (      l.name LIKE ${`%${search}%`} OR       l.tag_number LIKE ${`%${search}%`} OR      f.farm_name LIKE ${`%${search}%`} OR      u.first_name LIKE ${`%${search}%`} OR      u.last_name LIKE ${`%${search}%`}    )`;
  }
  if (farmerId) {
    query = submitQuery`${query} AND f.farmer_id = ${farmerId}`;
  }
  if (farmId) {
    query = submitQuery`${query} AND l.farm_id = ${farmId}`;
  }
  query = submitQuery`    ${query}    ORDER BY l.updated_at DESC, l.created_at DESC    LIMIT ${limit} OFFSET ${offset}  `;
  return camelKeys(query)();
};
module.exports = selectLivestockAdmin;
