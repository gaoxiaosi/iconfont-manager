const readConfig = require('./readConfig');
const Table = require('cli-table')

async function ls () {
  const { projects } = await readConfig()
  console.table(projects, ['id', 'name', 'user', 'filePath']);
}

module.exports = () => {
  return ls().catch(err => {
    throw err
  })
}