const removeFarm = require("~root/actions/farms/removeFarm");
const handleAPIError = require("~root/utils/handleAPIError");
const deleteFarmSchema = require("./schemas/deleteFarmSchema");

const deleteFarm = async (req, res) => {
  try {
    const { farmId } = req.params;
    const farmerId = req.user.userId;
    await deleteFarmSchema.validate({ farmId }, { abortEarly: false });
    const parsedFarmId = parseInt(farmId, 10);
    const { deleted } = await removeFarm({ farmId: parsedFarmId, farmerId });
    if (!deleted) {
      res.status(404).json({ message: "Farm not found" });
    }
    res.status(204).send();
  } catch (err) {
    handleAPIError(res, err);
  }
};
module.exports = deleteFarm;
