const path = require('path');
const chalk = require('chalk');
const spinner = require('ora')();
const Table = require('cli-table3');

// 终端列表默认配置
const { tableDefaultOption, tableHeads, tableKeys } = require('./table.config');

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

// 是否为数组
const isArray = list => Array.isArray(list)

// 合并对象：主要用来合并参数
const extend = (target, ...source) => Object.assign(target, ...source)

/**
 * @description 根据某个属性查询对象数组，返回符合条件的数据及其下标，注意：两个值非绝对相等，如123==’123‘
 * @param {Array} list 原对象数组
 * @param {String} key 属性
 * @param {any|Array} search 查询属性的值（可能是数组）
 * @returns 1.若search是数组返回数组 2.若search不是数组，返回对象 3.都会返回_index属性标记下标
 */
const findData = (list, key, search) => {
  let result = [];
  if (!isArray(search)) {
    let index = list.findIndex(item => item[key] == search);
    index > -1 ? result = extend({}, list[index], {_index: index}) : throwError(search + '不存在')
  } else {
    for(let [index, item] of list.entries()) {
      if (!search.length) break
      let i = search.findIndex(searchItem => searchItem == item[key])
      i > -1 && search.splice(i, 1) && result.push(extend({}, item, {_index: index}))
    }
    // 若search不为空，说明有数据查找不到
    search.length && throwError(search.join(',') + '不存在')
  }
  return result
}

// 获取当前时间 yyyy-MM-dd hh:mm
const getNowTime = () => {
  const now = new Date();
  const year = now.getFullYear(),
        month = (now.getMonth() + 1 + '').padStart(2, 0),
        day = (now.getDate() + '').padStart(2, 0),
        hour = (now.getHours() + '').padStart(2, 0),
        minute = (now.getMinutes() + '').padStart(2, 0);
  return `${year}-${month}-${day} ${hour}:${minute}`;
}

/**
 * @description 在终端打印数据表格
 * @param {Array} list 列表数据
 * @param {String[]} heads 列表头（有顺序）
 * @param {String[]} keys 列表项（有顺序)
 */
const showTable = (list, heads = tableHeads, keys = tableKeys) => {
  let table = new Table(extend(tableDefaultOption, { head: heads }));
  list.forEach(item => table.push(keys.map(key => chalk.green(item[key]))))
  console.log(table.toString());
}

module.exports = {
  chalkGreen,
  chalkYellow,
  spinnerStart,
  spinnerSucceed,
  throwError,
  resolvePath,
  joinPath,
  isArray,
  extend,
  findData,
  getNowTime,
  showTable
}
