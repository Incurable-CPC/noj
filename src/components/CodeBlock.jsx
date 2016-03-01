/**
 * Create by cpc on 2/29/16.
 **/

import React, { Component, PropTypes } from 'react';
import Codemirror from 'react-codemirror';

import { LANGUAGE_MODES } from '../constants';

export default class CodeBlock extends Component {
  static propTypes = {
    code: PropTypes.string.isRequired,
    language: PropTypes.number,
  };

  render() {
    const { code, language } = this.props;
    const options = {
      lineNumbers: true,
      readOnly: true,
      mode: LANGUAGE_MODES[language],
    };
    return (
      <Codemirror
        className="auto-height"
        value={code}
        options={options}
      />
    );
  }
}
