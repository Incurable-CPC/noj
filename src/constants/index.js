/**
 * Created by cpc on 2/28/16.
 */

export const LANGUAGES = ['C', 'C++', 'Java', 'Python'];
export const LANGUAGE_MODES = ['text/x-csrc', 'text/x-c++src', 'text/x-java', 'python'];
export const LANGUAGE_VALUES = {};
LANGUAGES.forEach((value, index) => {
  LANGUAGE_VALUES[value] = index;
});
