const fetchLivestockById = require("~root/actions/livestock/fetchLivestockById");
const handleAPIError = require("~root/utils/handleAPIError");
const getLivestockByIdSchema = require("./schemas/getLivestockByIdSchema");

const getLivestockById = async (req, res) => {
  try {
    const { farmId, livestockId } = req.params;
    const farmerId = req.user.userId;

    await getLivestockByIdSchema.validate(
      {
        livestockId
      },
      {
        abortEarly: false
      }
    );

    const parsedLivestockId = parseInt(livestockId, 10);

    const { livestock } = await fetchLivestockById({
      livestockId: parsedLivestockId,
      farmId: parseInt(farmId, 10),
      farmerId
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

module.exports = getLivestockById;
