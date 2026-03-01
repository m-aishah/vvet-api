const createLivestock = require("~root/actions/livestock/createLivestock");
const handleAPIError = require("~root/utils/handleAPIError");
const postLivestockSchema = require("./schemas/postLivestockSchema");

const postLivestock = async (req, res) => {
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
    notes,
    healthFeatures = {}
  } = req.body;

  const { farmId } = req.params;
  const farmerId = req.user.userId;

  try {
    await postLivestockSchema.validate(
      {
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
        healthFeatures
      },
      {
        abortEarly: false,
        context: { farmId: parseInt(farmId, 10) }
      }
    );

    const { livestock } = await createLivestock({
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
      notes,
      healthFeatures
    });

    res.status(201).json({
      livestock
    });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = postLivestock;
