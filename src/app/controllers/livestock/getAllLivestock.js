const yup = require("yup");
const { handleAPIError } = require("~root/utils/handleAPIError");
const { paginate, FILTERS } = require("~root/lib/paginate");

const getAdminLivestockSchema = yup.object().shape({
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
      category: yup.string().trim(),
      healthStatus: yup
        .string()
        .oneOf(["healthy", "sick", "injured", "under_treatment", "recovered"]),
      search: yup
        .string()
        .trim()
        .max(100),
      farmerId: yup
        .number()
        .integer()
        .positive(),
      farmId: yup
        .number()
        .integer()
        .positive()
    })
    .default({})
});

const getAllLivestock = async (req, res) => {
  try {
    await getAdminLivestockSchema.validate({ query: req.query });
    const {
      page,
      limit,
      category,
      healthStatus,
      search,
      farmerId,
      farmId
    } = req.query;

    // Build filters
    const filters = [];
    if (category) {
      filters.push({
        column: "lc.category_name",
        operation: FILTERS.equals.operator,
        values: [category]
      });
    }

    if (healthStatus) {
      filters.push({
        column: "l.current_health_status",
        operation: FILTERS.equals.operator,
        values: [healthStatus]
      });
    }

    if (farmerId) {
      filters.push({
        column: "f.farmer_id",
        operation: FILTERS.equals.operator,
        values: [parseInt(farmerId, 10)]
      });
    }

    if (farmId) {
      filters.push({
        column: "l.farm_id",
        operation: FILTERS.equals.operator,
        values: [parseInt(farmId, 10)]
      });
    }

    if (search) {
      filters.push({
        OR: [
          {
            column: "l.name",
            operation: FILTERS.contains.operator,
            values: [search]
          },
          {
            column: "l.tag_number",
            operation: FILTERS.contains.operator,
            values: [search]
          },
          {
            column: "f.farm_name",
            operation: FILTERS.contains.operator,
            values: [search]
          }
        ]
      });
    }

    const result = await paginate({
      baseTable: "livestock l",
      basePath: "/livestock",
      selectFields: [
        "l.livestock_id",
        "l.farm_id",
        "l.category_id",
        "l.name",
        "l.tag_number",
        "l.breed",
        "l.age_months",
        "l.weight_kg",
        "l.gender",
        "l.current_health_status",
        "l.created_at",
        "l.updated_at",
        "lc.category_name",
        "f.farm_name",
        "f.farmer_id",
        "u.first_name as farmer_first_name",
        "u.last_name as farmer_last_name",
        "u.email as farmer_email"
      ],
      joinStatements: [
        "LEFT JOIN livestock_categories lc ON l.category_id = lc.category_id",
        "LEFT JOIN farms f ON l.farm_id = f.farm_id",
        "LEFT JOIN users u ON f.farmer_id = u.user_id"
      ],
      sortableAttributes: [
        "l.created_at",
        "l.name",
        "l.tag_number",
        "l.current_health_status"
      ],
      filterableAttributes: [
        { column: "lc.category_name", type: "string" },
        { column: "l.current_health_status", type: "string" },
        { column: "f.farmer_id", type: "number" },
        { column: "l.farm_id", type: "number" },
        { column: "l.name", type: "string" },
        { column: "l.tag_number", type: "string" },
        { column: "f.farm_name", type: "string" }
      ],
      sortBy: "-l.updated_at",
      limit: parseInt(limit, 10) || 10,
      page: parseInt(page, 10) || 1,
      filters
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    handleAPIError(res, error);
  }
};
module.exports = { getAllLivestock };
