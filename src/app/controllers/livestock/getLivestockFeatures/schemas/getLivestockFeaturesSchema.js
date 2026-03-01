const yup = require("yup");

const getLivestockFeaturesSchema = yup.object().shape({
  categoryId: yup
    .string()
    .required()
    .matches(/^\d+$/, "Category ID must be a positive integer")
    .test("validId", "Invalid category ID", function test(categoryId) {
      const parsed = parseInt(categoryId, 10);
      return parsed > 0;
    })
    .label("Category ID")
    .typeError("Category ID is required.")
});

module.exports = getLivestockFeaturesSchema;
