const selectLivestock = require("./queries/selectLivestock");
const countLivestock = require("./queries/countLivestock");
const validateFarmOwnership = require("./queries/validateFarmOwnership");

const fetchLivestock = async ({
  farmId,
  farmerId,
  page = 1,
  limit = 10,
  category,
  healthStatus
}) => {
  // Validate that the farm belongs to the farmer
  const farmExists = await validateFarmOwnership({ farmId, farmerId });
  if (!farmExists) {
    throw new Error(
      "Farm not found or you do not have permission to access this farm"
    );
  }

  const offset = (page - 1) * limit;

  // Get total count for pagination
  const totalCount = await countLivestock({
    farmId,
    category,
    healthStatus
  });

  // Get livestock data
  const livestock = await selectLivestock({
    farmId,
    limit,
    offset,
    category,
    healthStatus
  });

  // Calculate pagination info
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

module.exports = fetchLivestock;
