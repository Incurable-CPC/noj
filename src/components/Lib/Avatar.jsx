/**
 * Create by cpc on 6/5/16.
 **/

import React, { Component } from 'react';
import MTAvatar from 'material-ui/Avatar';

export default class Avatar extends Component {
  state = {
    show: true,
  };

  componentWillReceiveProps() {
    this.setState({ show: false });
  }

  componentDidUpdate() {
    if (!this.state.show) {
      this.setState({ show: true });
    }
  }

  render() {
    return this.state.show &&
      <MTAvatar {...this.props} />;
  }
}
