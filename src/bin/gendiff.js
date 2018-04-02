#!/usr/bin/env node

const program = require('commander');

program
  .version('0.0.2')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .arguments('<firstConfig> <secondConfig>')
  .action((first, second) => {
    const firstConfig = first;
    const secondConfig = second;
  });

program.parse(process.argv);

// if (!program.args.length) program.help();
