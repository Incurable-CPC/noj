/**
 * Create by cpc on 3/23/16.
 **/

import React, { Component, PropTypes } from 'react';
import RaisedButton from 'material-ui/lib/raised-button';

import Location from '../core/Location';

export default class Pagination extends Component {
  static propTypes = {
    list: PropTypes.arrayOf(
      PropTypes.shape({
        isCurrent: PropTypes.bool,
        content: PropTypes.string,
        href: PropTypes.string,
      })
    ),
  };

  render() {
    const { list } = this.props;
    const nodeList = list.map((node, index) => {
      const { content, href, isCurrent, ...props } = node;
      return (
        <RaisedButton
          key={index}
          label={content}
          style={{ minWidth: 40, marginLeft: 1 }}
          onTouchTap={() => Location.push(href)}
          secondary={isCurrent}
          {...props}
        />
      );
    });
    return (
      <div>
        {nodeList}
      </div>
    );
  }
}
