import { safeLoad } from 'js-yaml';

const parsersList = {
  '.json': JSON.parse,
  '.yaml': safeLoad,
  '.yml': safeLoad,
};

const getParser = format => (data) => {
  const parseFunc = parsersList[format];
  if (!parseFunc) {
    throw new Error(`unkown format: ${format}`);
  }
  return parseFunc(data);
};

export default getParser;
