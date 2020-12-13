const fs = require('fs');
const crypto = require('crypto');

const sourceMap = {
  baidu: ['appid', 'secret']
}

function check(source, tar) {
  const keys = Object.keys(tar);
  return sourceMap[source].every(key => keys.includes(key));
}

class Utils {
  static loadConfig(configPath = '/data/.ezze_config.json', source) {
    let config = null;
    let configJson = null;
    let targetSource = null;
    try {
      config = fs.readFileSync(configPath);
    } catch (e) {
      console.error('Maybe: Configuration file not found, please check /data/.ezze_config.json does it exist')
      console.log(e);
    }
    try {
      configJson = JSON.parse(String(config));
      targetSource = configJson[source];
      if (targetSource === undefined) {
        throw new Error('Unknow source');
      }
      if (!check(source, targetSource)) {
        throw new Error(`Missing key, '${configPath}'[${source}] should include [${sourceMap[source].toString()}]`);
      }
    } catch (e) {
      console.log(e);
    }
    return targetSource;
  }

  static md5Sign(data) {
    const sign = crypto.createHash('md5').update(data).digest('hex');
    return sign;
  }
}

module.exports = Utils;