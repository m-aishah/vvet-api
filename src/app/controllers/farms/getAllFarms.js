const yup = require("yup");
const { handleAPIError } = require("~root/utils/handleAPIError");
const { paginate, FILTERS } = require("~root/lib/paginate");

const getAdminFarmsSchema = yup.object().shape({
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
      farmType: yup
        .string()
        .oneOf(["crop", "livestock", "dairy", "poultry", "mixed"]),
      isActive: yup.boolean(),
      search: yup
        .string()
        .trim()
        .max(100),
      farmerId: yup
        .number()
        .integer()
        .positive()
    })
    .default({})
});

const getAllFarms = async (req, res) => {
  try {
    await getAdminFarmsSchema.validate({ query: req.query });
    const { page, limit, farmType, isActive, search, farmerId } = req.query;

    // Build filters
    const filters = [];
    if (farmType) {
      filters.push({
        column: "f.farm_type",
        operation: FILTERS.equals.operator,
        values: [farmType]
      });
    }

    if (isActive !== undefined) {
      filters.push({
        column: "f.is_active",
        operation: FILTERS.equals.operator,
        values: [isActive === "true"]
      });
    }

    if (farmerId) {
      filters.push({
        column: "f.farmer_id",
        operation: FILTERS.equals.operator,
        values: [parseInt(farmerId)]
      });
    }

    if (search) {
      filters.push({
        OR: [
          {
            column: "f.farm_name",
            operation: FILTERS.contains.operator,
            values: [search]
          },
          {
            column: "f.description",
            operation: FILTERS.contains.operator,
            values: [search]
          },
          {
            column: "f.address",
            operation: FILTERS.contains.operator,
            values: [search]
          }
        ]
      });
    }

    const result = await paginate({
      baseTable: "farms f",
      basePath: "/farms",
      selectFields: [
        "f.farm_id",
        "f.farmer_id",
        "f.farm_name",
        "f.description",
        "f.address",
        "f.city",
        "f.state",
        "f.country",
        "f.farm_type",
        "f.is_active",
        "f.created_at",
        "f.updated_at",
        "u.first_name as farmer_first_name",
        "u.last_name as farmer_last_name",
        "u.email as farmer_email",
        "COUNT(l.livestock_id) as livestock_count"
      ],
      joinStatements: [
        "LEFT JOIN livestock l ON f.farm_id = l.farm_id",
        "LEFT JOIN users u ON f.farmer_id = u.user_id"
      ],
      groupBy: ["f.farm_id"],
      sortableAttributes: ["f.created_at", "f.farm_name", "f.farm_type"],
      filterableAttributes: [
        { column: "f.farm_type", type: "string" },
        { column: "f.is_active", type: "boolean" },
        { column: "f.farmer_id", type: "number" },
        { column: "f.farm_name", type: "string" },
        { column: "f.description", type: "string" },
        { column: "f.address", type: "string" }
      ],
      sortBy: "-f.updated_at",
      limit: parseInt(limit) || 10,
      page: parseInt(page) || 1,
      filters
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    handleAPIError(res, error);
  }
};
module.exports = { getAllFarms };
