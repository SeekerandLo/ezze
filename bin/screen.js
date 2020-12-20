#!/usr/bin/env node
const process = require('child_process');
const program = require('commander');
const EzzeUtils = require('../lib/utils');

program.
  option('-s, --screenshot', 'screenshot')

program
  .command('ezze <query>', 'translate words or sentences')
  .action((ezze) => {
    if (ezze.screenshot) {
      EzzeUtils.screenshot();
    }
  })

program.parse(process.argv);