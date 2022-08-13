const { chalkGreen, spinnerStart, spinnerSucceed } = require('../utils/common');
const { projectLibraryUrl } = require('../utils/iconfont.config');
const { createBrowser, login, getFontClass, pageGo, getProjectInfo, logout } = require('../utils/operation');

let browser = null,       // Puppeteer的Browser对象
    page = null,          // Puppeteer的Page对象
    isFirstEnter = true,  // 是否首次进入
    isNeedLogin = true;   // 是否需要登录

/**
 * @description 根据图标库id获取图标库的最新信息（主要是在线地址）
 * @param {String} id 图标库id
 * @param {String} name 项目名称
 * @param {String} user 账号
 * @param {String} password 密码
 * @param {String} filePath 保存地址
 * @param {Boolean} isRelogin 是否重新登录（多个用户时，不关闭Browser，重新登录即可）
 * @param {Boolean} isCloseBrowser 是否关闭Browser和Page
 * @returns {String} 项目完整信息
 */
const refreshScript = async (id, name, user, password, filePath, isRelogin, isCloseBrowser) => {
  if (isFirstEnter) {
    browser = await createBrowser();
    chalkGreen('✔ 打开Browser');
    page = await browser.pages().then(e => e[0]);
    // page = await browser.newPage();
    chalkGreen('✔ 打开Page');
    isFirstEnter = false;
  }
  
  if (isNeedLogin) {
    await login(page, user, password);
    isNeedLogin = false;
  }
  

  // 登录成功后，打开项目库页面
  await pageGo(page, projectLibraryUrl);

  spinnerStart('开始获取图标库最新数据');
  // 获取当前图标库的最新信息（毕竟图标库的名字也有可能改变的）
  const projects = await getProjectInfo(page, user, password, filePath, id);
  spinnerSucceed('成功获取图标库最新数据');
  let project = projects[0];
  project.fontClass = await getFontClass(page, id);

  if (isRelogin) {
    await logout(page);
    isNeedLogin = true;
  }

  if (isCloseBrowser) {
    await page.close();
    chalkGreen('✔ 关闭Page');
    await browser.close();
    chalkGreen('✔ 关闭Browser');
    page = null;
    browser = null;
    isFirstEnter = true;
    isNeedLogin = true;
  }

  chalkGreen(`✔ 图标库:${name} 数据更新完成🎉🎉🎉`);
  return project
}

module.exports = refreshScript
