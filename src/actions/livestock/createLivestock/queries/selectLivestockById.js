const { submitQuery, camelKeys, getFirst } = require("~root/lib/database");

const selectLivestockById = ({ livestockId, farmId }) => submitQuery`
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
  WHERE l.livestock_id = ${livestockId}
  AND l.farm_id = ${farmId}
`;

module.exports = getFirst(camelKeys(selectLivestockById));
