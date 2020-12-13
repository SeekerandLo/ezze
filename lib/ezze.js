const ProgressBar = require('progress');
const EzzeUtils = require('./utils');
const source = require('./source');
const green = '\u001b[42m \u001b[0m';
const bar = new ProgressBar(`[:bar]`, { total: 10, complete: green });
const { AUTO, ZH, EN, CONFIG_PATH, BAIDU } = require('./constants');

class Ezze {
  constructor() {
    this.down = false;
    this.timer = null;
  }

  _isChinese(query) {
    const chinese = new RegExp("[\u4E00-\u9FA5]+");
    return chinese.test(query);
  }

  transformOnBaidu(query) {
    const config = EzzeUtils.loadConfig(CONFIG_PATH, BAIDU);
    const salt = (new Date()).getTime();
    const { appid, secret } = config;
    const sign = EzzeUtils.md5Sign(appid + query + salt + secret);
    let to = ZH;
    if (this._isChinese(query)) {
      to = EN;
      query = encodeURI(query);
    }
    this._procesStart();
    source.baidu.transform(query, AUTO, to, appid, salt, sign).then(res => {
      if (res) {
        this._processEnd();
      }
      if (res.status === 200) {
        const { data } = res;
        const { from, to, trans_result } = data;
        console.log(trans_result);
      } else {
        console.log(res);
      }
    })
  }

  _procesStart() {
    this.timer = setInterval(() => {
      if (bar.curr === 8) {
        this.down = true;
      } else if (bar.curr === 2) {
        this.down = false;
      }
      bar.tick(this.down ? -1 : 1);
    }, 100);
  }

  _processEnd() {
    bar.tick(10);
    bar.terminate();
    clearInterval(this.timer);
  }
}

module.exports = Ezze;
