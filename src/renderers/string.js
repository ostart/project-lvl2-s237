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
      case 'nested': {
        const { key, children } = node;
        const embedded = renderStringFromAst(children, tabsCount + 1);
        return [...acc, strIndent.fixed.repeat(tabsCount).concat(strIndent.fixed, key, ': ', embedded)];
      }
      case 'fixed': {
        const { key, value } = node;
        const val = getStringFromObj(value, tabsCount + 1);
        return [...acc, strIndent.fixed.repeat(tabsCount).concat(strIndent[node.type], key, ': ', val)];
      }
      case 'added': {
        const { key, valAfter } = node;
        const valTo = getStringFromObj(valAfter, tabsCount + 1);
        return [...acc, strIndent.fixed.repeat(tabsCount).concat(strIndent[node.type], key, ': ', valTo)];
      }
      case 'deleted': {
        const { key, valBefore } = node;
        const valFrom = getStringFromObj(valBefore, tabsCount + 1);
        return [...acc, strIndent.fixed.repeat(tabsCount).concat(strIndent[node.type], key, ': ', valFrom)];
      }
      default:
        return acc;
    }
  }, []).join('\n').concat('\n');
  return '{\n'.concat(outStr, strIndent.fixed.repeat(tabsCount), '}');
};

export default renderStringFromAst;
