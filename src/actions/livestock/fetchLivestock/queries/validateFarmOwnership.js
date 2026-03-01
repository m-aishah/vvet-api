const { submitQuery, getProperty } = require("~root/lib/database");

const validateFarmOwnership = async ({ farmId, farmerId }) => {
  const query = submitQuery`
    SELECT COUNT(*) as count
    FROM farms 
    WHERE farm_id = ${farmId}
    AND farmer_id = ${farmerId}
    AND is_active = TRUE
  `;
  
  const count = await getProperty(query, "count", 0);
  return count > 0;
};

module.exports = validateFarmOwnership;