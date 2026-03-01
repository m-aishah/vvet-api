const yup = require("yup");
const { handleAPIError } = require("~root/utils/handleAPIError");
const fetchFarmerDashboardStats = require("~root/actions/stats/fetchFarmerDashboardStats");

const getFarmerStatsSchema = yup.object().shape({
  params: yup.object().shape({
    farmerId: yup
      .number()
      .integer()
      .positive()
      .required()
  })
});
const getFarmerStats = async (req, res) => {
  try {
    await getFarmerStatsSchema.validate({ params: req.params });
    const { farmerId } = req.params;
    if (
      req.user.userType !== "admin" &&
      req.user.userId !== parseInt(farmerId, 10)
    ) {
      res.status(403).json({
        success: false,
        message: "You can only access your own statistics"
      });
    }
    const stats = await fetchFarmerDashboardStats({
      farmerId: parseInt(farmerId, 10)
    });
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    handleAPIError(res, error);
  }
};
module.exports = { getFarmerStats };
