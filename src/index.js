import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import getParser from './parsers';
import getRenderer from './renderers';

const createNode = (state, key, valBefore, valAfter) => ({
  state, key, valBefore, valAfter,
});

const getNodeFromObj = obj => Object.keys(obj).reduce((acc, value) => {
  if (obj[value] instanceof Object) {
    return [...acc, createNode('fixed', value, getNodeFromObj(obj[value]), getNodeFromObj(obj[value]))];
  }
  return [...acc, createNode('fixed', value, obj[value], obj[value])];
}, []);

const getValue = value => (value instanceof Object ? getNodeFromObj(value) : value);

const getAst = (objBefore, objAfter) => {
  const keysBefore = Object.keys(objBefore);
  const keysAfter = Object.keys(objAfter);
  const united = _.union(keysAfter, keysBefore);

  const resultAst = united.reduce((acc, value) => {
    if (_.has(objAfter, value) && _.has(objBefore, value)) {
      if (objAfter[value] instanceof Object && objBefore[value] instanceof Object) {
        return [...acc, { state: 'fixed', key: value, children: getAst(objBefore[value], objAfter[value]) }];
      } else if (objAfter[value] instanceof Object) {
        return [...acc, createNode('updated', value, objBefore[value], getNodeFromObj(objAfter[value]))];
      } else if (objBefore[value] instanceof Object) {
        return [...acc, createNode('updated', value, getNodeFromObj(objBefore[value]), objAfter[value])];
      }
      if (objAfter[value] === objBefore[value]) {
        return [...acc, createNode('fixed', value, objBefore[value], objAfter[value])];
      }
      return [...acc, createNode('updated', value, objBefore[value], objAfter[value])];
    } else if (_.has(objAfter, value)) {
      return [...acc, createNode('added', value, null, getValue(objAfter[value]))];
    }
    return [...acc, createNode('deleted', value, getValue(objBefore[value]), null)];
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
