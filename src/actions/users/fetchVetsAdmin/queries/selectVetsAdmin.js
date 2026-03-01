const { submitQuery, camelKeys } = require("~root/lib/database");

const selectVetsAdmin = ({
  limit,
  offset,
  isActive,
  isVerified,
  search,
  specialization
}) => {
  let query = submitQuery`
    SELECT 
      u.user_id,
      u.first_name,
      u.last_name,
      u.email,
      u.phone,
      u.address,
      u.created_at,
      u.updated_at,
      vp.vet_profile_id,
      vp.license_number,
      vp.specializations,
      vp.years_experience,
      vp.latitude,
      vp.longitude,
      vp.city,
      vp.state,
      vp.country,
      vp.postal_code,
      vp.consultation_fee,
      vp.availability_status,
      vp.verification_status
    FROM users u
    INNER JOIN vet_profiles vp ON u.user_id = vp.user_id
    INNER JOIN user_types ut ON u.user_type_id = ut.user_type_id
    WHERE ut.user_type = 'vet'
  `;

  if (isActive !== undefined) {
    // Assuming active means verified
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

  query = submitQuery`
    ${query}
    ORDER BY u.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  return camelKeys(query)();
};

module.exports = selectVetsAdmin;
