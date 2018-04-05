#!/usr/bin/env node
import program from 'commander';
import genDiff from '..';

program
  .version('0.0.7')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstArg, secondArg, options) => {
    const beforeFilePath = firstArg;
    const afterFilePath = secondArg;
    const diff = genDiff(beforeFilePath, afterFilePath, options.format);
    console.log(diff);
  });

program.parse(process.argv);

if (!program.args.length) program.help();
