const { readConfig } = require('../utils/fileHandle');
const { showTable } = require('../utils/common');

/**
 * @description 在控制台打印所有图标库信息表格
 */
async function ls () {
  const { projects } = await readConfig();
  showTable(projects);
}

module.exports = () => {
  return ls().catch(err => {
    throw err
  })
}
