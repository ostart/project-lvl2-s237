const strIndent = {
  fix: '    ',
  add: '  + ',
  del: '  - ',
};

const renderJsonFromAst = (arr, tabsCount = 0) => {
  const outStr = arr.reduce((acc, [state, key, ...rest], index, array) => {
    if (state === 'upd') {
      const [valueBefore, valueAfter] = rest;
      if (valueAfter instanceof Array && valueBefore instanceof Array) {
        const embAfter = renderJsonFromAst(valueAfter, tabsCount + 1);
        const embBefore = renderJsonFromAst(valueBefore, tabsCount + 1);
        return acc.concat(strIndent.fix.repeat(tabsCount), strIndent.add, `"${key}"`, ': ', embAfter, (index === array.length - 1) ? '\n' : ',\n')
          .concat(strIndent.fix.repeat(tabsCount), strIndent.del, `"${key}"`, ': ', embBefore, (index === array.length - 1) ? '\n' : ',\n');
      } else if (valueAfter instanceof Array) {
        const embAfter = renderJsonFromAst(valueAfter, tabsCount + 1);
        return acc.concat(strIndent.fix.repeat(tabsCount), strIndent.add, `"${key}"`, ': ', embAfter, (index === array.length - 1) ? '\n' : ',\n')
          .concat(strIndent.fix.repeat(tabsCount), strIndent.del, `"${key}"`, ': ', `"${valueBefore}"`, (index === array.length - 1) ? '\n' : ',\n');
      } else if (valueBefore instanceof Array) {
        const embBefore = renderJsonFromAst(valueBefore, tabsCount + 1);
        return acc.concat(strIndent.fix.repeat(tabsCount), strIndent.add, `"${key}"`, ': ', `"${valueAfter}"`, (index === array.length - 1) ? '\n' : ',\n')
          .concat(strIndent.fix.repeat(tabsCount), strIndent.del, `"${key}"`, ': ', embBefore, (index === array.length - 1) ? '\n' : ',\n');
      }
      return acc.concat(strIndent.fix.repeat(tabsCount), strIndent.add, `"${key}"`, ': ', `"${valueAfter}"`, (index === array.length - 1) ? '\n' : ',\n')
        .concat(strIndent.fix.repeat(tabsCount), strIndent.del, `"${key}"`, ': ', `"${valueBefore}"`, (index === array.length - 1) ? '\n' : ',\n');
    }
    const [value] = rest;
    if (value instanceof Array) {
      const embedded = renderJsonFromAst(value, tabsCount + 1);
      return acc.concat(strIndent.fix.repeat(tabsCount), strIndent[state], `"${key}"`, ': ', embedded, (index === array.length - 1) ? '\n' : ',\n');
    }
    return acc.concat(strIndent.fix.repeat(tabsCount), strIndent[state], `"${key}"`, ': ', `"${value}"`, (index === array.length - 1) ? '\n' : ',\n');
  }, '');
  return '{\n'.concat(outStr, strIndent.fix.repeat(tabsCount).concat('}'));
};

export default renderJsonFromAst;
