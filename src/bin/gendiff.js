#!/usr/bin/env node
import program from 'commander';
import genDiff from '..';

program
  .version('0.0.2')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .arguments('<firstConfig> <secondConfig>')
  .action((first, second) => {
    const firstConfig = first;
    const secondConfig = second;
    const diff = genDiff(firstConfig, secondConfig);
    console.log(diff);
  });

program.parse(process.argv);

// if (!program.args.length) program.help();
