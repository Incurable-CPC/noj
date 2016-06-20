/**
 * Created by cpc on 6/12/16.
 */

export const LANGUAGE_NAMES = {
  f: ['Fortran'],
  c: ['C', 'GCC'],
  cs: ['C#'],
  cpp: ['C++', 'G++'],
  java: ['Java'],
  pas: ['Pascal'],
  py: ['Python'],
};

export const LANGUAGES = {
  local: ['C', 'C++', 'Java', 'Python'],
  POJ: ['G++', 'GCC', 'Java', 'Pascal', 'C++', 'C', 'Fortran'],
  HDOJ: ['G++', 'GCC', 'C++', 'C', 'Pascal', 'Java', 'C#'],
};

export const LANGUAGE_MODES = {
  f: 'text/x-fortran',
  c: 'text/x-csrc',
  cpp: 'text/c-c++src',
  cs: 'text/x-csharp',
  java: 'text/x-java',
  pas: 'text/x-pascal',
  py: 'python',
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
