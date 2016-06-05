/**
 * Create by cpc on 6/5/16.
 **/

import React, { Component, PropTypes } from 'react';
import MTAvatar from 'material-ui/Avatar';

export default class Avatar extends Component {
  static propTypes = {
    src: PropTypes.string,
  }

  state = {
    show: true,
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.src !== nextProps.src) {
      this.setState({ show: false });
    }
  }

  componentDidUpdate() {
    if (!this.state.show) {
      /* eslint-disable react/no-did-update-set-state */
      this.setState({ show: true });
    }
  }

  render() {
    return this.state.show &&
      <MTAvatar {...this.props} />;
  }
}
