const { readConfig, writeConfig } = require('../utils/fileHandle');
const { chalkGreen, showTable, findData } = require('../utils/common');
const refreshScript = require('../scripts/refresh');

/**
 * @description 更新图标库的信息（主要是在线链接）
 * @param {String} projectId 图标库id
 */
async function refresh(projectId) {
  const { projects } = await readConfig();
  const { _index, user, password, id, filePath } = findData(projects, 'id', projectId);
  projects[_index] = await refreshScript(user, password, id, filePath);
  await writeConfig({ projects });
  chalkGreen('🎉该条数据更新成功，最新信息如下：');
  showTable([projects[_index]]);
}

module.exports = (...args) => {
  return refresh(...args).catch(err => {
    throw err
  })
}
