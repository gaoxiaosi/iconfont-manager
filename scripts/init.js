const { chalkGreen, getNowTime } = require('../utils/common');
const { projectLibraryUrl, detailRequestUrl } = require('../utils/iconfont.config');
const { createBrowser, login, handleIknowBtn } = require('../utils/operation');

const initScript = async (user, password) => {
  const browser = await createBrowser();
  chalkGreen('✔ 打开Browser');
  const page = await browser.newPage();
  chalkGreen('✔ 打开Page');
  await login(page, user, password);

  // 登录成功后，打开项目库页面
  await page.goto(projectLibraryUrl, {
    waitUntil: 'domcontentloaded'
  })

  // 获取所有的图标库信息
  await page.waitForSelector('.J_scorll_project_own .nav-item, .J_scorll_project_corp .nav-item');
  const nowTime = getNowTime();
  let projects = await page.$$eval('.J_scorll_project_own .nav-item, .J_scorll_project_corp .nav-item', (els, user, password, nowTime) => {
    let list = [];
    for(let i = 0; i < els.length; i++) {
      list.push({
        id: els[i].getAttribute('mx-click').match(/\((\S*)\)/)[1],
        name: els[i].innerText,
        user,
        password,
        filePath: '',
        fontClass: '',
        // symbol: '', symbol和fontClass链接一样，只是后缀改为js
        updateTime: nowTime
      })
    }
    return list
  }, user, password, nowTime)

  // 处理使用指引的按钮的干扰，点击所有可视的“我知道了”按钮（可能有多个）
  await handleIknowBtn(page);

  for (let i = 0; i < projects.length; i++) {
    await page.goto(`${projectLibraryUrl}&projectId=${projects[i].id}`)
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
    projects[i].fontClass = await page.$eval('.code-link', el => el.innerText);
  }

  await page.close();
  await browser.close();

  return projects
}

module.exports = initScript
