/**
 * Created by cpc on 6/12/16.
 */

export const LANGUAGE_NAMES = {
  c: ['C', 'GCC'],
  cpp: ['C++', 'G++'],
  java: ['Java'],
  python: ['Python'],
  pascal: ['Pascal'],
  fortran: ['Fortran'],
};

export const LANGUAGES = {
  local: ['C', 'C++', 'Java', 'Python'],
  POJ: ['G++', 'GCC', 'Java', 'Pascal', 'C++', 'C', 'Fortran'],
};

export const LANGUAGE_MODES = {
  c: 'text/x-csrc',
  cpp: 'text/c-c++src',
  java: 'text/x-java',
  pascal: 'text/x-pascal',
  fortran: 'text/x-fortran',
  python: 'python',
};

export const getModeByName = (name) => {
  let mode = '';
  Object.keys(LANGUAGE_NAMES).forEach((lang) => {
    const names = LANGUAGE_NAMES[lang];
    if (names.indexOf(name) !== -1) {
      mode = LANGUAGE_MODES[lang];
    }
  });
  return mode;
};

export const getModeByValue = (oj, value) =>
  getModeByName(LANGUAGES[oj][value]);
