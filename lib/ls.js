const { readConfig } = require('../utils/fileHandle');
const { showTable } = require('../utils/common');
const { tableHeads, tableKeys } = require('../utils/table.config');

async function ls () {
  const { projects } = await readConfig();
  showTable(projects, tableHeads, tableKeys);
}

module.exports = () => {
  return ls().catch(err => {
    throw err
  })
}
