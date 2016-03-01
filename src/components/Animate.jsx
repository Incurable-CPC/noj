/**
 * Create by cpc on 2/19/16.
 **/

import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class Animate extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    name: PropTypes.string.isRequired,
    style: PropTypes.object.isRequired,
  };

  render() {
    const { name, style } = this.props;
    return (
      <ReactCSSTransitionGroup
        transitionName={{
          enter: style[`${name}-enter`],
          enterActive: style[`${name}-enter-active`],
          leave: style[`${name}-leave`],
          leaveActive: style[`${name}-leave-active`],
        }}
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}
      >{this.props.children}</ReactCSSTransitionGroup>
    );
  }
}
