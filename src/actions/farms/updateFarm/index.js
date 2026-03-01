const updateFarmById = require("./queries/updateFarmById");
const selectFarmById = require("./queries/selectFarmById");

const updateFarm = async ({
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
  await updateFarmById({
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
  });
  const farm = await selectFarmById({ farmId, farmerId });
  return { farm };
};
module.exports = updateFarm;
