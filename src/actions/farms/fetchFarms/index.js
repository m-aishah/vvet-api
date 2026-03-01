const selectFarms = require("./queries/selectFarms");
const countFarms = require("./queries/countFarms");

const fetchFarms = async ({
  farmerId,
  page = 1,
  limit = 10,
  farmType,
  isActive
}) => {
  const offset = (page - 1) * limit;
  const totalCount = await countFarms({ farmerId, farmType, isActive });
  const farms = await selectFarms({
    farmerId,
    limit,
    offset,
    farmType,
    isActive
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
module.exports = fetchFarms;
