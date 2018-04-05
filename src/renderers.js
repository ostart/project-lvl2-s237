const strIndent = {
  fix: '    ',
  add: '  + ',
  del: '  - ',
};

const renderStringFromAst = (arr, tabsCount = 0) => {
  const outStr = arr.reduce((acc, [state, key, ...rest]) => {
    if (state === 'upd') {
      const [valueBefore, valueAfter] = rest;
      if (valueAfter instanceof Array && valueBefore instanceof Array) {
        const embAfter = renderStringFromAst(valueAfter, tabsCount + 1);
        const embBefore = renderStringFromAst(valueBefore, tabsCount + 1);
        return acc.concat(strIndent.fix.repeat(tabsCount), strIndent.add, key, ': ', embAfter, '\n')
          .concat(strIndent.fix.repeat(tabsCount), strIndent.del, key, ': ', embBefore, '\n');
      } else if (valueAfter instanceof Array) {
        const embAfter = renderStringFromAst(valueAfter, tabsCount + 1);
        return acc.concat(strIndent.fix.repeat(tabsCount), strIndent.add, key, ': ', embAfter, '\n')
          .concat(strIndent.fix.repeat(tabsCount), strIndent.del, key, ': ', valueBefore, '\n');
      } else if (valueBefore instanceof Array) {
        const embBefore = renderStringFromAst(valueBefore, tabsCount + 1);
        return acc.concat(strIndent.fix.repeat(tabsCount), strIndent.add, key, ': ', valueAfter, '\n')
          .concat(strIndent.fix.repeat(tabsCount), strIndent.del, key, ': ', embBefore, '\n');
      }
      return acc.concat(strIndent.fix.repeat(tabsCount), strIndent.add, key, ': ', valueAfter, '\n')
        .concat(strIndent.fix.repeat(tabsCount), strIndent.del, key, ': ', valueBefore, '\n');
    }
    const [value] = rest;
    if (value instanceof Array) {
      const embedded = renderStringFromAst(value, tabsCount + 1);
      return acc.concat(strIndent.fix.repeat(tabsCount).concat(strIndent[state], key, ': ', embedded, '\n'));
    }
    return acc.concat(strIndent.fix.repeat(tabsCount).concat(strIndent[state], key, ': ', value, '\n'));
  }, '');
  return '{\n'.concat(outStr, strIndent.fix.repeat(tabsCount).concat('}'));
};

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

const rendererList = {
  string: renderStringFromAst,
  plain: renderPlainFromAst,
};

const getRenderer = format => (ast) => {
  const renderFunc = rendererList[format];
  if (!renderFunc) {
    throw new Error(`unkown format: ${format}`);
  }
  return renderFunc(ast);
};

export default getRenderer;
