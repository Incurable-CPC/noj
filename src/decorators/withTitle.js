/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';

function withTitle(...title) {
  return (BaseComponent) => class ComponentWithTitle extends Component {
    static contextTypes = {
      onSetTitle: PropTypes.func.isRequired,
    };

    componentWillMount() {
      this.context.onSetTitle(title);
    }

    componentWillUnmount() {
    }

    render() {
      return <BaseComponent {...this.props} />;
    }
  };
}

export default withTitle;
