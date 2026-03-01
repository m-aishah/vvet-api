const yup = require("yup");
const selectCategoryById = require("./queries/selectCategoryById");
const selectTagNumberForUpdate = require("./queries/selectTagNumberForUpdate");

const putLivestockSchema = yup.object().shape({
  livestockId: yup
    .string()
    .required()
    .matches(/^\d+$/, "Livestock ID must be a positive integer")
    .test("validId", "Invalid livestock ID", function test(livestockId) {
      const parsed = parseInt(livestockId, 10);
      return parsed > 0;
    })
    .label("Livestock ID")
    .typeError("Livestock ID is required."),
  categoryId: yup
    .number()
    .nullable()
    .positive()
    .integer()
    .label("Category ID")
    .typeError("Category ID must be a number.")
    .test("categoryExists", "Category does not exist.", function test(
      categoryId
    ) {
      if (!categoryId) return true; // nullable field
      return selectCategoryById({ categoryId }).then(category => {
        return !!category;
      });
    }),
  name: yup
    .string()
    .nullable()
    .max(100)
    .label("Name"),
  tagNumber: yup
    .string()
    .nullable()
    .max(50)
    .label("Tag Number")
    .test(
      "tagNumberUnique",
      "Tag number already exists for this farmer.",
      function test(tagNumber) {
        if (!tagNumber) return true; // nullable field

        const { farmId, livestockId } = this.options.context || {};
        if (!farmId || !livestockId) return true;

        return selectTagNumberForUpdate({
          farmId,
          tagNumber,
          livestockId
        }).then(existing => {
          return !existing;
        });
      }
    ),
  breed: yup
    .string()
    .nullable()
    .max(100)
    .label("Breed"),
  ageMonths: yup
    .number()
    .nullable()
    .positive()
    .integer()
    .max(600)
    .label("Age in Months")
    .typeError("Age must be a number."),
  weightKg: yup
    .number()
    .nullable()
    .positive()
    .max(10000)
    .label("Weight in KG")
    .typeError("Weight must be a number."),
  gender: yup
    .string()
    .nullable()
    .oneOf(["male", "female", "unknown"])
    .label("Gender"),
  birthDate: yup
    .date()
    .nullable()
    .max(new Date(), "Birth date cannot be in the future")
    .label("Birth Date"),
  acquisitionDate: yup
    .date()
    .nullable()
    .max(new Date(), "Acquisition date cannot be in the future")
    .label("Acquisition Date"),
  currentHealthStatus: yup
    .string()
    .nullable()
    .oneOf(["healthy", "sick", "recovering", "deceased"])
    .label("Current Health Status"),
  notes: yup
    .string()
    .nullable()
    .max(1000)
    .label("Notes"),
  healthFeatures: yup
    .object()
    .nullable()
    .label("Health Features")
});

module.exports = putLivestockSchema;
