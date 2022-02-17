const puppeteer = require('puppeteer');
const log = console.log;
const chalk = require('chalk');
const spinner = require('ora')();

const { loginUrl, loginRequestUrl, projectLibraryUrl } = require('./iconfont.config');
const throwError = (errorTips) => {
  throw new Error(errorTips)
}

const initScript = async (user, password) => {
  // 打开Browser和Page，跳转到登录页面
  const browser = await puppeteer.launch({ headless: true, timeout: 30000 });
  log(chalk.green('✔ 打开Browser'));
  const page = await browser.newPage();
  log(chalk.green('✔ 打开Page'));
  await page.goto(loginUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#userid');
  await page.waitForSelector('#password');
  spinner.start(chalk.green('开始登录'));
  // 先清空表单，再重新输入账号密码（切换用户登录时输入框可能有缓存）
  await page.$eval('#userid', (input, user) => { input.value = user }, user);
  await page.$eval('#password', (input, password) => { input.value = password }, password);
  // 登录请求结束后1秒，如果页面已经跳转，登录成功，代码照常执行，否则判断为登录失败
  page.on('response', async(r) => {
    if(r.url().includes(loginRequestUrl)) {
      await page.waitForTimeout(1000);
      !page.isClosed() && await page.$('.mx-btn-submit') !== null && throwError('登录失败，账号或密码错误');
    }
  })
  await page.click('.mx-btn-submit');
  await page.$('#userid-error') !== null && throwError('账号不合法');
  await page.$('#password-error') !== null && throwError('密码不合法');
  await page.waitForNavigation();
  spinner.succeed(chalk.green('登录成功'));

  // 登录成功后，打开项目库页面
  await page.goto(projectLibraryUrl, {
    waitUntil: 'domcontentloaded'
  })

  await page.waitForSelector('.J_scorll_project_own .nav-item, .J_scorll_project_corp .nav-item');
  const projects = await page.$$eval('.J_scorll_project_own .nav-item, .J_scorll_project_corp .nav-item', (els, user, password) => {
    let list = []
    for(let i = 0; i < els.length; i++) {
      list.push({
        id: els[i].getAttribute('mx-click').match(/\((\S*)\)/)[1],
        name: els[i].innerText,
        user,
        password,
        filePath: ''
      })
    }
    return list
  }, user, password)

  await page.close();
  await browser.close();

  return projects
}

module.exports = initScript
