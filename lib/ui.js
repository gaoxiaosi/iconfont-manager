const exec = require('child_process').exec;
const path = require('path');
const cmdPath = path.resolve(__dirname, '../src/service/index.js');
const cmd = `node ${cmdPath}`;

async function ui () {
  console.log('正在为你打开图形化管理界面，你可以在页面上更新图标并修改相关信息')
  const process = exec(cmd, err => {
    if(err) throw err
  })
  process.stdout.on('data', data => {
    console.log(data)
  })
}

module.exports = () => {
  return ui().catch(err => {
    throw err
  })
}