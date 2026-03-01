const { submitQuery } = require("~root/lib/database");

const deleteLivestockRecord = async ({ livestockId, farmId }) => {
  const result = await submitQuery`
    DELETE FROM livestock 
    WHERE livestock_id = ${livestockId}
    AND farm_id = ${farmId}
  `;

  return result.affectedRows > 0;
};

module.exports = deleteLivestockRecord;
