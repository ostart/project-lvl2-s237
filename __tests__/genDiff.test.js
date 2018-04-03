import fs from 'fs';
import genDiff from '../src';

test('compare two simple json config files', () => {
  const path1 = './__tests__/__fixtures__/before.json';
  const path2 = './__tests__/__fixtures__/after.json';
  const resultPath = './__tests__/__fixtures__/compareResult.txt';

  const diff = genDiff(path1, path2);
  const result = fs.readFileSync(resultPath, 'utf-8');

  expect(diff).toEqual(result);
});

test('compare two simple yaml config files', () => {
  const path1 = './__tests__/__fixtures__/before.yml';
  const path2 = './__tests__/__fixtures__/after.yml';
  const resultPath = './__tests__/__fixtures__/compareResult.txt';

  const diff = genDiff(path1, path2);
  const result = fs.readFileSync(resultPath, 'utf-8');

  expect(diff).toEqual(result);
});
