/**
 * Created by cpc on 3/12/16.
 */

import { checkEmpty } from './index';
export default (problem) => {
  const requiredField = [
    'title', 'timeLimit', 'memoryLimit',
    'description', 'input', 'output',
  ];
  for (let field of requiredField) {
    if ((checkEmpty(problem[field])) && (checkEmpty(problem[`${field}Src`]))) {
      return `Field '${field}' can't be empty`;
    }
  }
  if (problem.samples.length === 0) {
    return 'At least one sample';
  }
  for (let i = 0; i < problem.samples.length; i++) {
    let sample = problem.samples[i];
    for (let field of ['input', 'output']) {
      if (checkEmpty(sample[field])) {
        return `Sample ${field}#${i + 1} can't be empty`;
      }
    }
  }

  return '';
};
