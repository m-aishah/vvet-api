const selectFarmsAdmin = require("./queries/selectFarmsAdmin");
const countFarmsAdmin = require("./queries/countFarmsAdmin");

const fetchFarmsAdmin = async ({
  page = 1,
  limit = 10,
  farmType,
  isActive,
  search,
  farmerId
}) => {
  const offset = (page - 1) * limit;
  const totalCount = await countFarmsAdmin({
    farmType,
    isActive,
    search,
    farmerId
  });
  const farms = await selectFarmsAdmin({
    limit,
    offset,
    farmType,
    isActive,
    search,
    farmerId
  });
  const totalPages = Math.ceil(totalCount / limit);
  return {
    farms,
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
module.exports = fetchFarmsAdmin;
