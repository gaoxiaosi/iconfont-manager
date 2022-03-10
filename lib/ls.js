const { readConfig } = require('../utils/manageConfig');

async function ls () {
  const { projects } = await readConfig()
  console.table(projects, ['id', 'name', 'user', 'filePath']);
}

module.exports = () => {
  return ls().catch(err => {
    throw err
  })
}
