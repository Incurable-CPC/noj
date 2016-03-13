/**
 * Created by cpc on 3/12/16.
 */

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
