const yup = require("yup");
const selectFarmNameForUpdate = require("./queries/selectFarmNameForUpdate");

const putFarmSchema = yup.object().shape({
  farmId: yup
    .string()
    .required()
    .matches(/^\\d+$/, "Farm ID must be a positive integer")
    .test("validId", "Invalid farm ID", function test(farmId) {
      const parsed = parseInt(farmId, 10);
      return parsed > 0;
    })
    .label("Farm ID")
    .typeError("Farm ID is required."),
  farmName: yup
    .string()
    .nullable()
    .min(3)
    .max(100)
    .label("Farm Name")
    .typeError("Farm Name must be a string.")
    .test(
      "farmNameUnique",
      "Farm name already exists for this farmer.",
      function test(farmName) {
        if (!farmName) return true;
        const { farmerId, farmId } = this.options.context || {};
        if (!farmerId || !farmId) return true;
        return selectFarmNameForUpdate({ farmerId, farmName, farmId }).then(
          existing => {
            return !existing;
          }
        );
      }
    ),
  description: yup
    .string()
    .nullable()
    .max(500)
    .label("Description"),
  address: yup
    .string()
    .nullable()
    .max(255)
    .label("Address"),
  city: yup
    .string()
    .nullable()
    .max(100)
    .label("City"),
  state: yup
    .string()
    .nullable()
    .max(100)
    .label("State"),
  country: yup
    .string()
    .nullable()
    .max(100)
    .label("Country"),
  postalCode: yup
    .string()
    .nullable()
    .max(20)
    .label("Postal Code"),
  latitude: yup
    .number()
    .nullable()
    .min(-90)
    .max(90)
    .label("Latitude")
    .typeError("Latitude must be a number between -90 and 90."),
  longitude: yup
    .number()
    .nullable()
    .min(-180)
    .max(180)
    .label("Longitude")
    .typeError("Longitude must be a number between -180 and 180."),
  totalAreaHectares: yup
    .number()
    .nullable()
    .positive()
    .max(1000000)
    .label("Total Area (Hectares)")
    .typeError("Total Area must be a positive number."),
  farmType: yup
    .string()
    .nullable()
    .oneOf(["crop", "livestock", "mixed", "dairy", "poultry"])
    .label("Farm Type"),
  establishedDate: yup
    .date()
    .nullable()
    .max(new Date(), "Established date cannot be in the future")
    .label("Established Date"),
  isActive: yup
    .boolean()
    .nullable()
    .label("Is Active")
});
module.exports = putFarmSchema;
