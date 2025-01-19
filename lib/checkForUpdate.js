const pacote = require('pacote');
const semver = require('semver');
const pkg = require('../package.json');
const { spinnerStart, spinnerSucceed } = require('../utils/common');

async function checkForUpdate() {
  try {
    spinnerStart('检查更新...');
    const manifest = await pacote.manifest(`${pkg.name}@latest`);
    const latestVersion = manifest.version;
    const currentVersion = pkg.version;
    const isNotLatest = semver.gt(latestVersion, currentVersion);
    spinnerSucceed(isNotLatest ? `发现新版本，建议更新：${currentVersion} -> ${latestVersion}, npm install iconfont-manager -g` : '检查完成：当前iconfont-manager已是最新版本');
  } catch (err) {
    console.error('检查更新错误:', err.message);
  }
}

module.exports = () => {
  return checkForUpdate().catch(err => {
    throw err
  })
}