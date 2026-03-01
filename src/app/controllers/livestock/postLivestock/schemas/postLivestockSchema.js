const yup = require("yup");
const selectCategoryById = require("./queries/selectCategoryById");
const selectTagNumber = require("./queries/selectTagNumber");

const postLivestockSchema = yup.object().shape({
  categoryId: yup
    .number()
    .required()
    .positive()
    .integer()
    .label("Category ID")
    .typeError("Category ID must be a number.")
    .test("categoryExists", "Category does not exist.", function test(
      categoryId
    ) {
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
    .required()
    .max(50)
    .label("Tag Number")
    .test(
      "tagNumberUnique",
      "Tag number already exists on this farm.",
      function test(tagNumber) {
        const farmId = this.options.context && this.options.context.farmId;
        if (!farmId) return true;

        return selectTagNumber({ farmId, tagNumber }).then(existing => {
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
    .max(600) // 50 years max
    .label("Age in Months")
    .typeError("Age must be a number."),
  weightKg: yup
    .number()
    .nullable()
    .positive()
    .max(10000) // 10 tons max
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

module.exports = postLivestockSchema;
