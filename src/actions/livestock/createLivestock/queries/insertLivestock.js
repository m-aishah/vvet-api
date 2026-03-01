const { submitQuery, getInsertId } = require("~root/lib/database");

const insertLivestock = ({
  farmId,
  categoryId,
  name,
  tagNumber,
  breed,
  ageMonths,
  weightKg,
  gender,
  birthDate,
  acquisitionDate,
  notes
}) => submitQuery`
  INSERT INTO livestock (
    farm_id,
    category_id,
    name,
    tag_number,
    breed,
    age_months,
    weight_kg,
    gender,
    birth_date,
    acquisition_date,
    notes,
    current_health_status
  ) VALUES (
    ${farmId},
    ${categoryId},
    ${name},
    ${tagNumber},
    ${breed},
    ${ageMonths},
    ${weightKg},
    ${gender},
    ${birthDate},
    ${acquisitionDate},
    ${notes},
    'healthy'
  )
`;

module.exports = getInsertId(insertLivestock);
