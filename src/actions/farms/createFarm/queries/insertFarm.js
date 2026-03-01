const { submitQuery, getInsertId } = require("~root/lib/database");

const insertFarm = ({
  farmerId,
  farmName,
  description,
  address,
  city,
  state,
  country,
  postalCode,
  latitude,
  longitude,
  totalAreaHectares,
  farmType,
  establishedDate
}) =>
  submitQuery`  INSERT INTO farms (    farmer_id,    farm_name,    description,    address,    city,    state,    country,    postal_code,    latitude,    longitude,    total_area_hectares,    farm_type,    established_date,    is_active  ) VALUES (    ${farmerId},    ${farmName},    ${description},    ${address},    ${city},    ${state},    ${country},    ${postalCode},    ${latitude},    ${longitude},    ${totalAreaHectares},    ${farmType ||
    "mixed"},    ${establishedDate},    TRUE  )`;
module.exports = getInsertId(insertFarm);
