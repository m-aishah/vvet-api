const createUser = require("~root/actions/users/createUser");
const handleAPIError = require("~root/utils/handleAPIError");
const postUserSchema = require("./schemas/postUserSchema");

const postUser = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    userTypeId,
    phone,
    address
  } = req.body;

  try {
    await postUserSchema.validate(
      {
        firstName,
        lastName,
        email,
        password,
        userTypeId,
        phone,
        address
      },
      {
        abortEarly: false
      }
    );

    const { user } = await createUser({
      firstName,
      lastName,
      email,
      password,
      userTypeId,
      phone,
      address
    });

    res.status(201).send({
      user: {
        userId: user.userId,
        firstName,
        lastName,
        email,
        userTypeId,
        phone,
        address
      }
    });
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = postUser;
