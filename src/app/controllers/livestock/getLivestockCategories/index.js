const fetchLivestockCategories = require("~root/actions/livestock/fetchLivestockCategories");
const handleAPIError = require("~root/utils/handleAPIError");

const getLivestockCategories = async (req, res) => {
  try {
    const { categories } = await fetchLivestockCategories();

    res.json({
      categories
    });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = getLivestockCategories;
