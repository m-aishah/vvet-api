const selectFarmById = require("./queries/selectFarmById");

const fetchFarmById = async ({ farmId, farmerId }) => {
  const farm = await selectFarmById({ farmId, farmerId });
  return { farm };
};
module.exports = fetchFarmById;
