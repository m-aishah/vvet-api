const fetchLivestock = require("~root/actions/livestock/fetchLivestock");
const handleAPIError = require("~root/utils/handleAPIError");

const getLivestock = async (req, res) => {
  try {
    const { farmId } = req.params;
    const farmerId = req.user.userId;
    const { page = 1, limit = 10, category, healthStatus } = req.query;

    const { livestock, pagination } = await fetchLivestock({
      farmId: parseInt(farmId, 10),
      farmerId,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      category,
      healthStatus
    });

    res.json({
      livestock,
      pagination
    });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = getLivestock;
