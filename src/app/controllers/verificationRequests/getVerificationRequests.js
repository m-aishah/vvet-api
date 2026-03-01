const yup = require("yup");
const { handleAPIError } = require("~root/utils/handleAPIError");
const { paginate, FILTERS } = require("~root/lib/paginate");

const getAdminVerificationRequestsSchema = yup.object().shape({
  query: yup
    .object()
    .shape({
      page: yup
        .number()
        .integer()
        .min(1)
        .default(1),
      limit: yup
        .number()
        .integer()
        .min(1)
        .max(100)
        .default(10),
      status: yup.string().oneOf(["pending", "approved", "rejected"]),
      search: yup
        .string()
        .trim()
        .max(100)
    })
    .default({})
});
const getVerificationRequests = async (req, res) => {
  try {
    await getAdminVerificationRequestsSchema.validate({ query: req.query });
    const { page, limit, status, search } = req.query;

    // Build filters
    const filters = [];
    if (status) {
      filters.push({
        field: "vr.request_status",
        operator: FILTERS.equals.operator,
        values: [status]
      });
    }

    if (search) {
      filters.push({
        field: "f.farm_name",
        operator: FILTERS.contains.operator,
        values: [search]
      });
      filters.push({
        field: "l.name",
        operator: FILTERS.contains.operator,
        values: [search]
      });
      filters.push({
        field: "l.tag_number",
        operator: FILTERS.contains.operator,
        values: [search]
      });
    }

    const result = await paginate({
      baseTable: "verification_requests",
      selectFields: [
        "vr.verification_request_id",
        "vr.farm_id",
        "vr.vet_id",
        "vr.livestock_id",
        "vr.diagnosis_id",
        "vr.request_status",
        "vr.urgency_level",
        "vr.farmer_notes",
        "vr.requested_at",
        "vr.assigned_at",
        "vr.completed_at",
        "f.farm_name",
        "l.name as livestock_name",
        "l.tag_number as livestock_tag",
        "u_farmer.first_name as farmer_first_name",
        "u_farmer.last_name as farmer_last_name",
        "u_farmer.email as farmer_email"
      ],
      joinStatements: [
        "INNER JOIN farms f ON vr.farm_id = f.farm_id",
        "INNER JOIN livestock l ON vr.livestock_id = l.livestock_id",
        "INNER JOIN users u_farmer ON f.farmer_id = u_farmer.user_id",
        "LEFT JOIN users u_vet ON vr.vet_id = u_vet.user_id"
      ],
      sortableAttributes: ["requested_at", "urgency_level", "request_status"],
      filterableAttributes: [
        { column: "vr.request_status", type: "string" },
        { column: "f.farm_name", type: "string" },
        { column: "l.name", type: "string" },
        { column: "l.tag_number", type: "string" }
      ],
      sortBy: [{ field: "vr.requested_at", direction: "desc" }],
      limit: parseInt(limit) || 10,
      page: parseInt(page) || 1,
      filters
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    handleAPIError(res, error);
  }
};
module.exports = { getVerificationRequests };
