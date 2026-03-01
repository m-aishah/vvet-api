const deleteLivestockRecord = require("./queries/deleteLivestockRecord");
const validateFarmOwnership = require("./queries/validateFarmOwnership");

const removeLivestock = async ({ livestockId, farmId, farmerId }) => {
  // Validate that the farm belongs to the farmer
  const farmExists = await validateFarmOwnership({ farmId, farmerId });
  if (!farmExists) {
    throw new Error(
      "Farm not found or you do not have permission to access this farm"
    );
  }

  const deleted = await deleteLivestockRecord({
    livestockId,
    farmId
  });

  return { deleted };
};

module.exports = removeLivestock;
