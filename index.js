const program = require('commander');
const chalk = require('chalk');
const Ezze = require('./lib/ezze');
const ezzeClient = new Ezze();

program
  .version('0.0.6', '-v, --version')
  .command('ezze [query]', 'translate words or sentences')
  .action((ezze) => {
    if (ezze.args.length === 0) {
      console.log(chalk.green('  ___ ___________ '))
      console.log(chalk.green(' / _ \\_  /_  / _ \\'))
      console.log(chalk.green('|  __// / / /  __/'))
      console.log(chalk.green(' \\___/___/___\\___| v0.0.6'))
    } else
      if (ezze.args.length > 1) {
        console.log('╮(╯-╰)╭, Please enter a word. You can wrap the content with a semicolon.')
      } else {
        ezzeClient.transform(ezze.args[0]);
      }
  })
  .parse(process.argv);