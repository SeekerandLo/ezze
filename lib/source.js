const axios = require('axios');

const jinshan = {
  api: 'http://fy.iciba.com/ajax.php?a=fy&f=auto&t=auto&w=',
  zhResult: 'word_mean',
  enResult: 'out'
}

// baidu-sdk
const baidu = {
  api: 'http://api.fanyi.baidu.com/api/trans/vip/translate',
  transform: function(q, from, to, appid, salt, sign){
    return axios.get(`${baidu.api}?q=${q}&from=${from}&to=${to}&appid=${appid}&salt=${salt}&sign=${sign}`);
  },
}

module.exports = {
  jinshan,
  baidu
};
