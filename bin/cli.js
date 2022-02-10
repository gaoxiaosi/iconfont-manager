#!/usr/bin/env node
const program = require('commander');
const chalk = require('chalk');
console.log(chalk.green('Tips：iconfont网站可能会有变化，如果爬虫无法使用，请及时更新或者到GitHub提交issue！'));

program.command('ls')
  .alias('l')
  .description('查看所有图标库的列表')
  .action(() => {
    require('../lib/ls')()
  })

program.command('init')
  .alias('i')
  .description('爬取所有的图标库的信息并保存在本地')
  .arguments('<phoneNumber> <password>')
  .action((phoneNumber, password) => {
    require('../lib/init')(phoneNumber, password)
  })

program.command('update')
  .alias('u')
  .description('更新单个或多个已保存信息在本地的图标库')
  .arguments('<projectIds...>')
  .action((projectIds) => {
    require('../lib/update')(projectIds)
  })

program.command('ui')
  .description('图形化管理界面')
  .action(() => {
    require('../lib/ui')()
  })

program.command('updateOne')
  .alias('uo')
  .description('更新单个图标库，需输入所有信息')
  .arguments('<id> <name> <user> <password> <filePath>')
  .action((id, name, user, password, filePath) => {
    require('../lib/updateOne')(id, name, user, password, filePath)
  })

program.command('add')
  .alias('a')
  .description('新增一个图标库，需输入所有信息')
  .arguments('<id> <name> <user> <password> <filePath> [immediately]')
  .action((id, name, user, password, filePath, immediately) => {
    require('../lib/add')(id, name, user, password, filePath, immediately)
  })

program.parse(process.argv);
