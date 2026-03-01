const selectLivestockCategories = require("./queries/selectLivestockCategories");

const fetchLivestockCategories = async () => {
  const categories = await selectLivestockCategories();

  return { categories };
};

module.exports = fetchLivestockCategories;
