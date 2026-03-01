const yup = require("yup");
const { handleAPIError } = require("~root/utils/handleAPIError");
const fetchAdminDashboardStats = require("~root/actions/stats/fetchAdminDashboardStats");

const getAdminStatsSchema = yup.object().shape({
  query: yup
    .object()
    .shape({
      period: yup
        .string()
        .oneOf(["7days", "30days", "90days", "1year"])
        .default("30days"),
      breakdown: yup.boolean().default(false)
    })
    .default({})
});
const getAdminStats = async (req, res) => {
  try {
    await getAdminStatsSchema.validate({ query: req.query });
    const { period, breakdown } = req.query;
    const stats = await fetchAdminDashboardStats({
      period,
      breakdown: breakdown === "true"
    });
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    handleAPIError(res, error);
  }
};
module.exports = { getAdminStats };
