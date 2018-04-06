const stringify = obj => (obj instanceof Object ? 'complex value' : `'${obj}'`);

const renderPlainFromAst = (arr, keyPathArr = []) => {
  const outStr = arr.reduce((acc, obj) => {
    const {
      key, valBefore, valAfter, children,
    } = obj;
    const keyPath = keyPathArr.concat(key).join('.');
    switch (obj.type) {
      case 'added':
        return (valAfter instanceof Object) ?
          [...acc, `Property '${keyPath}' was added with complex value`] :
          [...acc, `Property '${keyPath}' was added with value: '${valAfter}'`];
      case 'deleted':
        return [...acc, `Property '${keyPath}' was removed`];
      case 'updated': {
        const before = stringify(valBefore);
        const after = stringify(valAfter);
        return [...acc, `Property '${keyPath}' was updated. From ${before} to ${after}`];
      }
      case 'nested':
        return [...acc, renderPlainFromAst(children, keyPathArr.concat(key))];
      case 'fixed':
        return acc;
      default:
        return acc;
    }
  }, []).join('\n');
  return outStr;
};

export default renderPlainFromAst;
