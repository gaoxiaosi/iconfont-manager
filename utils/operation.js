/**
 * puppeteer的公共操作：
 * 1. createBrowser：创建浏览器对象（含默认配置）
 * 2. login：登录
 * 3. logout：退出登录
 * 4. handleIknowBtn：处理“我知道了”按钮
 * 5. getProjectInfo：获取图标库信息
 * 6. getFontClass：获取图标库在线地址
 */
const puppeteer = require('puppeteer');

 // 超时时间，登录页面url，登录请求url，项目管理url
const { loginUrl, loginRequestUrl, projectLibraryUrl, detailRequestUrl } = require('../utils/iconfont.config');
// 开始打印 && 成功打印 && 主动抛错 && 合并配置 && 获取当前时间
const { spinnerStart, spinnerSucceed, throwError, extend, getNowTime } = require('../utils/common');

// 创建Browser
const puppeteerOption = require('./puppeteer.config');
const createBrowser = async (option = {}) => await puppeteer.launch(extend(puppeteerOption, option));

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
  // 先聚焦再失焦检测账号或密码是否合法（focus无法使用，原因不详）
  await page.click('#userid');
  await page.click('#password');
  await page.click('#userid');
  await page.$('#userid-error') && throwError('账号不合法或错误');
  await page.$('#password-error') && throwError('密码不合法或错误');
  await Promise.all([
    page.click('.mx-btn-submit'),
    page.waitForResponse(response => response.url().includes(loginRequestUrl))
  ])
  // 登录成功后会立即跳转，如果仍在当前页面，则是账号或密码错误
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await page.$('.mx-btn-submit') && throwError('账号或密码错误');
  spinnerSucceed('登录成功');
}

// 退出登录：鼠标滑过右上角用户头像，点击退出按钮退出登录
const logout = async (page) => {
  spinnerStart('开始退出登录');
  await page.hover('.quick-menu > ul > li:last-child');
  await page.click('.quick-menu> ul > li:last-child > .head-dropdown > li:last-child');
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
  await pageGo(page, `${projectLibraryUrl}&projectId=${projectId}`);
  // 如果图标库的图标数量为0，则直接返回
  await page.waitForSelector('.icon-count');
  const iconCount = await page.$eval('.icon-count span', e => e.innerText);
  if (Number(iconCount) === 0) {
    return '空的图标库，无法生成链接'
  }
  await page.waitForSelector('.bar-link');
  await handleIknowBtn(page);
  let coverBtnLen = 0, codeLink = '', fontClass = '';
  coverBtnLen = await page.$$eval('.cover-btn', btns => btns.length);
  // 如果在线链接是收起状态，点击查看在线链接
  coverBtnLen === 0 && await page.click('.bar-link');
  await page.waitForSelector('.code-link');
  coverBtnLen = await page.$$eval('.cover-btn', btns => btns.length);
  codeLink = await page.$eval('.code-link', el => el.innerText);
  // 情况1：codeLink为空 && coverBtnLen = 1 → 第一次生成链接
  // 情况2：codeLink有值 && coverBtnLen = 1 → 已有链接 ，且不用更新（啥也不用干）
  // 情况3：codeLink有值 && coverBtnLen = 2 → 已有链接，需要更新
  // 若是情况1和3，点击更新代码，点击确认（更新）
  if (!codeLink || coverBtnLen !== 1) {
    await page.$$eval('.cover-btn', (btns, coverBtnLen) => btns.map((btn, index) => index === coverBtnLen - 1 && btn.click()), coverBtnLen);
    await page.waitForSelector('.mx-modal-footer');
    await Promise.all([
      page.$$eval('.mx-modal-footer > button', btns => btns.map((btn, index) => index === 0 && btn.click())),
      page.waitForResponse(response => response.url().includes(detailRequestUrl))
    ])
  }
  await page.waitForSelector('.code-link');
  fontClass = await page.$eval('.code-link', el => el.innerText);
  return fontClass || ''
}

module.exports = {
  createBrowser,
  pageGo,
  login,
  logout,
  handleIknowBtn,
  getProjectInfo,
  getFontClass
}
