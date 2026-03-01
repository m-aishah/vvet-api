const selectLivestockAdmin = require("./queries/selectLivestockAdmin");
const countLivestockAdmin = require("./queries/countLivestockAdmin");

const fetchLivestockAdmin = async ({
  page = 1,
  limit = 10,
  category,
  healthStatus,
  search,
  farmerId,
  farmId
}) => {
  const offset = (page - 1) * limit;
  const totalCount = await countLivestockAdmin({
    category,
    healthStatus,
    search,
    farmerId,
    farmId
  });
  const livestock = await selectLivestockAdmin({
    limit,
    offset,
    category,
    healthStatus,
    search,
    farmerId,
    farmId
  });
  const totalPages = Math.ceil(totalCount / limit);
  return {
    livestock,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      limit
    }
  };
};
module.exports = fetchLivestockAdmin;
