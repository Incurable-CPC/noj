/**
 * Created by cpc on 3/12/16.
 */

import { RESULT_VALUES } from '../constants';

export default (submission) => {
  const code = (submission.code || '').trim();
  if (code.length < 64) {
    return 'Code is too short';
  }

  if (code.length > 64000) {
    return 'Code is too long';
  }

  return '';
};

export const isCompleted = (result) => (result >= RESULT_VALUES.AC);
export const isAccepted = (result) => (result === RESULT_VALUES.AC);
export const isCompileError = (result) => (result === RESULT_VALUES.CE);
