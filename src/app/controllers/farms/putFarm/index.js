const updateFarm = require("~root/actions/farms/updateFarm");
const handleAPIError = require("~root/utils/handleAPIError");
const putFarmSchema = require("./schemas/putFarmSchema");

const putFarm = async (req, res) => {
  const {
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
  } = req.body;
  const { farmId } = req.params;
  const farmerId = req.user.userId;
  try {
    await putFarmSchema.validate(
      {
        farmId,
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
      },
      { abortEarly: false, context: { farmerId, farmId: parseInt(farmId, 10) } }
    );
    const parsedFarmId = parseInt(farmId, 10);
    const { farm } = await updateFarm({
      farmId: parsedFarmId,
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
    if (!farm) {
      res.status(404).json({ message: "Farm not found" });
    }
    res.json({ farm });
  } catch (err) {
    handleAPIError(res, err);
  }
};
module.exports = putFarm;
