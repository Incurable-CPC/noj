/**
 * Created by cpc on 3/12/16.
 */

export default (problem) => {
  const requiredField = [
    'title', 'timeLimit', 'memoryLimit',
    'description', 'input', 'output',
  ];
  for (let field of requiredField) {
    if ((!problem[field]) && (!problem[`${field}Src`])) {
      return `Field '${field}' can't be empty`;
    }
  }

  if (problem.samples.length === 0) {
    return 'At least one sample';
  }

  for (let i = 0; i < problem.samples.length; i++) {
    let sample = problem.samples[i];
    for (let field of ['input', 'output']) {
      if (!sample[field]) {
        return `Sample ${field}#${i + 1} can't be empty`;
      }
    }
  }

  return '';
};
