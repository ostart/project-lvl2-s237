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

  // const intersected = _.intersection(keysBefore, keysAfter);
  // const added = _.difference(keysAfter, keysBefore);
  // const deleted = _.difference(keysBefore, keysAfter);

  // const immutable = intersected.reduce((acc, value) =>
  //   ((jsonObjAfter[value] === jsonObjBefore[value]) ?
  //     { ...acc, [strTab.concat(value)]: jsonObjAfter[value] } :
  //     acc), {});

  // const changed = intersected.reduce((acc, value) => {
  //   if (jsonObjAfter[value] !== jsonObjBefore[value]) {
  //     const keyPlus = strPlus.concat(value);
  //     const keyMinus = strMinus.concat(value);
  //     return { ...acc, [keyPlus]: jsonObjAfter[value], [keyMinus]: jsonObjBefore[value] };
  //   }
  //   return acc;
  // }, {});

  // const depricated = deleted.reduce((acc, value) =>
  //   ({ ...acc, [strMinus.concat(value)]: jsonObjBefore[value] }), {});

  // const newOnes = added.reduce((acc, value) =>
  //   ({ ...acc, [strPlus.concat(value)]: jsonObjAfter[value] }), {});

  // const result = { ...immutable, ...changed, ...depricated, ...newOnes };

  // const outStr = Object.keys(result).reduce((acc, value) => acc.concat(value.concat(': ', result[value], '\n')), '');

  // return '{\n'.concat(outStr, '}');

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
