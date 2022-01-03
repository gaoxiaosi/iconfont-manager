const initScript = require('./initScript');
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const homedir = require('os').homedir();

// 输入账号密码，远程爬取账号下的所有图标库并写入到用户目录下的.iconfontrc文件中
async function init (phoneNumber, password) {
  const projects = await initScript(phoneNumber, password);
  const file = path.join(homedir, '.iconfontrc');
  !fs.existsSync(file) && await fs.createFile(file);
  await fs.writeJSON(file, { projects });
  console.log(`
  初始化完毕，你可以${chalk.green('iconfont-manager ls')}查看你的所有项目.
  请设置好图标的保存目录(绝对路径)再进行其他操作，设置方法如下：
  1.在${chalk.green(homedir)}目录下找到${chalk.green('.iconfontrc')}文件直接编辑;
  2.执行${chalk.green('iconfont-manager ui')}命令通过图形化界面进行配置.`);
}

module.exports = (...args) => {
  return init(...args).catch(err => {
    throw err
  })
}
