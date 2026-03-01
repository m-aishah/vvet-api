const updateLivestock = require("~root/actions/livestock/updateLivestock");
const handleAPIError = require("~root/utils/handleAPIError");
const putLivestockSchema = require("./schemas/putLivestockSchema");

const putLivestock = async (req, res) => {
  const {
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
  } = req.body;

  const { farmId, livestockId } = req.params;
  const farmerId = req.user.userId;

  try {
    await putLivestockSchema.validate(
      {
        livestockId,
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
        healthFeatures
      },
      {
        abortEarly: false,
        context: {
          farmId: parseInt(farmId, 10),
          livestockId: parseInt(livestockId, 10)
        }
      }
    );

    const parsedLivestockId = parseInt(livestockId, 10);

    const { livestock } = await updateLivestock({
      livestockId: parsedLivestockId,
      farmId: parseInt(farmId, 10),
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
      healthFeatures
    });

    if (!livestock) {
      res.status(404).json({ message: "Livestock not found" });
    }

    res.json({
      livestock
    });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = putLivestock;
