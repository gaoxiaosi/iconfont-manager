const downloadScript = require('../scripts/download');

/**
 * @description （临时）下载一个图标库文件，数据不写入.iconfontrc
 * @param {String} id 图标库id
 * @param {String} name 图标库名称
 * @param {String} user 账号
 * @param {String} password 密码
 * @param {String} filePath 保存路径
 */
async function updateOne(id, name, user, password, filePath) {
  await downloadScript(id, name, user, password, filePath, false, true)
}

module.exports = (...args) => {
  return updateOne(...args).catch(err => {
    throw err
  })
}
