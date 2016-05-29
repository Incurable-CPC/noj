/**
 * Create by cpc on 2/17/16.
 **/

import React, { Component, PropTypes } from 'react';
import { markWithMath } from '../../core';
export default class Marked extends Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
  };

  render() {
    const { src } = this.props;
    const html = {
      __html: markWithMath(src),
    };
    return (
      <div dangerouslySetInnerHTML={html} />
    );
  }
}
