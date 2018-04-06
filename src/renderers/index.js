import renderStringFromAst from './string';
import renderPlainFromAst from './plain';
import renderJsonFromAst from './json';

const rendererList = {
  string: renderStringFromAst,
  plain: renderPlainFromAst,
  json: renderJsonFromAst,
};

const getRenderer = format => (ast) => {
  const renderFunc = rendererList[format];
  if (!renderFunc) {
    throw new Error(`unkown format: ${format}`);
  }
  return renderFunc(ast);
};

export default getRenderer;
