const { submitQuery } = require("~root/lib/database");

const deleteFarmById = ({ farmId, farmerId }) =>
  submitQuery`  DELETE FROM farms   WHERE farm_id = ${farmId}  AND farmer_id = ${farmerId}`;
module.exports = deleteFarmById;
