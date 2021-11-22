const downloadScript = require('./downloadScript');

async function updateOne(id, name, user, password, filePath) {
  await downloadScript(id, name, user, password, filePath, false, true)
}

module.exports = (...args) => {
  return updateOne(...args).catch(err => {
    throw err
  })
}
