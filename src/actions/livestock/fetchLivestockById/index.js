const selectLivestockById = require("./queries/selectLivestockById");
const selectLivestockHealthFeatures = require("./queries/selectLivestockHealthFeatures");
const validateFarmOwnership = require("./queries/validateFarmOwnership");

const fetchLivestockById = async ({ livestockId, farmId, farmerId }) => {
  // Validate that the farm belongs to the farmer
  const farmExists = await validateFarmOwnership({ farmId, farmerId });
  if (!farmExists) {
    throw new Error(
      "Farm not found or you do not have permission to access this farm"
    );
  }

  // Get basic livestock data
  const livestock = await selectLivestockById({
    livestockId,
    farmId
  });

  if (!livestock) {
    return { livestock: null };
  }

  // Get health features
  const healthFeatures = await selectLivestockHealthFeatures({
    livestockId
  });

  // Attach health features to livestock object
  livestock.healthFeatures = healthFeatures;

  return { livestock };
};

module.exports = fetchLivestockById;
