const yup = require("yup");

const getLivestockByIdSchema = yup.object().shape({
  livestockId: yup
    .string()
    .required()
    .matches(/^\d+$/, "Livestock ID must be a positive integer")
    .test("validId", "Invalid livestock ID", function test(livestockId) {
      const parsed = parseInt(livestockId, 10);
      return parsed > 0;
    })
    .label("Livestock ID")
    .typeError("Livestock ID is required.")
});

module.exports = getLivestockByIdSchema;
