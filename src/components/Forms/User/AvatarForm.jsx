/**
 * Create by cpc on 6/5/16.
 **/

import React, { Component, PropTypes } from 'react';
import { FileFileUpload } from 'material-ui/svg-icons';
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';

import FileInput from '../../Lib/FileInput';

const styles = {
  fileInput: { paddingBottom: 20 },
  avatar: { float: 'left' },
  right: { paddingLeft: 160 },
};

export default class AvatarForm extends Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
    postAvatar: PropTypes.func.isRequired,
  };

  state = {
    src: this.props.src,
    files: { length: 0 },
    posting: false,
  };

  _modifyAvatar = (src) => {
    this.setState({ src: null });
    setTimeout(() => this.setState({ src }), 0);
  }

  _handleChange = (evt, files) => {
    if (!files) return;
    this.setState({ files });
    if (files[0]) {
      const reader = new FileReader();
      reader.onload = () =>
        this._modifyAvatar(reader.result);
      reader.readAsDataURL(files[0]);
    }
  }

  _clearFile = () => {
    this._modifyAvatar(this.props.src);
    this.setState({ files: { length: 0 } });
  }

  _handlePost = async() => {
    const { postAvatar } = this.props;
    const { files } = this.state;
    this.setState({ posting: true });
    await postAvatar(files[0]);
    this.setState({ posting: false });
  }

  render() {
    const { src, files } = this.state;
    return (
      <div>
        <div style={styles.avatar}>
          {src && <Avatar src={src} size={128} />}
        </div>
        <div style={styles.right}>
          <div><h3>Update new picture</h3></div>
          <div style={styles.fileInput}>
            <FileInput
              files={files}
              onChange={this._handleChange}
              accept="image/*"
            />
          </div>
          <RaisedButton
            primary
            label="upload"
            icon={<FileFileUpload />}
            onTouchTap={this._handlePost}
          />
          <RaisedButton
            label="clear"
            onTouchTap={this._clearFile}
          />
        </div>
      </div>
    );
  }
}
