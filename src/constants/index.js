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

export const RESULTS = [
  'Pending', 'Pending Rejudging', 'Compiling', 'Running & Judging',
  'Accepted', 'Presentation Error',
  'Wrong Answer', 'Time Limit Exceed', 'Memory Limit Exceed', 'Output Limit Exceed',
  'Runtime Error', 'Compile Error',
  'Compile OK', 'Test Running Done',
];
export const RESULT_VALUES = Object.assign({}, {
  WT0: 0, WT1: 1, CI: 2, RI: 3,
  AC: 4, PE: 5,
  WA: 6, TLE: 7, MLE: 8, OLE: 9,
  RE: 10, CE: 11,
  CO: 12, TR: 13,
}, arrToObj(RESULTS));
