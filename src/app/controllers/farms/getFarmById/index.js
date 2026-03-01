const fetchFarmById = require("~root/actions/farms/fetchFarmById");
const handleAPIError = require("~root/utils/handleAPIError");
const getFarmByIdSchema = require("./schemas/getFarmByIdSchema");

const getFarmById = async (req, res) => {
  try {
    const { farmId } = req.params;
    const farmerId = req.user.userId;
    await getFarmByIdSchema.validate({ farmId }, { abortEarly: false });
    const parsedFarmId = parseInt(farmId, 10);
    const { farm } = await fetchFarmById({ farmId: parsedFarmId, farmerId });
    if (!farm) {
      res.status(404).json({ message: "Farm not found" });
    }
    res.json({ farm });
  } catch (err) {
    handleAPIError(res, err);
  }
};
module.exports = getFarmById;
