const { submitQuery, camelKeys, getFirst } = require("~root/lib/database");

const selectFarmById = ({ farmId, farmerId }) =>
  submitQuery`  SELECT     f.farm_id,    f.farmer_id,    f.farm_name,    f.description,    f.address,    f.city,    f.state,    f.country,    f.postal_code,    f.latitude,    f.longitude,    f.total_area_hectares,    f.farm_type,    f.established_date,    f.is_active,    f.created_at,    f.updated_at,    COUNT(l.livestock_id) as livestock_count  FROM farms f  LEFT JOIN livestock l ON f.farm_id = l.farm_id  WHERE f.farm_id = ${farmId}  AND f.farmer_id = ${farmerId}  GROUP BY f.farm_id`;
module.exports = getFirst(camelKeys(selectFarmById));
