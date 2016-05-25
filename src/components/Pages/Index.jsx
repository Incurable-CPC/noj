/**
 * Create by cpc on 1/3/16.
 **/

import React from 'react';
import withTitle from '../../decorators/withTitle';
import BasePage from './BasePage';

export default
@withTitle('NJU Online Judge')
class Index extends BasePage {

  render() {
    return <h1 style={{ textAlign: 'center' }}>Welcome to NJU Online Judge</h1>;
  }
}
