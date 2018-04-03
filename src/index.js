import _ from 'lodash';
import fs from 'fs';

const genDiff = (pathToFileBefore, pathToFileAfter) => {
  const fileBefore = fs.readFileSync(pathToFileBefore, 'utf-8');
  const fileAfter = fs.readFileSync(pathToFileAfter, 'utf-8');
  const jsonObjBefore = JSON.parse(fileBefore);
  const jsonObjAfter = JSON.parse(fileAfter);
  const keysBefore = Object.keys(jsonObjBefore);
  const keysAfter = Object.keys(jsonObjAfter);
  const strPlus = '  + ';
  const strMinus = '  - ';
  const strTab = '    ';

  const united = _.union(keysAfter, keysBefore);
  const result = united.reduce((acc, value) => {
    if (_.has(jsonObjAfter, value) && _.has(jsonObjBefore, value)) {
      if (jsonObjAfter[value] === jsonObjBefore[value]) {
        return { ...acc, [strTab.concat(value)]: jsonObjAfter[value] };
      }
      const keyPlus = strPlus.concat(value);
      const keyMinus = strMinus.concat(value);
      return { ...acc, [keyPlus]: jsonObjAfter[value], [keyMinus]: jsonObjBefore[value] };
    } else if (_.has(jsonObjAfter, value)) {
      return { ...acc, [strPlus.concat(value)]: jsonObjAfter[value] };
    }
    return { ...acc, [strMinus.concat(value)]: jsonObjBefore[value] };
  }, {});

  const outStr = Object.keys(result).reduce((acc, value) => acc.concat(value.concat(': ', result[value], '\n')), '');
  return '{\n'.concat(outStr, '}');
};

export default genDiff;
