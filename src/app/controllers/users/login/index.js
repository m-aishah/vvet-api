const jwt = require("jsonwebtoken");
const fetchUser = require("~root/actions/users/fetchUser");
const handleAPIError = require("~root/utils/handleAPIError");
const postLoginSchema = require("./schemas/postLoginSchema");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    await postLoginSchema.validate(
      {
        email,
        password
      },
      {
        abortEarly: false
      }
    );

    const { user } = await fetchUser({ email, password });

    if (user) {
      const accessToken = jwt.sign(
        {
          userId: user.userId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType,
          userTypeId: user.userTypeId
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "365d" // 1 year
        }
      );

      res.json({
        accessToken,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          userType: user.userType,
          userTypeId: user.userTypeId
        }
      });
    } else {
      res.status(401).send("Username or password incorrect");
    }
  } catch (err) {
    handleAPIError(res, err);
  }
};

module.exports = login;
