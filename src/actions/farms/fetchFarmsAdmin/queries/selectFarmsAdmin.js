const { submitQuery, camelKeys } = require("~root/lib/database");

const selectFarmsAdmin = ({
  limit,
  offset,
  farmType,
  isActive,
  search,
  farmerId
}) => {
  let query = submitQuery`    SELECT       f.farm_id,      f.farmer_id,      f.farm_name,      f.description,      f.address,      f.city,      f.state,      f.country,      f.postal_code,      f.latitude,      f.longitude,      f.total_area_hectares,      f.farm_type,      f.established_date,      f.is_active,      f.created_at,      f.updated_at,      COUNT(l.livestock_id) as livestock_count,      u.first_name as farmer_first_name,      u.last_name as farmer_last_name,      u.email as farmer_email    FROM farms f    LEFT JOIN livestock l ON f.farm_id = l.farm_id    LEFT JOIN users u ON f.farmer_id = u.user_id    WHERE 1=1  `;
  if (farmType) {
    query = submitQuery`${query} AND f.farm_type = ${farmType}`;
  }
  if (isActive !== undefined) {
    query = submitQuery`${query} AND f.is_active = ${isActive}`;
  }
  if (search) {
    query = submitQuery`${query} AND (      f.farm_name LIKE ${`%${search}%`} OR       f.description LIKE ${`%${search}%`} OR      f.address LIKE ${`%${search}%`} OR      u.first_name LIKE ${`%${search}%`} OR      u.last_name LIKE ${`%${search}%`}    )`;
  }
  if (farmerId) {
    query = submitQuery`${query} AND f.farmer_id = ${farmerId}`;
  }
  query = submitQuery`    ${query}    GROUP BY f.farm_id    ORDER BY f.updated_at DESC, f.created_at DESC    LIMIT ${limit} OFFSET ${offset}  `;
  return camelKeys(query)();
};
module.exports = selectFarmsAdmin;
