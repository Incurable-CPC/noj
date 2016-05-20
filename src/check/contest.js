/**
 * Created by cpc on 3/28/16.
 */

import { checkEmpty } from './index';

export default (contest) => {
  const { title, problems, duration } = contest;
  if (checkEmpty(title)) return 'Title can\'t be empty';
  if (checkEmpty(duration)) return 'Duration can\'t be empty';
  for (let i = 0; i < problems.length; i++) {
    const { pid, error } = problems[i];
    if (checkEmpty(pid)) return `Problem ${i + 1} can't be empty`;
    if (error !== '') return error;
  }
  return '';
};
