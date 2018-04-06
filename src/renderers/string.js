const strIndent = {
  fixed: '    ',
  added: '  + ',
  deleted: '  - ',
};

const stringify = (obj, tabsCount = 0) => {
  const keys = Object.keys(obj);
  const outStr = keys.reduce((acc, key) =>
    [...acc, strIndent.fixed.repeat(tabsCount + 1).concat(key, ': ', obj[key])], []).join('\n').concat('\n');
  return '{\n'.concat(outStr, strIndent.fixed.repeat(tabsCount), '}');
};

const getStringFromObj = (obj, tabsCount = 0) =>
  (obj instanceof Object ? stringify(obj, tabsCount) : obj);

const renderStringFromAst = (arr, tabsCount = 0) => {
  const outStr = arr.reduce((acc, node) => {
    switch (node.type) {
      case 'updated': {
        const { key, valBefore, valAfter } = node;
        const valFrom = getStringFromObj(valBefore, tabsCount + 1);
        const valTo = getStringFromObj(valAfter, tabsCount + 1);
        return [...acc,
          strIndent.fixed.repeat(tabsCount).concat(strIndent.added, key, ': ', valTo),
          strIndent.fixed.repeat(tabsCount).concat(strIndent.deleted, key, ': ', valFrom)];
      }
      case 'fixed': {
        const { key, valAfter, children } = node;
        if (children) {
          const embedded = renderStringFromAst(children, tabsCount + 1);
          return [...acc, strIndent.fixed.repeat(tabsCount).concat(strIndent[node.type], key, ': ', embedded)];
        }
        const valTo = getStringFromObj(valAfter, tabsCount + 1);
        return [...acc, strIndent.fixed.repeat(tabsCount).concat(strIndent[node.type], key, ': ', valTo)];
      }
      case 'added':
      case 'deleted': {
        const { key, valAfter } = node;
        const valTo = getStringFromObj(valAfter, tabsCount + 1);
        return [...acc, strIndent.fixed.repeat(tabsCount).concat(strIndent[node.type], key, ': ', valTo)];
      }
      default:
        return acc;
    }
  }, []).join('\n').concat('\n');
  return '{\n'.concat(outStr, strIndent.fixed.repeat(tabsCount), '}');
};

export default renderStringFromAst;
