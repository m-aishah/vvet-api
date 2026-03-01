const { submitQuery, getProperty } = require("~root/lib/database");

const countVetsAdmin = async ({
  isActive,
  isVerified,
  search,
  specialization
}) => {
  let query = submitQuery`
    SELECT COUNT(*) as total
    FROM users u
    INNER JOIN vet_profiles vp ON u.user_id = vp.user_id
    INNER JOIN user_types ut ON u.user_type_id = ut.user_type_id
    WHERE ut.user_type = 'vet'
  `;

  if (isActive !== undefined) {
    query = submitQuery`${query} AND vp.verification_status = ${
      isActive ? "verified" : "pending"
    }`;
  }

  if (isVerified !== undefined) {
    query = submitQuery`${query} AND vp.verification_status = ${
      isVerified ? "verified" : "pending"
    }`;
  }

  if (search) {
    query = submitQuery`${query} AND (
      u.first_name LIKE ${`%${search}%`} OR 
      u.last_name LIKE ${`%${search}%`} OR
      u.email LIKE ${`%${search}%`} OR
      vp.license_number LIKE ${`%${search}%`}
    )`;
  }

  if (specialization) {
    query = submitQuery`${query} AND vp.specializations LIKE ${`%${specialization}%`}`;
  }

  return getProperty(query, "total", 0);
};

module.exports = countVetsAdmin;
