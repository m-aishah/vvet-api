const deleteFarmById = require("./queries/deleteFarmById");
const selectFarmById = require("./queries/selectFarmById");

const removeFarm = async ({ farmId, farmerId }) => {
  const farm = await selectFarmById({ farmId, farmerId });
  if (!farm) {
    throw new Error(
      "Farm not found or you do not have permission to delete this farm"
    );
  }
  await deleteFarmById({ farmId, farmerId });
  return { message: "Farm deleted successfully", deletedFarm: farm };
};
module.exports = removeFarm;
