const yup = require("yup");
const selectUserByEmail = require("./queries/selectUserById");

const postUserSchema = yup.object().shape({
  firstName: yup
    .string()
    .required()
    .min(2)
    .max(50)
    .label("First Name")
    .typeError("First Name must be a string."),
  lastName: yup
    .string()
    .required()
    .min(2)
    .max(50)
    .label("Last Name")
    .typeError("Last Name must be a string."),
  password: yup
    .string()
    .min(8)
    .required()
    .label("Password")
    .typeError("Password must be a string.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  userTypeId: yup
    .number()
    .required()
    .oneOf([1, 2, 3], "User Type ID must be 1 (admin), 2 (farmer), or 3 (vet)")
    .label("User Type ID")
    .typeError("User Type ID must be a number."),
  email: yup
    .string()
    .email()
    .required()
    .label("Email")
    .typeError("Email must be a valid email address.")
    .test("doesEmailExist", "User account already exists.", function test(
      email
    ) {
      return selectUserByEmail({ email }).then(account => {
        if (account) {
          return false;
        }
        return true;
      });
    }),
  phone: yup
    .string()
    .nullable()
    .label("Phone Number")
    .matches(/^[+]?[0-9\s\-()]+$/, "Phone number format is invalid"),
  address: yup
    .string()
    .nullable()
    .max(255)
    .label("Address")
});
module.exports = postUserSchema;
