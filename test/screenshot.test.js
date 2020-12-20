// var screenshot = require('desktop-screenshot'); 
// screenshot("screenshot.png", function (error, complete) {
//    if (error)
//     console.log("Screenshot failed", error); 
//   else 
//     console.log("Screenshot succeeded"); 
// });

const sizeOf = require('image-size');
const { SCREEN_SHOT_NANE } = require('../lib/constants');
const dimensions = sizeOf(SCREEN_SHOT_NANE);
console.log(dimensions);
