const selectVerificationRequestsAdmin = require("./queries/selectVerificationRequestsAdmin");
const countVerificationRequestsAdmin = require("./queries/countVerificationRequestsAdmin");

const fetchVerificationRequestsAdmin = async ({
  page = 1,
  limit = 10,
  status,
  urgency,
  search
}) => {
  const offset = (page - 1) * limit;

  // Get total count for pagination
  const totalCount = await countVerificationRequestsAdmin({
    status,
    urgency,
    search
  });

  // Get verification requests data
  const verificationRequests = await selectVerificationRequestsAdmin({
    limit,
    offset,
    status,
    urgency,
    search
  });

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / limit);

  return {
    verificationRequests,
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

module.exports = fetchVerificationRequestsAdmin;
