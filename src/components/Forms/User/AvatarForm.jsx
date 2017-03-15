/**
 * Create by cpc on 6/5/16.
 **/

import React, { Component, PropTypes } from 'react';
import { FileFileUpload } from 'material-ui/svg-icons';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import FileInput from '../../Lib/FileInput';
import Avatar from '../../Lib/Avatar';

const styles = {
  fileInput: { paddingBottom: 20 },
  avatar: { float: 'left' },
  right: { paddingLeft: 160 },
  actions: { float: 'right' },
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

  _changeFiles = (evt, files) => {
    if (!files) return;
    this.setState({ files });
    if (files[0]) {
      const reader = new FileReader();
      reader.onload = () =>
        this.setState({ src: reader.result });
      reader.readAsDataURL(files[0]);
    }
  }

  _clearFiles = () => {
    this.setState({
      src: this.props.src,
      files: { length: 0 },
    });
  }

  _handlePost = async() => {
    const { postAvatar } = this.props;
    const { files } = this.state;
    this.setState({ posting: true });
    if (await postAvatar(files[0])) this._clearFiles();
    this.setState({ posting: false });
  }

  render() {
    const { src, files, posting } = this.state;
    return (
      <div>
        <div style={styles.avatar}>
          {src && <Avatar src={src} size={128} />}
        </div>
        <div style={styles.right}>
          <div><h3>Avatar</h3></div>
          <div style={styles.fileInput}>
            <FileInput
              files={files}
              accept="image/*"
              label="choose new picture"
              onChange={this._changeFiles}
            />
          </div>
          <div style={styles.actions} >
            <FlatButton
              label="clear"
              onTouchTap={this._clearFiles}
            />
            <RaisedButton
              primary
              disabled={posting}
              label="upload"
              icon={<FileFileUpload />}
              onTouchTap={this._handlePost}
              labelPosition="before"
            />
          </div>
          <div style={{ clear: 'both' }} />
        </div>
      </div>
    );
  }
}
