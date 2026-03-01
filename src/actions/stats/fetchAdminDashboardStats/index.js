const { submitQuery, camelKeys } = require("~root/lib/database");

const fetchAdminDashboardStats = async () => {
  // Get total counts for different entities
  const totalUsers = await submitQuery`
    SELECT COUNT(*) as count FROM users
  `;

  const totalFarms = await submitQuery`
    SELECT COUNT(*) as count FROM farms
  `;

  const totalLivestock = await submitQuery`
    SELECT COUNT(*) as count FROM livestock
  `;

  const totalVets = await submitQuery`
    SELECT COUNT(DISTINCT u.user_id) as count 
    FROM users u
    INNER JOIN user_types ut ON u.user_type_id = ut.user_type_id 
    WHERE ut.user_type = 'vet'
  `;

  const verificationRequests = await submitQuery`
    SELECT COUNT(*) as count FROM verification_requests 
    WHERE request_status = 'pending'
  `;

  // Get livestock by health status
  const livestockByHealth = await submitQuery`
    SELECT 
      current_health_status,
      COUNT(*) as count
    FROM livestock 
    GROUP BY current_health_status
  `;

  // Get farms by type
  const farmsByType = await submitQuery`
    SELECT 
      farm_type,
      COUNT(*) as count
    FROM farms 
    GROUP BY farm_type
  `;

  // Get recent activity (last 30 days)
  const recentActivity = await submitQuery`
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as count
    FROM (
      SELECT created_at FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      UNION ALL
      SELECT created_at FROM farms WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      UNION ALL
      SELECT created_at FROM livestock WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    ) as combined_data
    GROUP BY DATE(created_at)
    ORDER BY date DESC
    LIMIT 30
  `;

  return {
    totalCounts: {
      users: totalUsers[0]?.count || 0,
      farms: totalFarms[0]?.count || 0,
      livestock: totalLivestock[0]?.count || 0,
      vets: totalVets[0]?.count || 0,
      pendingVerifications: verificationRequests[0]?.count || 0
    },
    livestockByHealth: camelKeys(livestockByHealth)(),
    farmsByType: camelKeys(farmsByType)(),
    recentActivity: camelKeys(recentActivity)()
  };
};

module.exports = fetchAdminDashboardStats;
