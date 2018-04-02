import genDiff from '../src/genDiff';

const fs = require('fs');

test('compare two simple json config files', () => {
  const path1 = './__tests__/__fixtures__/before.json';
  const path2 = './__tests__/__fixtures__/after.json';
  const resultPath = './__tests__/__fixtures__/compareResult.json';

  const diff = genDiff(path1, path2);
  const result = fs.readFileSync(resultPath, 'utf-8');

  expect(diff).toEqual(result);
});
