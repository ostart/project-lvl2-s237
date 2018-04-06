const renderPlainFromAst = (arr, keyPathArr = []) => {
  const outStr = arr.reduce((acc, [state, key, ...rest]) => {
    const [value] = rest;
    const keyPath = keyPathArr.concat(key).join('.');
    switch (state) {
      case 'add':
        return (value instanceof Array) ?
          acc.concat(`Property '${keyPath}' was added with complex value\n`) :
          acc.concat(`Property '${keyPath}' was added with value: '${value}'\n`);
      case 'del':
        return acc.concat(`Property '${keyPath}' was removed\n`);
      case 'upd': {
        const [valBefore, valAfter] = rest;
        const before = (valBefore instanceof Array) ? 'complex value' : `'${valBefore}'`;
        const after = (valAfter instanceof Array) ? 'complex value' : `'${valAfter}'`;
        return acc.concat(`Property '${keyPath}' was updated. From ${before} to ${after}\n`);
      }
      case 'fix':
        return (value instanceof Array) ?
          acc.concat(renderPlainFromAst(value, keyPathArr.concat(key))) :
          acc;
      default:
        return acc;
    }
  }, '');
  return outStr;
};

export default renderPlainFromAst;
