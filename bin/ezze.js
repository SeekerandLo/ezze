#!/usr/bin/env node
const process = require('child_process');
const program = require('commander');
const chalk = require('chalk');
const Ezze = require('../lib/ezze');
const ezzeClient = new Ezze();

program.
  option('-s, --screenshot', 'screenshot')

program
  .version('0.1.3', '-v, --version')
  .command('ezze <query>', 'translate words or sentences')
  .action((ezze) => {
    if (ezze.screenshot) {
      ezzeClient.screenshot();
    } else {
      if (ezze.args.length === 0) {
        console.log(chalk.green('  ___ ___________ '))
        console.log(chalk.green(' / _ \\_  /_  / _ \\'))
        console.log(chalk.green('|  __// / / /  __/'))
        console.log(chalk.green(' \\___/___/___\\___| v0.1.3'))
      } else {
        if (ezze.args.length > 1) {
          console.log(chalk.red('╮(╯-╰)╭, Please enter a word. You can wrap the content with a semicolon.'))
        } else {
          ezzeClient.transformOnBaidu(ezze.args[0]);
        }
      }
    }
  })

program.parse(process.argv);