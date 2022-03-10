const path = require('path');
const chalk = require('chalk');
const spinner = require('ora')();

// 信息打印
const chalkGreen = msg => console.log(chalk.green(msg));
const spinnerStart = msg => spinner.start(chalk.green(msg));
const spinnerSucceed = msg => spinner.succeed(chalk.green(msg));

// 主动抛错
const throwError = errorTips => { throw new Error(errorTips) }

// 获取绝对路径 && 路径拼接
const resolvePath = filePath => path.resolve(__dirname, filePath)
const joinPath = (...args) => path.join(...args)

module.exports = {
  chalkGreen,
  spinnerStart,
  spinnerSucceed,
  throwError,
  resolvePath,
  joinPath
}
