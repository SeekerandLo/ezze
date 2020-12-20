const EzzeUtils = require('./utils');
const source = require('./source');
const { AUTO, ZH, EN, CONFIG_PATH, BAIDU } = require('./constants');

class EzzeApi {
  async transformOnBaiduRetValue(query) {
    const config = EzzeUtils.loadConfig(CONFIG_PATH, BAIDU);
    if (config === null) {
      return;
    }
    const salt = (new Date()).getTime();
    const { appid, secret } = config;
    const sign = EzzeUtils.md5Sign(appid + query + salt + secret);
    let to = ZH;
    if (this._isChinese(query)) {
      to = EN;
      query = encodeURI(query);
    }
    const res = await source.baidu.transform(query, AUTO, to, appid, salt, sign);
    if (res.status === 200) {
      const { data } = res;
      const { from, to, trans_result } = data;
      return trans_result;
    } else {
      return '翻译失败';
    }
  }

  _isChinese(query) {
    const chinese = new RegExp("[\u4E00-\u9FA5]+");
    return chinese.test(query);
  }
}

module.exports = EzzeApi;