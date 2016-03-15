/**
 * Create by cpc on 2/29/16.
 **/

import React, { Component, PropTypes } from 'react';
import ContentCopyIcon from 'material-ui/lib/svg-icons/content/content-copy';
import IconButton from 'material-ui/lib/icon-button';
import Codemirror from 'react-codemirror';

import { LANGUAGE_MODES } from '../constants';
import withStyles from '../decorators/withStyles';
import s from './CodeBlock.scss';

@withStyles(s)
export default class CodeBlock extends Component {
  static propTypes = {
    code: PropTypes.string.isRequired,
    language: PropTypes.number,
  };

  copy = () => {
    const codeMirror = this.refs.code.getCodeMirror();
    codeMirror.execCommand('selectAll');
    codeMirror.focus();
    if (document.execCommand('copy')) {
      codeMirror.execCommand('undoSelection');
    }
  };

  render() {
    const { code, language } = this.props;
    const options = {
      lineNumbers: true,
      readOnly: true,
      mode: LANGUAGE_MODES[language],
    };
    return (
      <div className={s['code-block']}>
        <div className={s.button}>
          <IconButton
            className="code-btn"
            tooltip="copy to clipboard"
            tooltipPosition="bottom-left"
            onTouchTap={this.copy}
          ><ContentCopyIcon/></IconButton>
        </div>
        <Codemirror
          className="auto-height"
          value={code}
          options={options}
          ref="code"
        />
      </div>
    );
  }
}
