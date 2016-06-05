/**
 * Created by cpc on 6/5/16.
 */

export default (file) => {
  if (!file) return 'Please Choose File';
  if (file.size > 1 * 1024 * 1024) {
    return 'Maximum size is 1 MB';
  }
  return '';
};
