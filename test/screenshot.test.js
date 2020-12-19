var screenshot = require('desktop-screenshot'); 
screenshot("screenshot.png", function (error, complete) {
   if (error)
    console.log("Screenshot failed", error); 
  else 
    console.log("Screenshot succeeded"); 
});