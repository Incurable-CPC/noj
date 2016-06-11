/**
 * Created by cpc on 6/5/16.
 */

export const checkAvatar = (file) => {
  if (!file) return 'Please Choose File';
  if (file.size > 1 * 1024 * 1024) {
    return 'Maximum size is 1 MB';
  }
  return '';
};

export const checkInfo = (info) => {
  if (info.email && (!checkEmail(info.email))) {
    return 'Email is not valid';
  }
  return '';
};

const checkEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};
