const { readConfig } = require('../utils/manageConfig');
const { throwError } = require('../utils/common');
const { joinPath } = require('../utils/common');
const open = require('open');

async function preview(projectId) {
  const { projects } = await readConfig();
  const data = projects.find(project => projectId + '' === project.id + '');
  if (data && data.filePath) {
    await open(joinPath(data.filePath, 'iconfont', 'demo_index.html'));
  } else {
    throwError('可能原因：图标库id不存在、未设置该图标库保存路径、未下载图标库文件');
  }
}

module.exports = (...args) => {
  return preview(...args).catch(err => {
    throw err
  })
}
