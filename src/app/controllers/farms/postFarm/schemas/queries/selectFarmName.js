const { submitQuery, camelKeys, getFirst } = require("~root/lib/database");

const selectFarmName = ({ farmerId, farmName }) =>
  submitQuery`  SELECT     farm_id  FROM farms  WHERE farmer_id = ${farmerId}  AND farm_name = ${farmName}`;
module.exports = getFirst(camelKeys(selectFarmName));
