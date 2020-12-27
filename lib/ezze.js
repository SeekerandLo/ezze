const screenshot = require('desktop-screenshot');
const child_process = require('child_process');
const fs = require('fs');
const ProgressBar = require('progress');
const EzzeUtils = require('./utils');
const source = require('./source');
const green = '\u001b[42m \u001b[0m';
const bar = new ProgressBar(`[:bar]`, { total: 10, complete: green });
const { AUTO, ZH, EN, CONFIG_PATH, BAIDU, SCREEN_SHOT_NANE } = require('./constants');
const electron = require('electron/index');

class Ezze {
  constructor() {
    this.down = false;
    this.timer = null;
  }

  screenshot() {
    const screenshotPath = process.cwd();
    const filePath = `${screenshotPath}/${SCREEN_SHOT_NANE}`;
    screenshot(filePath, (error, complete) => {
      if (error) {
        console.log(`[error]: screenshot failed, ${error}`);
      } else {
        // TODO 通过node来启动electron
        const ezzePath = `${EzzeUtils.ezzePath()}/lib/window/index.js`;
        if (fs.existsSync(ezzePath)) {
          child_process.exec(`${electron} ${ezzePath}`);
        } else {
          console.log(`[error]: ${ezzePath} does not exist`)
        }
      }
    });
  }


  transformOnBaidu(query) {
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
    this._procesStart();
    source.baidu.transform(query, AUTO, to, appid, salt, sign).then(res => {
      if (res) {
        this._processEnd();
      }
      if (res.status === 200) {
        const { data } = res;
        const { from, to, trans_result } = data;
        if (trans_result) {
          trans_result.forEach(result => {
            console.log(result.src);
            console.log();
            console.log(result.dst);
            console.log(new Array(to == EN ? result.dst.length : result.dst.length * 2).fill('-').join(''));
          })
        }
      } else {
        console.log(res);
      }
    })
  }

  _isChinese(query) {
    const chinese = new RegExp('[\u4E00-\u9FA5]+');
    return chinese.test(query);
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
