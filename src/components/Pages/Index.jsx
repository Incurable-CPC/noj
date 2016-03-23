/**
 * Create by cpc on 1/3/16.
 **/

import React, { Component } from 'react';
import withTitle from '../../decorators/withTitle';

export default
@withTitle('NJU Online Judge')
class Index extends Component {

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return <h1 style={{ textAlign: 'center' }}>Welcome to NJU Online Judge</h1>;
  }
}
