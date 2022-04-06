/**
 * puppeteer的公共操作：
 * 1. createBrowser：创建浏览器对象（含默认配置）
 * 2. login：登录
 * 3. handleIknowBtn：处理“我知道了”按钮
 */
const puppeteer = require('puppeteer');

 // 超时时间，登录页面url，登录请求url，项目管理url
const { timeout, width, height, loginUrl, loginRequestUrl, projectLibraryUrl, detailRequestUrl } = require('../utils/iconfont.config');
// 开始打印 && 成功打印 && 主动抛错
const { spinnerStart, spinnerSucceed, throwError, extend, getNowTime } = require('../utils/common');

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

// 创建Browser
const createBrowser = async (option = {}) => await puppeteer.launch(extend(defaultOption, option))

// 这种方式会导致page对象没有提示且需传入browser对象，typescript的断言真好；省不了几行代码，因此先不使用
// const createPage = async (browser) => await browser.newPage()

// 页面跳转
const pageGo = async (page, url) => await page.goto(url, { waitUntil: 'domcontentloaded' })

// 登录
const login = async (page, user, password) => {
  await pageGo(page, loginUrl);
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

// 退出登录
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
// 注意：需要等收起在线链接、下载到本地等按钮出现才会有这个指引按钮
const handleIknowBtn = async (page) => {
  await page.$$eval('.btn-iknow', btns => btns.map(btn => btn.click()));
}

// 获取所有的图标库的基本信息，如果传具体的图标库id，只获取该图标库，否则获取所有
const getProjectInfo = async (page, user, password, filePath = '', projectId = '') => {
  await page.waitForSelector('.J_scorll_project_own .nav-item, .J_scorll_project_corp .nav-item');
  const nowTime = getNowTime();
  let projects = await page.$$eval('.J_scorll_project_own .nav-item, .J_scorll_project_corp .nav-item', (els, user, password, filePath, nowTime, projectId) => {
    let list = [];
    for(let i = 0; i < els.length; i++) {
      let item = {
        id: els[i].getAttribute('mx-click').match(/\((\S*)\)/)[1],
        name: els[i].innerText,
        user,
        password,
        filePath,
        fontClass: '',
        updateTime: nowTime
      }
      if (projectId !== '') {
        if (item.id == projectId) {
          list.push(item);
          break;
        }
      } else {
        list.push(item)
      }
    }
    return list
  }, user, password, filePath, nowTime, projectId)
  return projects || []
}

/**
 * @description 获取某个图标库的在线链接fontClass
 * @param {Object} page Puppeteer的page对象
 * @param {String} projectId 图标库id
 * @returns {String} fontClass 在线链接
 */
const getFontClass = async (page, projectId) => {
  await pageGo(page, `${projectLibraryUrl}&projectId=${projectId}`)
  await page.waitForSelector('.bar-link');
  // 处理使用指引的按钮的干扰，点击所有可视的“我知道了”按钮（可能有多个）
  await handleIknowBtn(page);
  let coverBtnLen = 0, codeLink = '', fontClass = '';
  coverBtnLen = await page.$$eval('.cover-btn', btns => btns.length);
  coverBtnLen === 0 && await page.click('.bar-link');
  // 第一次生成链接时
  await page.waitForSelector('.code-link');

  coverBtnLen = await page.$$eval('.cover-btn', btns => btns.length);
  codeLink = await page.$eval('.code-link', el => el.innerText)
  if (coverBtnLen === 2) {
    // 点击更新代码
    await page.$$eval('.cover-btn', btns => btns.map((btn, index) => index === 1 && btn.click()));
    await page.waitForResponse(response => response.url().includes(detailRequestUrl));
  } else if (coverBtnLen === 1 && !codeLink) {
    await page.click('.cover-btn');
    await page.waitForResponse(response => response.url().includes(detailRequestUrl));
  }
  await page.waitForSelector('.code-link');
  fontClass = await page.$eval('.code-link', el => el.innerText);
  return fontClass || ''
}

module.exports = {
  createBrowser,
  pageGo,
  login,
  loginout,
  handleIknowBtn,
  getProjectInfo,
  getFontClass
}
