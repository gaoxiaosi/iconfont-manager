const { readConfig } = require('../utils/fileHandle');

async function ls () {
  const { projects } = await readConfig()
  console.table(projects, ['id', 'name', 'user', 'filePath', 'fontClass', 'updateTime']);
}

module.exports = () => {
  return ls().catch(err => {
    throw err
  })
}
