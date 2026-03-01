const { submitQuery, camelKeys } = require("~root/lib/database");

const fetchFarmerDashboardStats = async ({ farmerId }) => {
  // Get farmer's farm count
  const totalFarms = await submitQuery`
    SELECT COUNT(*) as count FROM farms WHERE farmer_id = ${farmerId}
  `;

  // Get farmer's total livestock count
  const totalLivestock = await submitQuery`
    SELECT COUNT(l.*) as count 
    FROM livestock l
    INNER JOIN farms f ON l.farm_id = f.farm_id
    WHERE f.farmer_id = ${farmerId}
  `;

  // Get livestock by health status for this farmer
  const livestockByHealth = await submitQuery`
    SELECT 
      l.current_health_status,
      COUNT(*) as count
    FROM livestock l
    INNER JOIN farms f ON l.farm_id = f.farm_id
    WHERE f.farmer_id = ${farmerId}
    GROUP BY l.current_health_status
  `;

  // Get farms by type for this farmer
  const farmsByType = await submitQuery`
    SELECT 
      farm_type,
      COUNT(*) as count
    FROM farms 
    WHERE farmer_id = ${farmerId}
    GROUP BY farm_type
  `;

  // Get verification requests for this farmer
  const verificationRequests = await submitQuery`
    SELECT 
      vr.request_status,
      COUNT(*) as count
    FROM verification_requests vr
    INNER JOIN farms f ON vr.farm_id = f.farm_id
    WHERE f.farmer_id = ${farmerId}
    GROUP BY vr.request_status
  `;

  // Get recent livestock additions (last 30 days)
  const recentLivestock = await submitQuery`
    SELECT 
      DATE(l.created_at) as date,
      COUNT(*) as count
    FROM livestock l
    INNER JOIN farms f ON l.farm_id = f.farm_id
    WHERE f.farmer_id = ${farmerId}
    AND l.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    GROUP BY DATE(l.created_at)
    ORDER BY date DESC
    LIMIT 30
  `;

  return {
    totalCounts: {
      farms: totalFarms[0]?.count || 0,
      livestock: totalLivestock[0]?.count || 0
    },
    livestockByHealth: camelKeys(livestockByHealth)(),
    farmsByType: camelKeys(farmsByType)(),
    verificationRequests: camelKeys(verificationRequests)(),
    recentActivity: camelKeys(recentLivestock)()
  };
};

module.exports = fetchFarmerDashboardStats;
