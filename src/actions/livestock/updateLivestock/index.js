const updateLivestockRecord = require("./queries/updateLivestockRecord");
const updateHealthFeatures = require("./queries/updateHealthFeatures");
const selectLivestockById = require("./queries/selectLivestockById");
const selectLivestockHealthFeatures = require("./queries/selectLivestockHealthFeatures");
const validateFarmOwnership = require("./queries/validateFarmOwnership");

const updateLivestock = async ({
  livestockId,
  farmId,
  farmerId,
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
  notes,
  healthFeatures = {}
}) => {
  // Validate that the farm belongs to the farmer
  const farmExists = await validateFarmOwnership({ farmId, farmerId });
  if (!farmExists) {
    throw new Error(
      "Farm not found or you do not have permission to access this farm"
    );
  }

  // Update livestock basic data
  const updated = await updateLivestockRecord({
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
  });

  if (!updated) {
    return { livestock: null };
  }

  // Update health features if provided
  if (Object.keys(healthFeatures).length > 0) {
    await updateHealthFeatures({
      livestockId,
      healthFeatures
    });
  }

  // Get updated livestock data
  const livestock = await selectLivestockById({
    livestockId,
    farmId
  });

  if (livestock) {
    // Get health features
    const healthFeaturesData = await selectLivestockHealthFeatures({
      livestockId
    });
    livestock.healthFeatures = healthFeaturesData;
  }

  return { livestock };
};

module.exports = updateLivestock;
