const puppeteer = require('puppeteer');
const log = console.log;
const chalk = require('chalk');

const { loginUrl, projectLibraryUrl } = require('./iconfont.config');

const initScript = async (user, password) => {
  // 打开Browser和Page，跳转到登录页面
  const browser = await puppeteer.launch({ headless: true, timeout: 30000 });
  log(chalk.green('✔ 打开Browser'));
  const page = await browser.newPage();
  log(chalk.green('✔ 打开Page'));
  await page.goto(loginUrl, { waitUntil: 'networkidle0' });

  // 输入账号密码，点击登录按钮
  log(chalk.green('✔ 登录开始'));
  await page.type('#userid', user, { delay: 50 });
  await page.type('#password', password, { delay: 50 });
  await page.click('.mx-btn-submit');
  await page.waitForNetworkIdle();
  log(chalk.green('✔ 登录成功'));

  // 登录成功后，打开项目库页面
  await page.goto(projectLibraryUrl, {
    waitUntil: 'networkidle0'
  })

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
