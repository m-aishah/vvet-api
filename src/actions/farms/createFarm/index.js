const insertFarm = require("./queries/insertFarm");
const selectFarmById = require("./queries/selectFarmById");

const createFarm = async ({
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
}) => {
  const farmId = await insertFarm({
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
  });
  const farm = await selectFarmById({ farmId, farmerId });
  return { farm };
};
module.exports = createFarm;
