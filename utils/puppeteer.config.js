const headless = true
// Browser的默认设置
const config = {
  headless,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  ignoreHTTPSErrors: true,
  executablePath: process.env.CHROME_PUPPETEER_PATH || undefined,
  dumpio: false,
  timeout: 30000,
  defaultViewport: { // 默认视窗较小，宽高建议设置一下，防止页面需要滚动或者样式乱
    width: 1366, // 页面宽度，防止默认太小点击不到
    height: 768, // 页面高度，防止默认太小点击不到
  },
}

module.exports = config
