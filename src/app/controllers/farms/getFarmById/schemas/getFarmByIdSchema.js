const yup = require("yup");

const getFarmByIdSchema = yup.object().shape({
  farmId: yup
    .string()
    .required()
    .matches(/^\\d+$/, "Farm ID must be a positive integer")
    .test("validId", "Invalid farm ID", function test(farmId) {
      const parsed = parseInt(farmId, 10);
      return parsed > 0;
    })
    .label("Farm ID")
    .typeError("Farm ID is required.")
});
module.exports = getFarmByIdSchema;
