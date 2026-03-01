const { submitQuery, getProperty } = require("~root/lib/database");

const countVerificationRequestsAdmin = async ({ status, urgency, search }) => {
  let query = submitQuery`
    SELECT COUNT(*) as total
    FROM verification_requests vr
    INNER JOIN farms f ON vr.farm_id = f.farm_id
    INNER JOIN livestock l ON vr.livestock_id = l.livestock_id
    INNER JOIN users u_farmer ON f.farmer_id = u_farmer.user_id
    LEFT JOIN users u_vet ON vr.vet_id = u_vet.user_id
    WHERE 1=1
  `;

  if (status) {
    query = submitQuery`${query} AND vr.request_status = ${status}`;
  }

  if (urgency) {
    query = submitQuery`${query} AND vr.urgency_level = ${urgency}`;
  }

  if (search) {
    query = submitQuery`${query} AND (
      f.farm_name LIKE ${`%${search}%`} OR 
      l.name LIKE ${`%${search}%`} OR
      l.tag_number LIKE ${`%${search}%`} OR
      u_farmer.first_name LIKE ${`%${search}%`} OR
      u_farmer.last_name LIKE ${`%${search}%`}
    )`;
  }

  return getProperty(query, "total", 0);
};

module.exports = countVerificationRequestsAdmin;
