const insertLivestock = require("./queries/insertLivestock");
const insertHealthFeatures = require("./queries/insertHealthFeatures");
const selectLivestockById = require("./queries/selectLivestockById");
const validateFarmOwnership = require("./queries/validateFarmOwnership");

const createLivestock = async ({
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

  // Insert livestock record
  const livestockId = await insertLivestock({
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
    notes
  });

  // Insert health features if provided
  if (Object.keys(healthFeatures).length > 0) {
    await insertHealthFeatures({
      livestockId,
      healthFeatures
    });
  }

  // Get the complete livestock record
  const livestock = await selectLivestockById({
    livestockId,
    farmId
  });

  return { livestock };
};

module.exports = createLivestock;
