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

// 在数字前面补0
Number.prototype.addZero = function (number = 2) {
  return this.toString().padStart(number, 0)
}

// 获取当前时间 yyyy-MM-dd hh:mm
const getNowTime = () => {
  const now = new Date();
  const year = now.getFullYear(),
        month = (now.getMonth() + 1).addZero(),
        date = (now.getDate()).addZero(),
        hour = (now.getHours()).addZero(),
        minute = (now.getMinutes()).addZero();
  return `${year}-${month}-${date} ${hour}:${minute}`;
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
