/**
 * Create by cpc on 6/5/16.
 **/

import React, { Component, PropTypes } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  root: { height: 36 },
  fileInput: { display: 'none' },
  button: { float: 'left' },
  fileInfo: {
    padding: 9,
    maxWidth: 200,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    float: 'left',
  },
};

const filesToStr = (files) => {
  if ((!files) || files.length === 0) return '';
  if (files.length === 1) {
    return files[0].name;
  }
  return `${files.length} files selected`;
};

export default class FileInput extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    label: PropTypes.string,
    style: PropTypes.object,
    accept: PropTypes.string,
    multiple: PropTypes.bool,
    files: PropTypes.object,
  };

  _handleChange = (evt) => {
    const { files } = evt.target;
    const { onChange } = this.props;
    if (onChange) onChange(evt, files);
  };

  render() {
    const { accept, multiple, label, style, files } = this.props;
    return (
      <div style={Object.assign({}, styles.root, style)} >
        <RaisedButton
          label={label || 'browse'}
          style={styles.button}
          onTouchTap={() => this.refs.file.click()}
        />
        <div style={styles.fileInfo}>{filesToStr(files)}</div>
        <input
          ref="file"
          type="file"
          onChange={this._handleChange}
          style={styles.fileInput}
          accept={accept}
          multiple={multiple}
        />
        <div style={{ clear: 'both' }}/>
      </div>
    );
  }
}
