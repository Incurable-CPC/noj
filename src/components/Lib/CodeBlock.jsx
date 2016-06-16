/**
 * Create by cpc on 2/29/16.
 **/

import React, { Component, PropTypes } from 'react';
import ContentCopyIcon from 'material-ui/svg-icons/content/content-copy';
import IconButton from 'material-ui/IconButton';
import Codemirror from 'react-codemirror';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/python/python';
import 'codemirror/mode/pascal/pascal';
import 'codemirror/mode/fortran/fortran';

import { getModeByValue } from '../../core/languages';
import withStyles from '../../decorators/withStyles';
import s from './CodeBlock.scss';

@withStyles(s)
export default class CodeBlock extends Component {
  static propTypes = {
    code: PropTypes.string.isRequired,
    OJ: PropTypes.string.isRequired,
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
    const { code, OJ, language } = this.props;
    const options = {
      lineNumbers: true,
      readOnly: true,
      mode: getModeByValue(OJ, language),
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
