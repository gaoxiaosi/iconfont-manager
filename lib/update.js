const { readConfig } = require('../utils/fileHandle');
const downloadScript = require('../scripts/download');
const { findData, isArray } = require('../utils/common');

async function update(projectIds) {
  const { projects } = await readConfig();
  let data = findData(projects, 'id', projectIds);
  // 多个不同的user先排序，处理完一个user的全部项目再处理下一个
  let queue = isArray(data) ? data.sort((a, b) => a.user - b.user) : [data]
  while(queue.length) {
    const current = queue.shift();
    const isCloseBrowser = queue.length === 0
    const isRelogin = queue.length > 0 && queue[0].user !== current.user
    const { id, name, user, password, filePath } = current
    await downloadScript(id, name, user, password, filePath, isRelogin, isCloseBrowser)
  }
}

module.exports = (...args) => {
  return update(...args).catch(err => {
    throw err
  })
}
