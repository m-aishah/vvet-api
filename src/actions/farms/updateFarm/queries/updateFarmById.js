const { submitQuery } = require("~root/lib/database");

const updateFarmById = ({
  farmId,
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
  establishedDate,
  isActive
}) => {
  return submitQuery`
    UPDATE farms 
    SET 
      farm_name = COALESCE(${farmName}, farm_name),
      description = COALESCE(${description}, description),
      address = COALESCE(${address}, address),
      city = COALESCE(${city}, city),
      state = COALESCE(${state}, state),
      country = COALESCE(${country}, country),
      postal_code = COALESCE(${postalCode}, postal_code),
      latitude = COALESCE(${latitude}, latitude),
      longitude = COALESCE(${longitude}, longitude),
      total_area_hectares = COALESCE(${totalAreaHectares}, total_area_hectares),
      farm_type = COALESCE(${farmType}, farm_type),
      established_date = COALESCE(${establishedDate}, established_date),
      is_active = COALESCE(${isActive}, is_active),
      updated_at = NOW()
    WHERE farm_id = ${farmId}
    AND farmer_id = ${farmerId}
  `;
};

module.exports = updateFarmById;