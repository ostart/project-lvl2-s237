import ini from 'ini';
import { safeLoad } from 'js-yaml';

const parsersList = {
  '.json': JSON.parse,
  '.yaml': safeLoad,
  '.yml': safeLoad,
  '.ini': ini.parse,
};

const getParser = format => (data) => {
  const parseFunc = parsersList[format];
  if (!parseFunc) {
    throw new Error(`unkown format: ${format}`);
  }
  return parseFunc(data);
};

export default getParser;
