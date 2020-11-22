const program = require('commander');
const Ezze = require('./lib/ezze');

program
  .arguments('<query>')
  .action((query) => {
    Ezze.transform(query);
  })
  .parse(process.argv);