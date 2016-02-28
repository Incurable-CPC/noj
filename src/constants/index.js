/**
 * Created by cpc on 2/28/16.
 */

const arrToObj = (arr) => {
  const ret = {};
  arr.forEach((value, index) => {
    ret[value] = index;
  });
  return ret;
};

export const LANGUAGES = ['C', 'C++', 'Java', 'Python'];
export const LANGUAGE_MODES = ['text/x-csrc', 'text/x-c++src', 'text/x-java', 'python'];
export const LANGUAGE_VALUES = arrToObj(LANGUAGES);
