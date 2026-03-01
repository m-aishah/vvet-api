const { submitQuery, camelKeys } = require("~root/lib/database");

const fetchVetDashboardStats = async ({ vetId }) => {
  // Get assigned verification requests count
  const assignedRequests = await submitQuery`
    SELECT COUNT(*) as count 
    FROM verification_requests 
    WHERE vet_id = ${vetId}
  `;

  // Get pending verification requests (assigned to this vet)
  const pendingRequests = await submitQuery`
    SELECT COUNT(*) as count 
    FROM verification_requests 
    WHERE vet_id = ${vetId} AND request_status IN ('assigned', 'in_review')
  `;

  // Get completed verification requests by this vet
  const completedRequests = await submitQuery`
    SELECT COUNT(*) as count 
    FROM verification_requests 
    WHERE vet_id = ${vetId} AND request_status = 'completed'
  `;

  // Get verification requests by status for this vet
  const requestsByStatus = await submitQuery`
    SELECT 
      request_status,
      COUNT(*) as count
    FROM verification_requests 
    WHERE vet_id = ${vetId}
    GROUP BY request_status
  `;

  // Get verification requests by urgency level
  const requestsByUrgency = await submitQuery`
    SELECT 
      urgency_level,
      COUNT(*) as count
    FROM verification_requests 
    WHERE vet_id = ${vetId}
    GROUP BY urgency_level
  `;

  // Get recent verification activity (last 30 days)
  const recentActivity = await submitQuery`
    SELECT 
      DATE(requested_at) as date,
      COUNT(*) as count
    FROM verification_requests
    WHERE vet_id = ${vetId}
    AND requested_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    GROUP BY DATE(requested_at)
    ORDER BY date DESC
    LIMIT 30
  `;

  // Get livestock categories this vet has worked with
  const categoriesWorked = await submitQuery`
    SELECT 
      lc.category_name,
      COUNT(*) as count
    FROM verification_requests vr
    INNER JOIN livestock l ON vr.livestock_id = l.livestock_id
    INNER JOIN livestock_categories lc ON l.category_id = lc.category_id
    WHERE vr.vet_id = ${vetId}
    GROUP BY lc.category_id, lc.category_name
    ORDER BY count DESC
  `;

  return {
    totalCounts: {
      assignedRequests: (assignedRequests[0] && assignedRequests[0].count) || 0,
      pendingRequests: (pendingRequests[0] && pendingRequests[0].count) || 0,
      completedRequests:
        (completedRequests[0] && completedRequests[0].count) || 0
    },
    requestsByStatus: camelKeys(requestsByStatus)(),
    requestsByUrgency: camelKeys(requestsByUrgency)(),
    categoriesWorked: camelKeys(categoriesWorked)(),
    recentActivity: camelKeys(recentActivity)()
  };
};

module.exports = fetchVetDashboardStats;
