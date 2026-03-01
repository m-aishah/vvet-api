const selectLivestockFeatures = require("./queries/selectLivestockFeatures");

const fetchLivestockFeatures = async ({ categoryId }) => {
  const features = await selectLivestockFeatures({ categoryId });

  return { features };
};

module.exports = fetchLivestockFeatures;
