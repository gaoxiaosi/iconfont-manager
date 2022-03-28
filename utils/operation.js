/**
 * puppeteer的公共操作：
 * 1. createBrowser：创建浏览器对象（含默认配置）
 * 2. login：登录
 * 3. handleIknowBtn：处理“我知道了”按钮
 */
const puppeteer = require('puppeteer');

 // 超时时间，登录页面url，登录请求url，项目管理url
const { timeout, width, height, loginUrl, loginRequestUrl } = require('../utils/iconfont.config');
// 开始打印 && 成功打印 && 主动抛错
const { spinnerStart, spinnerSucceed, throwError } = require('../utils/common');

// Browser的默认设置
const defaultOption = {
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  ignoreHTTPSErrors: true,
  executablePath: process.env.CHROME_PUPPETEER_PATH || undefined,
  dumpio: false,
  headless: true,
  timeout,
  defaultViewport: { // 默认视窗较小，宽高建议设置一下，防止页面需要滚动或者样式乱
    width,
    height
  },
}

const createBrowser = async (option) => await puppeteer.launch(Object.assign(defaultOption, option || {}))

// 这种方式会导致page对象没有提示且需传入browser对象，省不了几行代码，暂不需对page进行设置，因此先不使用
// const createPage = async (browser) => await browser.newPage()

const login = async (page, user, password) => {
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
}

const loginout = async (page) => {
  spinnerStart('开始退出登录');
  // 鼠标滑过右上角用户头像，点击退出按钮退出登录
  await page.hover('.quick-menu > ul > li:last-child');
  await page.click('.quick-menu .head-dropdown:last-child li:last-child');
  // await page.waitForNavigation();
  await page.waitForNetworkIdle();
  spinnerSucceed('退出登录成功');
}

// 处理使用指引的按钮的干扰，点击所有可视的“我知道了”按钮（可能有多个）
const handleIknowBtn = async (page) => {
  await page.$$eval('.btn-iknow', btns => btns.map(btn => btn.clientWidth > 0 && btn.click()));
}

module.exports = {
  createBrowser,
  login,
  loginout,
  handleIknowBtn
}
