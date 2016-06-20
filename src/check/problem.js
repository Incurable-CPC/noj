/**
 * Created by cpc on 3/12/16.
 */

import { checkEmpty } from './index';
import { markWithMath } from '../core';
export default (problem) => {
  const requiredField = ['title', 'timeLimit', 'memoryLimit', 'description'];
  for (let field of requiredField) {
    if ((checkEmpty(problem[field])) && (checkEmpty(problem[`${field}Src`]))) {
      return `Field '${field}' can't be empty`;
    }
  }
  if (problem.samples.length === 0) {
    return 'At least one sample';
  }
  return '';
};

const srcFields = ['description', 'input', 'output', 'hint', 'source'];
export const handleProblemSrc = (problem) => {
  if (problem.timeLimitNum) problem.timeLimit = `${problem.timeLimitNum} ms`;
  if (problem.memoryLimitNum) problem.memoryLimit = `${problem.memoryLimitNum} MB`;
  srcFields.forEach((field) => {
    const src = problem[`${field}Src`];
    if (src) {
      problem[field] = markWithMath(src);
    }
  });
  return problem;
};
