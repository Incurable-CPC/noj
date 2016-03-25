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
  };

  render() {
    const { width } = this.props;
    return (
      <div>
        <Paper style={{ width, margin: 10 }}>
          <div style={{ display: 'inline-block', verticalAlign: 'top' }}>
            <IconButton tooltip="search">
              <SearchIcon />
            </IconButton>
          </div>
          <div style={{ display: 'inline-block', verticalAlign: 'top' }}>
            <TextField
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
