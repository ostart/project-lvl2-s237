import fs from 'fs';
import genDiff from '../src';

describe('Simple files', () => {
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

  test('compare two simple ini config files', () => {
    const path1 = './__tests__/__fixtures__/before.ini';
    const path2 = './__tests__/__fixtures__/after.ini';
    const resultPath = './__tests__/__fixtures__/compareResult.txt';

    const diff = genDiff(path1, path2);
    const result = fs.readFileSync(resultPath, 'utf-8');

    expect(diff).toEqual(result);
  });
});

describe('Complicated files Default output format', () => {
  test('compare two complicated json config files', () => {
    const path1 = './__tests__/__fixtures__/beforeComplex.json';
    const path2 = './__tests__/__fixtures__/afterComplex.json';
    const resultPath = './__tests__/__fixtures__/compareResultComplex.txt';

    const diff = genDiff(path1, path2);
    const result = fs.readFileSync(resultPath, 'utf-8');

    expect(diff).toEqual(result);
  });

  test('compare two complicated yaml config files', () => {
    const path1 = './__tests__/__fixtures__/beforeComplex.yml';
    const path2 = './__tests__/__fixtures__/afterComplex.yml';
    const resultPath = './__tests__/__fixtures__/compareResultComplex.txt';

    const diff = genDiff(path1, path2);
    const result = fs.readFileSync(resultPath, 'utf-8');

    expect(diff).toEqual(result);
  });

  test('compare two complicated ini config files', () => {
    const path1 = './__tests__/__fixtures__/beforeComplex.ini';
    const path2 = './__tests__/__fixtures__/afterComplex.ini';
    const resultPath = './__tests__/__fixtures__/compareResultComplex.txt';

    const diff = genDiff(path1, path2);
    const result = fs.readFileSync(resultPath, 'utf-8');

    expect(diff).toEqual(result);
  });
});

describe('Complicated files Plain output format', () => {
  test('compare two complicated json config files in plain format', () => {
    const path1 = './__tests__/__fixtures__/beforeComplex.json';
    const path2 = './__tests__/__fixtures__/afterComplex.json';
    const resultPath = './__tests__/__fixtures__/comparePlainComplex.txt';

    const diff = genDiff(path1, path2, 'plain');
    const result = fs.readFileSync(resultPath, 'utf-8');

    expect(diff).toEqual(result);
  });

  test('compare two complicated yaml config files in plain format', () => {
    const path1 = './__tests__/__fixtures__/beforeComplex.yml';
    const path2 = './__tests__/__fixtures__/afterComplex.yml';
    const resultPath = './__tests__/__fixtures__/comparePlainComplex.txt';

    const diff = genDiff(path1, path2, 'plain');
    const result = fs.readFileSync(resultPath, 'utf-8');

    expect(diff).toEqual(result);
  });

  test('compare two complicated ini config files in plain format', () => {
    const path1 = './__tests__/__fixtures__/beforeComplex.ini';
    const path2 = './__tests__/__fixtures__/afterComplex.ini';
    const resultPath = './__tests__/__fixtures__/comparePlainComplex.txt';

    const diff = genDiff(path1, path2, 'plain');
    const result = fs.readFileSync(resultPath, 'utf-8');

    expect(diff).toEqual(result);
  });
});

describe('Complicated files Json output format', () => {
  test('compare two complicated json config files in json format', () => {
    const path1 = './__tests__/__fixtures__/beforeComplex.json';
    const path2 = './__tests__/__fixtures__/afterComplex.json';
    const resultPath = './__tests__/__fixtures__/compareJsonComplex.json';

    const diff = genDiff(path1, path2, 'json');
    const result = fs.readFileSync(resultPath, 'utf-8');

    expect(diff).toEqual(result);
  });

  test('compare two complicated yaml config files in json format', () => {
    const path1 = './__tests__/__fixtures__/beforeComplex.yml';
    const path2 = './__tests__/__fixtures__/afterComplex.yml';
    const resultPath = './__tests__/__fixtures__/compareJsonComplex.json';

    const diff = genDiff(path1, path2, 'json');
    const result = fs.readFileSync(resultPath, 'utf-8');

    expect(diff).toEqual(result);
  });

  test('compare two complicated ini config files in json format', () => {
    const path1 = './__tests__/__fixtures__/beforeComplex.ini';
    const path2 = './__tests__/__fixtures__/afterComplex.ini';
    const resultPath = './__tests__/__fixtures__/compareJsonComplexIni.json';

    const diff = genDiff(path1, path2, 'json');
    const result = fs.readFileSync(resultPath, 'utf-8');

    expect(diff).toEqual(result);
  });
});
