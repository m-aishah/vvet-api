const fetchFarms = require("~root/actions/farms/fetchFarms");
const handleAPIError = require("~root/utils/handleAPIError");

const getFarms = async (req, res) => {
  try {
    const farmerId = req.user.userId;
    const { page = 1, limit = 10, farmType, isActive } = req.query;
    let isActiveValue;

    if (isActive === "true") {
      isActiveValue = true;
    } else if (isActive === "false") {
      isActiveValue = false;
    }
    const { farms, pagination } = await fetchFarms({
      farmerId,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      farmType,
      isActive: isActiveValue
    });
    res.json({ farms, pagination });
  } catch (err) {
    handleAPIError(res, err);
  }
};
module.exports = getFarms;
