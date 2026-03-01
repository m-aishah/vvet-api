const fetchLivestockFeatures = require("~root/actions/livestock/fetchLivestockFeatures");
const handleAPIError = require("~root/utils/handleAPIError");
const getLivestockFeaturesSchema = require("./schemas/getLivestockFeaturesSchema");

const getLivestockFeatures = async (req, res) => {
  try {
    const { categoryId } = req.params;

    await getLivestockFeaturesSchema.validate(
      {
        categoryId
      },
      {
        abortEarly: false
      }
    );

    const parsedCategoryId = parseInt(categoryId, 10);

    const { features } = await fetchLivestockFeatures({
      categoryId: parsedCategoryId
    });

    res.json({
      features
    });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = getLivestockFeatures;
