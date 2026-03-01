const yup = require("yup");

const postLoginSchema = yup.object().shape({
  email: yup
    .string()
    .email()
    .required()
    .label("Email")
    .typeError("Email must be a valid email address."),
  password: yup
    .string()
    .required()
    .min(1)
    .label("Password")
    .typeError("Password is required.")
});

module.exports = postLoginSchema;
