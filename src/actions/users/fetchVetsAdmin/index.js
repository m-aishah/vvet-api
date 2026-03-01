const selectVetsAdmin = require("./queries/selectVetsAdmin");
const countVetsAdmin = require("./queries/countVetsAdmin");

const fetchVetsAdmin = async ({
  page = 1,
  limit = 10,
  isActive,
  isVerified,
  search,
  specialization
}) => {
  const offset = (page - 1) * limit;

  // Get total count for pagination
  const totalCount = await countVetsAdmin({
    isActive,
    isVerified,
    search,
    specialization
  });

  // Get vets data
  const vets = await selectVetsAdmin({
    limit,
    offset,
    isActive,
    isVerified,
    search,
    specialization
  });

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / limit);

  return {
    vets,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null
    }
  };
};

module.exports = fetchVetsAdmin;
