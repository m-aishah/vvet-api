const { submitQuery, getInsertId } = require("~root/lib/database");

const insertUser = ({
  firstName,
  lastName,
  email,
  password,
  userTypeId,
  phone,
  address
}) => submitQuery`
  INSERT INTO users
  (
    first_name,
    last_name,
    email,
    password,
    user_type_id,
    phone,
    address
  )
  VALUES
  (
    ${firstName},
    ${lastName},
    ${email},
    SHA2(CONCAT(${password},${process.env.PASSWORD_SALT}), 224),
    ${userTypeId},
    ${phone},
    ${address}
  )
`;

module.exports = getInsertId(insertUser);
