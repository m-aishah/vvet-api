const { submitQuery, camelKeys, getFirst } = require("~root/lib/database");

const selectFarmNameForUpdate = ({ farmerId, farmName, farmId }) =>
  submitQuery`  SELECT     farm_id  FROM farms  WHERE farmer_id = ${farmerId}  AND farm_name = ${farmName}  AND farm_id != ${farmId}`;
module.exports = getFirst(camelKeys(selectFarmNameForUpdate));
