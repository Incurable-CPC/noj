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

export const LANGUAGES = {
  local: ['C', 'C++', 'Java', 'Python'],
  POJ: ['G++', 'GCC', 'Java', 'Pascal', 'C++', 'C', 'Fortran'],
};
export const LANGUAGE_MODES = {
  local: ['text/x-csrc', 'text/x-c++src', 'text/x-java', 'python'],
  POJ: [
    'text/x-c++src', 'text/x-csrc', 'text/x-java',
    'text/x-pascal', 'text/x-c++src', 'text/x-csrc', 'text/x-fortran',
  ],
};

export const RESULTS = [
  'Pending', 'Pending Rejudging', 'Compiling', 'Running & Judging',
  'Accepted', 'Presentation Error',
  'Wrong Answer', 'Time Limit Exceed', 'Memory Limit Exceed', 'Output Limit Exceed',
  'Runtime Error', 'Compile Error',
  'Compile OK', 'Test Running Done',
];
export const RESULT_VALUES = arrToObj(RESULTS);
