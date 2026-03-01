const { submitQuery, camelKeys } = require("~root/lib/database");

const selectFarms = ({ farmerId, limit, offset, farmType, isActive }) => {
  let query = submitQuery`    
        SELECT       
            f.farm_id,      
            f.farmer_id,      
            f.farm_name,      
            f.description,      
            f.address,      
            f.city,      
            f.state,      
            f.country,      
            f.postal_code,      
            f.latitude,      
            f.longitude,      
            f.total_area_hectares,      
            f.farm_type,      
            f.established_date,      
            f.is_active,      
            f.created_at,      
            f.updated_at,      
            COUNT(l.livestock_id) as livestock_count    
                FROM farms f    LEFT JOIN livestock l ON f.farm_id = l.farm_id    
                WHERE f.farmer_id = ${farmerId}  `;
  if (farmType) {
    query = submitQuery`${query} AND f.farm_type = ${farmType}`;
  }
  if (isActive !== undefined) {
    query = submitQuery`${query} AND f.is_active = ${isActive}`;
  }
  query = submitQuery`    ${query}    GROUP BY f.farm_id    ORDER BY f.updated_at DESC, f.created_at DESC    LIMIT ${limit} OFFSET ${offset}  `;
  return camelKeys(query)();
};
module.exports = selectFarms;
