import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import getParser from './parsers';
import getRenderer from './renderers';

const getAst = (objBefore, objAfter) => {
  const keysBefore = Object.keys(objBefore);
  const keysAfter = Object.keys(objAfter);
  const united = _.union(keysAfter, keysBefore);

  const resultAst = united.reduce((acc, key) => {
    if (_.has(objAfter, key) && _.has(objBefore, key)) {
      if (objAfter[key] instanceof Object && objBefore[key] instanceof Object) {
        return [...acc, { type: 'nested', key, children: getAst(objBefore[key], objAfter[key]) }];
      }
      if (objAfter[key] === objBefore[key]) {
        return [...acc, { type: 'fixed', key, value: objAfter[key] }];
      }
      return [...acc, {
        type: 'updated', key, valBefore: objBefore[key], valAfter: objAfter[key],
      }];
    } else if (_.has(objAfter, key)) {
      return [...acc, { type: 'added', key, valAfter: objAfter[key] }];
    }
    return [...acc, { type: 'deleted', key, valBefore: objBefore[key] }];
  }, []);
  return resultAst;
};

const genDiff = (pathToFileBefore, pathToFileAfter, outputFormat = 'string') => {
  const ext = path.extname(pathToFileAfter);
  const getObjectFromFile = getParser(ext);

  const fileDataBefore = fs.readFileSync(pathToFileBefore, 'utf-8');
  const fileDataAfter = fs.readFileSync(pathToFileAfter, 'utf-8');
  const objBefore = getObjectFromFile(fileDataBefore);
  const objAfter = getObjectFromFile(fileDataAfter);

  const ast = getAst(objBefore, objAfter);

  const getOutputFromAst = getRenderer(outputFormat);
  return getOutputFromAst(ast);
};

export default genDiff;
