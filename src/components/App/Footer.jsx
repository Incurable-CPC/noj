/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import withStyles from '../../decorators/withStyles';
import s from './Footer.scss';

@withStyles(s)
class Footer extends Component {
  render() {
    return (
      <footer className={s.footer}>
        <div className={s.info}>
          <p className={s.p}>Created by CPC</p>
          <p className={s.p}>Copyright &copy; NJU ACM/ICPC Team. All Rights Reserved</p>
        </div>
      </footer>
    );
  }

}

export default Footer;
