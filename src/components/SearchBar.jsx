/**
 * Create by cpc on 3/26/16.
 **/

import React, { Component, PropTypes } from 'react';
import Paper from 'material-ui/lib/paper';
import IconButton from 'material-ui/lib/icon-button';
import SearchIcon from 'material-ui/lib/svg-icons/action/search';
import TextField from 'material-ui/lib/text-field';

export default class SearchBar extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    search: PropTypes.func.isRequired,
  };

  state = {
    keyword: '',
  };

  handleSearch = async () => {
    const { keyword } = this.state;
    const { search } = this.props;
    await search(keyword);
  };

  render() {
    const { width } = this.props;
    const { keyword } = this.state;
    return (
      <div>
        <Paper style={{ width, margin: 10 }}>
          <div style={{ display: 'inline-block', verticalAlign: 'top' }}>
            <IconButton tooltip="search" onTouchTap={this.handleSearch}>
              <SearchIcon />
            </IconButton>
          </div>
          <div style={{ display: 'inline-block', verticalAlign: 'top' }}>
            <TextField
              value={keyword}
              onChange={(evt) => this.setState({ keyword: evt.target.value })}
              style={{ width: width - 48 }}
              hintText="Search"
              underlineShow={false}
              fullWidth
            />
          </div>
        </Paper>
      </div>
    );
  }
}
