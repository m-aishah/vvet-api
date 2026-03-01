const { submitQuery, camelKeys, getFirst } = require("~root/lib/database");

const selectTagNumber = ({ farmId, tagNumber }) => submitQuery`
  SELECT 
    livestock_id
  FROM livestock
  WHERE farm_id = ${farmId}
  AND tag_number = ${tagNumber}
`;

module.exports = getFirst(camelKeys(selectTagNumber));
