const { submitQuery, camelKeys } = require("~root/lib/database");

const selectVerificationRequestsAdmin = ({
  limit,
  offset,
  status,
  urgency,
  search
}) => {
  let query = submitQuery`
    SELECT 
      vr.verification_request_id,
      vr.farm_id,
      vr.vet_id,
      vr.livestock_id,
      vr.diagnosis_id,
      vr.request_status,
      vr.urgency_level,
      vr.farmer_notes,
      vr.requested_at,
      vr.assigned_at,
      vr.completed_at,
      f.farm_name,
      l.name as livestock_name,
      l.tag_number as livestock_tag,
      u_farmer.first_name as farmer_first_name,
      u_farmer.last_name as farmer_last_name,
      u_farmer.email as farmer_email,
      u_vet.first_name as vet_first_name,
      u_vet.last_name as vet_last_name,
      u_vet.email as vet_email
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

  query = submitQuery`
    ${query}
    ORDER BY vr.requested_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  return camelKeys(query)();
};

module.exports = selectVerificationRequestsAdmin;
