const removeLivestock = require("~root/actions/livestock/removeLivestock");
const handleAPIError = require("~root/utils/handleAPIError");
const deleteLivestockSchema = require("./schemas/deleteLivestockSchema");

const deleteLivestock = async (req, res) => {
  try {
    const { farmId, livestockId } = req.params;
    const farmerId = req.user.userId;

    await deleteLivestockSchema.validate(
      {
        livestockId
      },
      {
        abortEarly: false
      }
    );

    const parsedLivestockId = parseInt(livestockId, 10);

    const { deleted } = await removeLivestock({
      livestockId: parsedLivestockId,
      farmId: parseInt(farmId, 10),
      farmerId
    });

    if (!deleted) {
      res.status(404).json({ message: "Livestock not found" });
    }

    res.status(204).send();
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = deleteLivestock;
