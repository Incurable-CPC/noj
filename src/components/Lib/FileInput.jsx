/**
 * Create by cpc on 6/5/16.
 **/

import React, { Component, PropTypes } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  fileInput: { display: 'none' },
  fileInfo: {
    paddingLeft: 20,
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
    files: PropTypes.object,
    accept: PropTypes.string,
    multiple: PropTypes.bool,
  };

  state = {
    fileInfo: '',
  };

  _handleChange = (evt) => {
    const { files } = evt.target;
    const { onChange } = this.props;
    this.setState({ fileInfo: filesToStr(files) });
    if (onChange) onChange(evt, files);
  };

  render() {
    const { files, accept, multiple, label, ...props } = this.props;
    const fileInfo = files ?
      filesToStr(files) : this.state.fileInfo;
    return (
      <span {...props}>
        <RaisedButton
          label={label || 'browse'}
          onTouchTap={() => this.refs.file.click()}
        />
        <span style={styles.fileInfo}>{fileInfo}</span>
        <input
          ref="file"
          type="file"
          onChange={this._handleChange}
          style={styles.fileInput}
          accept={accept}
          multiple={multiple}
        />
      </span>
    );
  }
}
