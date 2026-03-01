const yup = require("yup");
const selectFarmName = require("./queries/selectFarmName");

const postFarmSchema = yup.object().shape({
  farmName: yup
    .string()
    .required()
    .min(3)
    .max(100)
    .label("Farm Name")
    .typeError("Farm Name must be a string.")
    .test(
      "farmNameUnique",
      "Farm name already exists for this farmer.",
      function test(farmName) {
        const { farmerId } = this.options.context || {};
        if (!farmerId) return true;
        return selectFarmName({ farmerId, farmName }).then(existing => {
          return !existing;
        });
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
    .label("Established Date")
});
module.exports = postFarmSchema;
