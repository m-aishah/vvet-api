const insertUser = require("./queries/insertUser");

const createUser = async ({
  firstName,
  lastName,
  email,
  password,
  userTypeId,
  phone = null,
  address = null
}) => {
  const user = await insertUser({
    firstName,
    lastName,
    email,
    password,
    userTypeId,
    phone,
    address
  });

  return { user };
};

module.exports = createUser;
