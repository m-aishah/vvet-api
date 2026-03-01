const { submitQuery, camelKeys } = require("~root/lib/database");

const selectLivestock = ({ farmId, limit, offset, category, healthStatus }) => {
  let query = submitQuery`
    SELECT 
      l.livestock_id,
      l.farm_id,
      l.category_id,
      l.name,
      l.tag_number,
      l.breed,
      l.age_months,
      l.weight_kg,
      l.gender,
      l.birth_date,
      l.acquisition_date,
      l.current_health_status,
      l.notes,
      l.created_at,
      l.updated_at,
      lc.category_name,
      lc.description as category_description,
      f.farm_name,
      f.farmer_id
    FROM livestock l
    LEFT JOIN livestock_categories lc ON l.category_id = lc.category_id
    LEFT JOIN farms f ON l.farm_id = f.farm_id
    WHERE l.farm_id = ${farmId}
  `;

  if (category) {
    query = submitQuery`${query} AND lc.category_name = ${category}`;
  }

  if (healthStatus) {
    query = submitQuery`${query} AND l.current_health_status = ${healthStatus}`;
  }

  query = submitQuery`
    ${query}
    ORDER BY l.updated_at DESC, l.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  return camelKeys(query)();
};

module.exports = selectLivestock;
