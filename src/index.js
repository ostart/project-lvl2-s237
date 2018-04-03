import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import getParser from './parsers';

const getStringFromArray = (arr) => {
  const outStr = arr.reduce((acc, value) => acc.concat(value.concat('\n')), '');
  return '{\n'.concat(outStr, '}');
};

const genDiff = (pathToFileBefore, pathToFileAfter) => {
  const ext = path.extname(pathToFileAfter);
  const getObjectFromFile = getParser(ext);

  const fileDataBefore = fs.readFileSync(pathToFileBefore, 'utf-8');
  const fileDataAfter = fs.readFileSync(pathToFileAfter, 'utf-8');
  const objBefore = getObjectFromFile(fileDataBefore);
  const objAfter = getObjectFromFile(fileDataAfter);

  const keysBefore = Object.keys(objBefore);
  const keysAfter = Object.keys(objAfter);
  const strPlus = '  + ';
  const strMinus = '  - ';
  const strTab = '    ';

  const united = _.union(keysAfter, keysBefore);
  const resultArr = united.reduce((acc, value) => {
    if (_.has(objAfter, value) && _.has(objBefore, value)) {
      if (objAfter[value] === objBefore[value]) {
        return [...acc, `${strTab.concat(value)}: ${objAfter[value]}`];
      }
      const keyPlus = strPlus.concat(value);
      const keyMinus = strMinus.concat(value);
      return [...acc, `${keyPlus}: ${objAfter[value]}`, `${keyMinus}: ${objBefore[value]}`];
    } else if (_.has(objAfter, value)) {
      return [...acc, `${strPlus.concat(value)}: ${objAfter[value]}`];
    }
    return [...acc, `${strMinus.concat(value)}: ${objBefore[value]}`];
  }, []);

  return getStringFromArray(resultArr);
};

export default genDiff;
