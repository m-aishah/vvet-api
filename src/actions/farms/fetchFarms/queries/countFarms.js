const { submitQuery } = require("~root/lib/database");

const countFarms = async ({ farmerId, farmType, isActive }) => {
  let query = submitQuery`
      SELECT COUNT(*) as total
          FROM farms f
              WHERE f.farmer_id = ${farmerId}
    `;
  if (farmType) {
    query = submitQuery`${query} AND f.farm_type = ${farmType}`;
  }
  if (isActive !== undefined) {
    query = submitQuery`${query} AND f.is_active = ${isActive}`;
  }
  const result = await query;
  return (result[0] && result[0].total) || 0;
};
module.exports = countFarms;
