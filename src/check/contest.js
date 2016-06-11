/**
 * Created by cpc on 3/28/16.
 */

import { checkEmpty } from './index';

export const MAX_PROBLEM_CNT = 15;

export const problemNotExist = (pid, index) => {
  const newPid = String.fromCharCode('A'.charCodeAt(0) + index);
  return `Problem ${newPid}: ${pid} not exist`;
};

export default (contest) => {
  const requiredField = ['title', 'start', 'duration'];
  for (let field of requiredField) {
    if (checkEmpty(contest[field])) {
      return `Field '${field}' can't be empty`;
    }
  }
  const { problems } = contest;
  if (problems.length > MAX_PROBLEM_CNT) return 'Too many problems';
  for (let i = 0; i < problems.length; i++) {
    const { pid, error } = problems[i];
    const subId = String.fromCharCode('A'.charCodeAt(0) + i);
    if (checkEmpty(pid)) return `Problem ${subId} can't be empty`;
    if (!checkEmpty(error)) return error;
  }
  return '';
};
