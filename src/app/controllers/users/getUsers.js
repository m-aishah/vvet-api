const yup = require("yup");
const { handleAPIError } = require("~root/utils/handleAPIError");
const { paginate, FILTERS } = require("~root/lib/paginate");

const getAdminUsersSchema = yup.object().shape({
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
      userType: yup.string().oneOf(["admin", "farmer", "vet"]),
      isActive: yup.boolean(),
      search: yup
        .string()
        .trim()
        .max(100)
    })
    .default({})
});

const getUsers = async (req, res) => {
  try {
    await getAdminUsersSchema.validate({ query: req.query });
    const { page, limit, userType, search } = req.query;

    // Build filters
    const filters = [];
    if (userType) {
      filters.push({
        column: "ut.user_type",
        operation: FILTERS.equals.operator,
        values: [userType]
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
      basePath: "/users",
      selectFields: [
        "u.user_id",
        "u.first_name",
        "u.last_name",
        "u.email",
        "u.phone",
        "u.address",
        "u.created_at",
        "u.updated_at",
        "ut.user_type"
      ],
      joinStatements: [
        "INNER JOIN user_types ut ON u.user_type_id = ut.user_type_id"
      ],
      sortableAttributes: ["u.created_at", "u.first_name", "u.last_name"],
      filterableAttributes: [
        { column: "ut.user_type", type: "string" },
        { column: "u.first_name", type: "string" },
        { column: "u.last_name", type: "string" },
        { column: "u.email", type: "string" }
      ],
      sortBy: "-u.created_at",
      limit: parseInt(limit, 10) || 10,
      page: parseInt(page, 10) || 1,
      filters
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    handleAPIError(res, error);
  }
};
module.exports = { getUsers };
