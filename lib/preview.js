const { readConfig, isExist } = require('../utils/fileHandle');
const { joinPath, throwError, findData } = require('../utils/common');
const open = require('open');

/**
 * @description 打开图标库的静态预览html（该图标库文件已下载到本地）
 * @param {String} projectId 图标库id
 */
async function preview(projectId) {
  const { projects } = await readConfig();
  const data = findData(projects, 'id', projectId);
  if (data && data.filePath && isExist(joinPath(data.filePath, 'iconfont'))) {
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
