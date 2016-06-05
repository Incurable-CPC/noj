/**
 * Create by cpc on 6/5/16.
 **/

import React, { Component, PropTypes } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const styles = {
  fileInput: { display: 'none' },
  label: { paddingLeft: 20 },
};

const filesToStr = (files) => {
  if (!files) return '';
  if (files.length === 1) {
    return files[0].name;
  }
  return `${files.length} files selected`;
};

export default class FileInput extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    files: PropTypes.object,
    accept: PropTypes.string,
    multiple: PropTypes.bool,
  };

  state = {
    label: '',
  };

  _handleChange = (evt) => {
    const { files } = evt.target;
    const { onChange } = this.props;
    this.setState({ label: filesToStr(files) });
    if (onChange) onChange(files);
  };

  render() {
    const { files, accept, multiple } = this.props;
    const label = filesToStr(files) || this.state.label;
    return (
      <span>
        <RaisedButton
          label="browse"
          onTouchTap={() => this.refs.file.click()}
        />
        <span style={styles.label}>{label}</span>
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
