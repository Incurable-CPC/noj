/**
 * Create by cpc on 1/3/16.
 **/

import React, { Component } from 'react';
import withTitle from '../../decorators/withTitle';

export default
@withTitle('NJU Online Judge')
class Index extends Component {
  render() {
    return <h1 style={{ textAlign: 'center' }}>Welcome to NJU Online Judge</h1>;
  }
}
