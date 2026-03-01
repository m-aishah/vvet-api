const yup = require("yup");
const { handleAPIError } = require("~root/utils/handleAPIError");
const fetchVetDashboardStats = require("~root/actions/stats/fetchVetDashboardStats");

const getVetStatsSchema = yup.object().shape({
  params: yup.object().shape({
    vetId: yup
      .number()
      .integer()
      .positive()
      .required()
  })
});
const getVetStats = async (req, res) => {
  try {
    await getVetStatsSchema.validate({ params: req.params });
    const { vetId } = req.params;
    if (
      req.user.userType !== "admin" &&
      req.user.userId !== parseInt(vetId, 10)
    ) {
      res.status(403).json({
        success: false,
        message: "You can only access your own statistics"
      });
    }
    const stats = await fetchVetDashboardStats({ vetId: parseInt(vetId, 10) });
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    handleAPIError(res, error);
  }
};
module.exports = { getVetStats };
