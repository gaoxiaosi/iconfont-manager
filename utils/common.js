const path = require('path');
const chalk = require('chalk');
const spinner = require('ora')();
const Table = require('cli-table3');

// 终端列表默认配置
const { tableDefaultOption } = require('./table.config');

// 信息打印
const chalkGreen = msg => console.log(chalk.green(msg))
const chalkYellow = msg => console.log(chalk.yellow(msg))
const spinnerStart = msg => spinner.start(chalk.green(msg))
const spinnerSucceed = msg => spinner.succeed(chalk.green(msg))

// 主动抛错
const throwError = errorTips => { throw new Error(errorTips) }

// 获取绝对路径 && 路径拼接
const resolvePath = filePath => path.resolve(__dirname, filePath)
const joinPath = (...args) => path.join(...args)

// 合并对象：主要用来合并参数
const extend = (target, ...source) => Object.assign(target, ...source)

// 在数字前面补0
Number.prototype.addZero = function (number = 2) {
  return this.toString().padStart(number, 0)
}

// 获取当前时间 yyyy-MM-dd hh:mm
const getNowTime = () => {
  const now = new Date();
  const year = now.getFullYear(),
        month = (now.getMonth() + 1).addZero(),
        date = now.getDate().addZero(),
        hour = now.getHours().addZero(),
        minute = now.getMinutes().addZero();
  return `${year}-${month}-${date} ${hour}:${minute}`;
}

/**
 * @description 在终端打印数据表格
 * @param {Array} list 列表数据
 * @param {String[]} heads 列表头（有顺序）
 * @param {String[]} keys 列表项（有顺序)
 */
const showTable = (list, heads, keys) => {
  let table = new Table(extend(tableDefaultOption, { head: heads }));
  for (const item of list) {
    table.push(keys.map(key => chalk.green(item[key])))
  }
  console.log(table.toString())
}

module.exports = {
  chalkGreen,
  chalkYellow,
  spinnerStart,
  spinnerSucceed,
  throwError,
  resolvePath,
  joinPath,
  extend,
  getNowTime,
  showTable
}
