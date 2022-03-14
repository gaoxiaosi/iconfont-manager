const puppeteer = require('puppeteer');
const { chalkGreen, spinnerStart, spinnerSucceed, throwError, getNowTime } = require('../utils/common');
const { timeout, loginUrl, loginRequestUrl, projectLibraryUrl, detailRequestUrl } = require('../utils/iconfont.config');

const refreshScript = async (user, password, projectId, filePath) => {
  // 打开Browser和Page，跳转到登录页面
  const browser = await puppeteer.launch({ 
    headless: true,
    timeout,
    defaultViewport: { // 默认视窗较小，宽高建议设置一下，防止页面需要滚动或者样式乱
      width: 1366,
      height: 768
    }
  });
  chalkGreen('✔ 打开Browser');
  const page = await browser.newPage();
  chalkGreen('✔ 打开Page');
  await page.goto(loginUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#userid');
  await page.waitForSelector('#password');
  spinnerStart('开始登录');
  // 先清空表单，再重新输入账号密码（切换用户登录时输入框可能有缓存）
  await page.$eval('#userid', (input, user) => { input.value = user }, user);
  await page.$eval('#password', (input, password) => { input.value = password }, password);
  // 登录请求结束后1秒，如果页面已经跳转，登录成功，代码照常执行，否则判断为登录失败
  page.on('response', async(r) => {
    if(r.url().includes(loginRequestUrl)) {
      await page.waitForTimeout(1000);
      !page.isClosed() && await page.$('.mx-btn-submit') && throwError('登录失败，账号或密码错误');
    }
  })
  await page.click('.mx-btn-submit');
  await page.$('#userid-error') && throwError('账号不合法');
  await page.$('#password-error') && throwError('密码不合法');
  await page.waitForNavigation();
  spinnerSucceed('登录成功');

  // 登录成功后，打开项目库页面
  await page.goto(projectLibraryUrl, {
    waitUntil: 'domcontentloaded'
  })

  // 获取所有的项目信息
  await page.waitForSelector('.J_scorll_project_own .nav-item, .J_scorll_project_corp .nav-item');
  const nowTime = getNowTime();
  let project = await page.$$eval('.J_scorll_project_own .nav-item, .J_scorll_project_corp .nav-item', (els, user, password, projectId, filePath, nowTime) => {
    let data = {}, id = '';
    for(let i = 0; i < els.length; i++) {
      id = els[i].getAttribute('mx-click').match(/\((\S*)\)/)[1];
      if (id === projectId) {
        data = {
          id,
          name: els[i].innerText,
          user,
          password,
          filePath,
          fontClass: '',
          updateTime: nowTime
        }
        break;
      }
    }
    return data
  }, user, password, projectId, filePath, nowTime)

  // 处理使用指引的按钮的干扰，点击所有可视的“我知道了”按钮（可能有多个）
  await page.$$eval('.btn-iknow', btns => btns.map(btn => btn.clientWidth > 0 && btn.click()));

  await page.goto(`${projectLibraryUrl}&projectId=${projectId}`)
  await page.waitForSelector('.bar-link');
  let coverBtnLen = 0;
  coverBtnLen = await page.$$eval('.cover-btn', btns => btns.length);
  coverBtnLen === 0 && await page.click('.bar-link');
  // 第一次生成链接时
  await page.waitForSelector('.code-link');
  // 点击更新代码
  await page.$$eval('.cover-btn', btns => btns.map((btn, index) => index === 1 && btn.click()));
  coverBtnLen = await page.$$eval('.cover-btn', btns => btns.length);
  coverBtnLen === 2 && await page.waitForResponse(response => response.url().includes(detailRequestUrl));
  project.fontClass = await page.$eval('.code-link', el => el.innerText);

  await page.close();
  await browser.close();

  return project
}

module.exports = refreshScript
