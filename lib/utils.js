const fs = require('fs');
const os = require('os')
const crypto = require('crypto');
const chalk = require('chalk');
const screenshot = require('desktop-screenshot');
const { SCREEN_SHOT_NANE } = require('./constants');

const sourceMap = {
  baidu: ['appid', 'secret']
}

function check(source, tar) {
  const keys = Object.keys(tar);
  return sourceMap[source].every(key => keys.includes(key));
}

class Utils {
  static loadConfig(configPath = '/data/.ezze_config.json', source = 'baidu') {
    let config = null;
    let configJson = null;
    let targetSource = null;
    try {
      config = fs.readFileSync(configPath);
    } catch (e) {
      chalk.red('[error]: Maybe, Configuration file not found, please check /data/.ezze_config.json does it exist')
      console.log('[error]: Maybe, Configuration file not found, please check /data/.ezze_config.json does it exist')
      process.exit(1);
    }
    try {
      configJson = JSON.parse(String(config));
      targetSource = configJson[source];
      if (targetSource === undefined) {
        chalk.red(`[error]: Unknow source, the source is '${source}'`);
        console.log(`[error]: Unknow source, the source is '${source}'`)
      }
      if (!check(source, targetSource)) {
        chalk.red(`[error]: Missing key, '${configPath}' should include 'baidu: {${sourceMap[source].toString()}}'`);
        console.log(`[error]: Missing key, '${configPath}' should include 'baidu: {${sourceMap[source].toString()}}'`);
      }
    } catch (e) {
      process.exit(1);
    }
    return targetSource;
  }

  static md5Sign(data) {
    const sign = crypto.createHash('md5').update(data).digest('hex');
    return sign;
  }

  static screenshot() {
    const screenshotPath = process.cwd();
    const filePath = `${screenshotPath}/${SCREEN_SHOT_NANE}`;
    screenshot(filePath, (error, complete) => {
      if (error) {
        console.log('[error]: screenshot failed', error);
      } else {
        console.log('[info]: screenshot success');
      }
    });
  }

  /**
   * 获取ezze的绝对路径
   */
  static ezzePath() {
    // TODO 判断是否存在nvm
    if (process.platform === 'darwin') {
      // 假设存在nvm
      const userHome = process.env.HOME;
      const version = process.version;

      if (true) {
        return `${userHome}/.nvm/versions/node/${version}/lib/node_modules/ezze`
      }
    }
    if (process.platform === 'win32') {
      const userInfo = os.userInfo()
      const userHome = userInfo.homedir;
      return `${userHome}/AppData/Roaming/npm/node_modules/ezze`;
    }
  }
}

module.exports = Utils;