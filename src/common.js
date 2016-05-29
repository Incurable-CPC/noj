/**
 * Created by cpc on 1/3/16.
 */

import { RESULT_VALUES } from './constants';
import moment from 'moment';

export function nameToStr(str) {
  return (str.charAt(0).toUpperCase() + str.slice(1)).split(/(?=[A-Z])/).join(' ');
}

export function nameToLabel(str) {
  return str.split(/(?=[A-Z])/).join(' ').toUpperCase();
}

export function useAwait(foo) {
  return function newFoo() {
    const args = Array.apply(null, arguments);
    return new Promise((resolve, reject) => {
      args.push((err, data) => {
        if (err) reject(err);
        resolve(data);
      });
      foo.apply(undefined, args);
    });
  };
}

import marked, { Renderer } from 'marked';
import katex from 'katex';
const renderer = new Renderer();
const renderCodespan = renderer.codespan.bind(renderer);
const renderMath = (code, option) => {
  try {
    const mathCode = code
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#0*39;/g, '\'')
      .replace(/&amp;/g, '&');
    return katex.renderToString(mathCode, option);
  } catch (err) {
    return `<p style='color:red'>${err.message}</p>`;
  }
};

renderer.codespan = (code) => {
  const mathOption = {
    throwOnError: false,
    displayMode: true,
  };
  let mathCode = code.match(/^\$\$([\s\S]*)\$\$$/);
  if (!mathCode) {
    mathCode = code.match(/^\$([\s\S]*)\$$/);
    mathOption.displayMode = false;
  }

  return (mathCode) ?
    renderMath(mathCode[1], mathOption)
    : renderCodespan(code);
};

export const markWithMath = (src) => marked(src, {
  renderer,
});

export const isAccepted = (result) => result === RESULT_VALUES.Accepted;

export const formatTime = (date) => moment(date).format('YYYY-MM-DD hh:mm:ss');
