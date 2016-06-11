/**
 * Create by cpc on 3/26/16.
 **/

import React, { Component, PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import SearchIcon from 'material-ui/svg-icons/action/search';
import TextField from 'material-ui/TextField';

const styles = {
  root: { margin: 10 },
  part: {
    display: 'inline-block',
    verticalAlign: 'top',
  },
};

export default class SearchBar extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    search: PropTypes.func.isRequired,
    initialValue: PropTypes.string,
  };

  state = {
    keyword: this.props.initialValue || '',
  };

  _handleSubmit = async (evt) => {
    evt.preventDefault();
    const { keyword } = this.state;
    const { search } = this.props;
    await search(keyword);
  };

  render() {
    const { width } = this.props;
    const { keyword } = this.state;
    return (
      <div>
        <Paper style={Object.assign({ width }, styles.root)}>
          <form onSubmit={this._handleSubmit}>
            <div style={styles.part}>
              <IconButton tooltip="search" type="submit">
                <SearchIcon />
              </IconButton>
            </div>
            <div style={styles.part}>
              <TextField
                value={keyword}
                onChange={(evt) => this.setState({ keyword: evt.target.value })}
                style={{ width: width - 48 }}
                hintText="Search"
                underlineShow={false}
                fullWidth
              />
            </div>
          </form>
        </Paper>
      </div>
    );
  }
}
