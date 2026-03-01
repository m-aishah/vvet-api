const { submitQuery } = require("~root/lib/database");

const updateLivestockRecord = async ({
  livestockId,
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
  currentHealthStatus,
  notes
}) => {
  const result = await submitQuery`
    UPDATE livestock 
    SET 
      category_id = COALESCE(${categoryId}, category_id),
      name = COALESCE(${name}, name),
      tag_number = COALESCE(${tagNumber}, tag_number),
      breed = COALESCE(${breed}, breed),
      age_months = COALESCE(${ageMonths}, age_months),
      weight_kg = COALESCE(${weightKg}, weight_kg),
      gender = COALESCE(${gender}, gender),
      birth_date = COALESCE(${birthDate}, birth_date),
      acquisition_date = COALESCE(${acquisitionDate}, acquisition_date),
      current_health_status = COALESCE(${currentHealthStatus}, current_health_status),
      notes = COALESCE(${notes}, notes),
      updated_at = CURRENT_TIMESTAMP
    WHERE livestock_id = ${livestockId}
    AND farm_id = ${farmId}
  `;

  return result.affectedRows > 0;
};

module.exports = updateLivestockRecord;
