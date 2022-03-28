const config = {
  timeout: 30000, // 超时时间
  width: 1366, // 页面宽度，防止默认太小点击不到
  height: 768, // 页面高度，防止默认太小点击不到
  loginUrl: 'https://www.iconfont.cn/login', //登录页面url
  loginRequestUrl: 'https://www.iconfont.cn/api/account/login.json', // 登录请求url
  projectLibraryUrl: 'https://www.iconfont.cn/manage/index?manage_type=myprojects', // 项目管理url
  detailRequestUrl: 'https://www.iconfont.cn/api/project/detail.json'
}

module.exports = config
