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

const getNowTime = () => {
  const now = new Date();
  const year = now.getFullYear(),
        month = (now.getMonth() + 1).toString().padStart(2, '0'),
        date = (now.getDate()).toString().padStart(2, '0'),
        hours = (now.getHours()).toString().padStart(2, '0'),
        minute = (now.getMinutes()).toString().padStart(2, '0');
  return `${year}-${month}-${date} ${hours}:${minute}`;
}

module.exports = {
  chalkGreen,
  spinnerStart,
  spinnerSucceed,
  throwError,
  resolvePath,
  joinPath,
  getNowTime
}
