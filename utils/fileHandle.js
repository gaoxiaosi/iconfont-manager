const fs = require('fs-extra');
const compressing = require('compressing');
const homedir = require('os').homedir();

const { joinPath } = require('./common');

// 解析用户目录下的.iconfontrc文件
const readConfig = async () => {
  let config = []
  if(!fs.existsSync(joinPath(homedir, '.iconfontrc'))) {
    console.error(`.iconfontrc不存在，请使用iconfont-manager init <phoneNumber> <password>进行初始化或新建该文件或自行在${homedir}目录下新建该文件`);
  } else {
    try {
      config = await fs.readJSON(joinPath(homedir, '.iconfontrc'));
    } catch(err) {
      console.error(err)
    }
  }
  return config
}

// 解析用户目录下的.iconfontrc文件
const writeConfig = async (content) => {
  if(!fs.existsSync(joinPath(homedir, '.iconfontrc'))) {
    console.error(`.iconfontrc不存在，请使用iconfont-manager init <phoneNumber> <password>进行初始化或新建该文件或自行在${homedir}目录下新建该文件`);
  } else {
    try {
      await fs.writeJSON(joinPath(homedir, '.iconfontrc'), content);
    } catch(err) {
      console.error(err)
    }
  }
}

// 解压downloa.zip
const compressingZip = async(path) => {
  await compressing.zip.uncompress(joinPath(path, 'download.zip'), path)
}

// 通用（同步函数）：是否存在
const isExist = path => fs.existsSync(path)

// 通用：删除文件或文件夹，需先判断是否存在
const createFile = async (file) => !isExist(file) && await fs.createFile(file);

// 通用：删除文件或文件夹，需先判断是否存在
const removeFile = async (file) => isExist(file) && await fs.remove(file)

// 删除原有iconfont文件夹和下载的download.zip
async function deleteDir(path) {
  await removeFile(joinPath(path, 'iconfont'));
  await removeFile(joinPath(path, 'download.zip'));
}

// 将download.zip解压后前缀为font_的文件夹重命名为iconfont
async function renameDir(path) {
  const dirs = fs.readdirSync(path);
  for (let dir of dirs) {
    if (dir.startsWith('font_')) {
      await fs.rename(joinPath(path, dir), joinPath(path, 'iconfont'));
      break;
    }
  }
}

module.exports = {
  readConfig,
  writeConfig,
  isExist,
  createFile,
  removeFile,
  compressingZip,
  deleteDir,
  renameDir
}
