import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import getParser from './parsers';
import getRenderer from './renderers';

const getArrFromObj = obj => Object.keys(obj).reduce((acc, value) => {
  if (obj[value] instanceof Object) {
    return [...acc, ['fix', value, getArrFromObj(obj[value])]];
  }
  return [...acc, ['fix', value, obj[value]]];
}, []);

const getAst = (objBefore, objAfter) => {
  const keysBefore = Object.keys(objBefore);
  const keysAfter = Object.keys(objAfter);
  const united = _.union(keysAfter, keysBefore);

  const resultAst = united.reduce((acc, value) => {
    if (_.has(objAfter, value) && _.has(objBefore, value)) {
      if (objAfter[value] instanceof Object && objBefore[value] instanceof Object) {
        return [...acc, ['fix', value, getAst(objBefore[value], objAfter[value])]];
      } else if (objAfter[value] instanceof Object) {
        return [...acc, ['upd', value, objBefore[value], getArrFromObj(objAfter[value])]];
      } else if (objBefore[value] instanceof Object) {
        return [...acc, ['upd', value, getArrFromObj(objBefore[value]), objAfter[value]]];
      }
      if (objAfter[value] === objBefore[value]) {
        return [...acc, ['fix', value, objAfter[value]]];
      }
      return [...acc, ['upd', value, objBefore[value], objAfter[value]]];
    } else if (_.has(objAfter, value)) {
      return [...acc, ['add', value, (objAfter[value] instanceof Object) ? getArrFromObj(objAfter[value]) : objAfter[value]]];
    }
    return [...acc, ['del', value, (objBefore[value] instanceof Object) ? getArrFromObj(objBefore[value]) : objBefore[value]]];
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
