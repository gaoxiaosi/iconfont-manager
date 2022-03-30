const { readConfig, writeConfig } = require('../utils/fileHandle');
const { throwError, chalkGreen, showTable } = require('../utils/common');
const refreshScript = require('../scripts/refresh');
const { tableHeads, tableKeys } = require('../utils/table.config');

async function refresh(projectId) {
  const { projects } = await readConfig();
  const index = projects.findIndex(project => projectId == project.id);
  if (index !== -1) {
    const { user, password, id, filePath } = projects[index];
    projects[index] = await refreshScript(user, password, id, filePath);
    await writeConfig({ projects });
    chalkGreen('🎉该条数据更新成功，最新信息如下：')
    showTable([projects[index]], tableHeads, tableKeys);
  } else {
    throwError('可能原因：图标库id不存在!');
  }
}

module.exports = (...args) => {
  return refresh(...args).catch(err => {
    throw err
  })
}
