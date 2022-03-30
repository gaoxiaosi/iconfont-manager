const { chalkGreen, spinnerStart, spinnerSucceed } = require('../utils/common');
const { projectLibraryUrl } = require('../utils/iconfont.config');
const { createBrowser, login, getFontClass, pageGo, getProjectInfo } = require('../utils/operation');

const refreshScript = async (user, password, projectId, filePath) => {
  const browser = await createBrowser();
  chalkGreen('✔ 打开Browser');
  const page = await browser.newPage();
  chalkGreen('✔ 打开Page');
  await login(page, user, password);

  // 登录成功后，打开项目库页面
  await pageGo(page, projectLibraryUrl);

  spinnerStart('开始获取图标库在线链接');
  // 获取当前图标库的最新信息（毕竟图标库的名字也有可能改变的）
  const projects = await getProjectInfo(page, user, password, filePath, projectId);
  spinnerSucceed('成功获取图标库在线链接');
  let project = projects[0];
  project.fontClass = await getFontClass(page, projectId);

  await page.close();
  await browser.close();

  return project
}

module.exports = refreshScript
