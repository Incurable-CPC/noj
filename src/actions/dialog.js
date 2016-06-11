/**
 * Created by cpc on 1/30/16.
 */

import DIALOG from '../constants/dialog';

export const showDialog = (content) => ({
  type: DIALOG.SHOW,
  content,
});

export const hideDialog = () => ({
  type: DIALOG.HIDE,
});
