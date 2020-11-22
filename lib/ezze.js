const axios = require('axios');
const source = require('./source');
const jinshan = source.jinshan;

const chinese = new RegExp("[\u4E00-\u9FA5]+");

class Ezze {


  /**
   * 英译汉
   * @param {String} query 
   */
  static transform(query) {
    if(chinese.test(query)){
      query = encodeURI(query);
    }
    axios.get(`${jinshan.api}${query}`).then(res => {
      if(res.status === 200){
        const { data } = res;
        const { content } = data;
        console.log(content);
      }
    })
  }


}
module.exports = Ezze;
