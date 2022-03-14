const { readConfig } = require('../utils/manageConfig');

async function ls () {
  const { projects } = await readConfig()
  console.table(projects, ['id', 'name', 'user', 'filePath', 'fontClass', 'updateTime']);
}

module.exports = () => {
  return ls().catch(err => {
    throw err
  })
}
