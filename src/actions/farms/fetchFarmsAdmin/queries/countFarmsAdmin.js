const { submitQuery, getProperty } = require("~root/lib/database");

const countFarmsAdmin = async ({ farmType, isActive, search, farmerId }) => {
  let query = submitQuery`
    SELECT COUNT(*) as total
    FROM farms f
    LEFT JOIN users u ON f.farmer_id = u.user_id
    WHERE 1=1
  `;

  if (farmType) {
    query = submitQuery`${query} AND f.farm_type = ${farmType}`;
  }
  
  if (isActive !== undefined) {
    query = submitQuery`${query} AND f.is_active = ${isActive}`;
  }

  if (search) {
    query = submitQuery`${query} AND (
      f.farm_name LIKE ${`%${search}%`} OR 
      f.description LIKE ${`%${search}%`} OR
      f.address LIKE ${`%${search}%`} OR
      u.first_name LIKE ${`%${search}%`} OR
      u.last_name LIKE ${`%${search}%`}
    )`;
  }

  if (farmerId) {
    query = submitQuery`${query} AND f.farmer_id = ${farmerId}`;
  }

  return getProperty(query, "total", 0);
};

module.exports = countFarmsAdmin;