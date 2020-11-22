const ProgressBar = require('progress');
const axios = require('axios');
const source = require('./source');
const jinshan = source.jinshan;
const { enResult, zhResult } = jinshan;
const chinese = new RegExp("[\u4E00-\u9FA5]+");
const green = '\u001b[42m \u001b[0m';
const bar = new ProgressBar(`[:bar]`, { total: 10, complete: green });

class Ezze {

  /**
   * @param {String} query 
   */
  static transform(query) {
    if (chinese.test(query)) {
      query = encodeURI(query);
    }
    const timer = setInterval(function () {
      bar.tick();
    }, 100);
    axios.get(`${jinshan.api}${query}`).then(res => {
      if (res) {
        bar.tick(10);
        bar.terminate();
        clearInterval(timer);
      }

      if (res.status === 200) {
        const { data } = res;
        const { content } = data;
        console.log(content[enResult] || content[zhResult]);
      } else {
        console.error('查询失败');
        console.log(res);
      }
    })
  }


}
module.exports = Ezze;
