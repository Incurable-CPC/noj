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

export const RESULTS = [
  'Pending', 'Pending Rejudging', 'Compiling', 'Running & Judging',
  'Accepted', 'Presentation Error',
  'Wrong Answer', 'Time Limit Exceed', 'Memory Limit Exceed', 'Output Limit Exceed',
  'Runtime Error', 'Compile Error',
  'Compile OK', 'Test Running Done',
];
export const RESULT_VALUES = arrToObj(RESULTS);
