const fs = require('fs-extra');
const path = require('path');
const homedir = require('os').homedir();

// 解析用户目录下的.iconfontrc文件
const writeConfig = async function (content) {
  if(!fs.existsSync(path.join(homedir, '.iconfontrc'))) {
    console.error(`.iconfontrc不存在，请使用iconfont-update-cli init <phoneNumber> <password>进行初始化或新建该文件或自行在${homedir}目录下新建该文件`);
  } else {
    try {
      await fs.writeJSON(path.join(homedir, '.iconfontrc'), content);
    } catch(err) {
      console.error(err)
    }
  }
}

module.exports = writeConfig