const createFarm = require("~root/actions/farms/createFarm");
const handleAPIError = require("~root/utils/handleAPIError");
const postFarmSchema = require("./schemas/postFarmSchema");

const postFarm = async (req, res) => {
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
    establishedDate
  } = req.body;
  const farmerId = req.user.userId;
  try {
    await postFarmSchema.validate(
      {
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
      },
      { abortEarly: false, context: { farmerId } }
    );
    const { farm } = await createFarm({
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
    res.status(201).json({ farm });
  } catch (err) {
    handleAPIError(res, err);
  }
};
module.exports = postFarm;
