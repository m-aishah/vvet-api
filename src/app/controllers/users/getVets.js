const yup = require("yup");
const { handleAPIError } = require("~root/utils/handleAPIError");
const { paginate, FILTERS } = require("~root/lib/paginate");

const getAdminVetsSchema = yup.object().shape({
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
      isActive: yup.boolean(),
      isVerified: yup.boolean(),
      search: yup
        .string()
        .trim()
        .max(100),
      specialization: yup.string().trim()
    })
    .default({})
});
const getVets = async (req, res) => {
  try {
    await getAdminVetsSchema.validate({ query: req.query });
    const {
      page,
      limit,
      isActive,
      isVerified,
      search,
      specialization
    } = req.query;

    // Build filters
    const filters = [];
    if (isVerified !== undefined) {
      filters.push({
        column: "vp.verification_status",
        operation: FILTERS.equals.operator,
        values: [isVerified === "true" ? "verified" : "pending"]
      });
    }

    if (specialization) {
      filters.push({
        column: "vp.specializations",
        operation: FILTERS.contains.operator,
        values: [specialization]
      });
    }

    if (search) {
      filters.push({
        OR: [
          {
            column: "u.first_name",
            operation: FILTERS.contains.operator,
            values: [search]
          },
          {
            column: "u.last_name",
            operation: FILTERS.contains.operator,
            values: [search]
          },
          {
            column: "u.email",
            operation: FILTERS.contains.operator,
            values: [search]
          }
        ]
      });
    }

    const result = await paginate({
      baseTable: "users u",
      basePath: "/users/vets",
      selectFields: [
        "u.user_id",
        "u.first_name",
        "u.last_name",
        "u.email",
        "u.phone",
        "u.address",
        "u.created_at",
        "u.updated_at",
        "vp.vet_profile_id",
        "vp.license_number",
        "vp.specializations",
        "vp.years_experience",
        "vp.consultation_fee",
        "vp.availability_status",
        "vp.verification_status"
      ],
      joinStatements: [
        "INNER JOIN vet_profiles vp ON u.user_id = vp.user_id",
        "INNER JOIN user_types ut ON u.user_type_id = ut.user_type_id"
      ],
      mandatoryFilter: {
        column: "ut.user_type",
        operation: FILTERS.equals.operator,
        values: ["vet"]
      },
      sortableAttributes: [
        "u.created_at",
        "u.first_name",
        "u.last_name",
        "vp.verification_status"
      ],
      filterableAttributes: [
        { column: "vp.verification_status", type: "string" },
        { column: "vp.specializations", type: "string" },
        { column: "u.first_name", type: "string" },
        { column: "u.last_name", type: "string" },
        { column: "u.email", type: "string" }
      ],
      sortBy: "-u.created_at",
      filters
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    handleAPIError(res, error);
  }
};
module.exports = { getVets };
