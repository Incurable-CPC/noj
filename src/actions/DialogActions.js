/**
 * Created by cpc on 1/30/16.
 */

import DialogConstants from '../constants/DialogConstants';

export const showDialog = (content) => ({
  type: DialogConstants.SHOW,
  content,
});

export const hideDialog = () => ({
  type: DialogConstants.HIDE,
});
