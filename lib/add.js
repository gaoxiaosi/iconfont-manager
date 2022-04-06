const downloadScript = require('../scripts/download');
const { readConfig, writeConfig } = require('../utils/fileHandle');

/**
 * @description （临时）新增一个图标库，将图标库数据写入.iconfontrc，可选择是否下载图标库文件
 * @param {String} id 图标库id
 * @param {String} name 图标库名称
 * @param {String} user 账号
 * @param {String} password 密码
 * @param {String} filePath 保存路径
 * @param {Boolean} immediately 是否立即下载图标库文件
 */
async function add(id, name, user, password, filePath, immediately = false) {
  const { projects } = await readConfig()
  projects.push({ id, name, user, password, filePath })
  try {
    await writeConfig({ projects })
    console.log('新增成功')
  } catch(err) {
    console.log(err)
  }
  immediately && await downloadScript(id, name, user, password, filePath, false, true)
}

module.exports = (...args) => {
  return add(...args).catch(err => {
    throw err
  })
}
