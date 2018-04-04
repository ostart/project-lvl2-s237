import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import getParser from './parsers';

const strPlus = '  + ';
const strMinus = '  - ';
const strTab = '    ';

const RenderStringFromAST = (arr, tabsCount = 0) => {
  const outStr = arr.reduce((acc, [key, value]) => {
    if (value instanceof Array) {
      const embedded = RenderStringFromAST(value, tabsCount + 1);
      return acc.concat(strTab.repeat(tabsCount).concat(key.concat(': ', embedded, '\n')));
    }
    return acc.concat(strTab.repeat(tabsCount).concat(key.concat(': ', value, '\n')));
  }, '');
  return '{\n'.concat(outStr, strTab.repeat(tabsCount).concat('}'));
};

const getArrFromObj = obj => Object.keys(obj).reduce((acc, value) => {
  if (obj[value] instanceof Object) {
    return [...acc, [strTab.concat(value), getArrFromObj(obj[value])]];
  }
  return [...acc, [strTab.concat(value), obj[value]]];
}, []);

const getAST = (objBefore, objAfter) => {
  const keysBefore = Object.keys(objBefore);
  const keysAfter = Object.keys(objAfter);

  const united = _.union(keysAfter, keysBefore);
  const resultAst = united.reduce((acc, value) => {
    if (_.has(objAfter, value) && _.has(objBefore, value)) {
      if (objAfter[value] instanceof Object && objBefore[value] instanceof Object) {
        return [...acc, [strTab.concat(value), getAST(objBefore[value], objAfter[value])]];
      } else if (objAfter[value] instanceof Object) {
        const keyPlus = strPlus.concat(value);
        const keyMinus = strMinus.concat(value);
        return [...acc, [keyPlus, getArrFromObj(objAfter[value])], [keyMinus, objBefore[value]]];
      } else if (objBefore[value] instanceof Object) {
        const keyPlus = strPlus.concat(value);
        const keyMinus = strMinus.concat(value);
        return [...acc, [keyPlus, objAfter[value]], [keyMinus, getArrFromObj(objBefore[value])]];
      }
      if (objAfter[value] === objBefore[value]) {
        return [...acc, [strTab.concat(value), objAfter[value]]];
      }
      const keyPlus = strPlus.concat(value);
      const keyMinus = strMinus.concat(value);
      return [...acc, [keyPlus, objAfter[value]], [keyMinus, objBefore[value]]];
    } else if (_.has(objAfter, value)) {
      return [...acc, [strPlus.concat(value),
        (objAfter[value] instanceof Object) ? getArrFromObj(objAfter[value]) : objAfter[value]]];
    }
    return [...acc, [strMinus.concat(value),
      (objBefore[value] instanceof Object) ? getArrFromObj(objBefore[value]) : objBefore[value]]];
  }, []);
  return resultAst;
};

const genDiff = (pathToFileBefore, pathToFileAfter) => {
  const ext = path.extname(pathToFileAfter);
  const getObjectFromFile = getParser(ext);

  const fileDataBefore = fs.readFileSync(pathToFileBefore, 'utf-8');
  const fileDataAfter = fs.readFileSync(pathToFileAfter, 'utf-8');
  const objBefore = getObjectFromFile(fileDataBefore);
  const objAfter = getObjectFromFile(fileDataAfter);

  const ast = getAST(objBefore, objAfter);

  return RenderStringFromAST(ast);
};

export default genDiff;
