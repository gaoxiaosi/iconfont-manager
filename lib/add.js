const downloadScript = require('../scripts/download');
const { readConfig, writeConfig } = require('../utils/manageConfig');

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
