const { readConfig, writeConfig } = require('../utils/fileHandle');
const { chalkGreen, showTable, findData, isArray } = require('../utils/common');
const refreshScript = require('../scripts/refresh');

/**
 * @description 更新图标库的信息（主要是在线链接）
 * @param {String | String[]} projectIds 一个或多个图标库id
 */
async function refresh(projectIds) {
  let { projects } = await readConfig();
  let data = findData(projects, 'id', projectIds);
  // 多个不同的user先排序，处理完一个user的全部项目再处理下一个
  let queue = isArray(data) ? data.sort((a, b) => a.user - b.user) : [data]
  let list = [];
  while(queue.length) {
    const current = queue.shift();
    const isCloseBrowser = queue.length === 0;
    const isRelogin = queue.length > 0 && queue[0].user !== current.user;
    const { _index, id, name, user, password, filePath } = current;
    projects[_index] = await refreshScript(id, name, user, password, filePath, isRelogin, isCloseBrowser);
    list.push(projects[_index]);
  }
  await writeConfig({ projects });
  chalkGreen('🎉数据更新成功，更新的信息如下：');
  showTable(list);
}

module.exports = (...args) => {
  return refresh(...args).catch(err => {
    throw err
  })
}
