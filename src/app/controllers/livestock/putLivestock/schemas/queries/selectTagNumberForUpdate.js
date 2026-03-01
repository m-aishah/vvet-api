const { submitQuery, camelKeys, getFirst } = require("~root/lib/database");

const selectTagNumberForUpdate = ({
  farmId,
  tagNumber,
  livestockId
}) => submitQuery`
  SELECT 
    livestock_id
  FROM livestock
  WHERE farm_id = ${farmId}
  AND tag_number = ${tagNumber}
  AND livestock_id != ${livestockId}
`;

module.exports = getFirst(camelKeys(selectTagNumberForUpdate));
