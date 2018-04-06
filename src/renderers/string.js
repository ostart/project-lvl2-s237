const strIndent = {
  fixed: '    ',
  added: '  + ',
  deleted: '  - ',
};

const renderStringFromAst = (arr, tabsCount = 0) => {
  const outStr = arr.reduce((acc, obj) => {
    switch (obj.state) {
      case 'updated': {
        const { key, valBefore, valAfter } = obj;
        if (valAfter instanceof Array && valBefore instanceof Array) {
          const embAfter = renderStringFromAst(valAfter, tabsCount + 1);
          const embBefore = renderStringFromAst(valBefore, tabsCount + 1);
          return acc.concat(strIndent.fixed.repeat(tabsCount), strIndent.added, key, ': ', embAfter, '\n')
            .concat(strIndent.fixed.repeat(tabsCount), strIndent.deleted, key, ': ', embBefore, '\n');
        } else if (valAfter instanceof Array) {
          const embAfter = renderStringFromAst(valAfter, tabsCount + 1);
          return acc.concat(strIndent.fixed.repeat(tabsCount), strIndent.added, key, ': ', embAfter, '\n')
            .concat(strIndent.fixed.repeat(tabsCount), strIndent.deleted, key, ': ', valBefore, '\n');
        } else if (valBefore instanceof Array) {
          const embBefore = renderStringFromAst(valBefore, tabsCount + 1);
          return acc.concat(strIndent.fixed.repeat(tabsCount), strIndent.added, key, ': ', valAfter, '\n')
            .concat(strIndent.fixed.repeat(tabsCount), strIndent.deleted, key, ': ', embBefore, '\n');
        }
        return acc.concat(strIndent.fixed.repeat(tabsCount), strIndent.added, key, ': ', valAfter, '\n')
          .concat(strIndent.fixed.repeat(tabsCount), strIndent.deleted, key, ': ', valBefore, '\n');
      }
      case 'fixed': {
        const { key, valAfter, children } = obj;
        if (children) {
          const embedded = renderStringFromAst(children, tabsCount + 1);
          return acc.concat(strIndent.fixed.repeat(tabsCount), strIndent[obj.state], key, ': ', embedded, '\n');
        }
        return acc.concat(strIndent.fixed.repeat(tabsCount), strIndent[obj.state], key, ': ', valAfter, '\n');
      }
      case 'added': {
        const { key, valAfter } = obj;
        if (valAfter instanceof Array) {
          const embedded = renderStringFromAst(valAfter, tabsCount + 1);
          return acc.concat(strIndent.fixed.repeat(tabsCount), strIndent[obj.state], key, ': ', embedded, '\n');
        }
        return acc.concat(strIndent.fixed.repeat(tabsCount), strIndent[obj.state], key, ': ', valAfter, '\n');
      }
      case 'deleted': {
        const { key, valBefore } = obj;
        if (valBefore instanceof Array) {
          const embedded = renderStringFromAst(valBefore, tabsCount + 1);
          return acc.concat(strIndent.fixed.repeat(tabsCount), strIndent[obj.state], key, ': ', embedded, '\n');
        }
        return acc.concat(strIndent.fixed.repeat(tabsCount), strIndent[obj.state], key, ': ', valBefore, '\n');
      }
      default:
        return acc;
    }
  }, '');
  return '{\n'.concat(outStr, strIndent.fixed.repeat(tabsCount).concat('}'));
};

export default renderStringFromAst;
