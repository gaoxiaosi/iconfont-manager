const { readConfig } = require('../utils/fileHandle');
const downloadScript = require('../scripts/download');

async function update(projectIds) {
  const { projects } = await readConfig();
  let queue = []
  if(projectIds.length === 1) { // 如果只有一个项目
    let obj = projects.find(project => projectIds[0] == project.id);
    queue.push(obj);
  } else {
    let list = [];
    for (let projectId of projectIds) {
      let obj = projects.find(project => projectId == project.id);
      list.push(obj);
    }
    // 根据user的不同对数据进行排序，处理完一个user的全部项目再处理下一个
    queue = list.sort((a, b) => a.user - b.user)
  }
  while(queue.length) {
    const current = queue.shift();
    const isCloseBrowser = queue.length === 0
    const isRelogin = queue.length > 0 && queue[0].user !== current.user
    const { id, name, user, password, filePath} = current
    await downloadScript(id, name, user, password, filePath, isRelogin, isCloseBrowser)
  }
}

module.exports = (...args) => {
  return update(...args).catch(err => {
    throw err
  })
}
