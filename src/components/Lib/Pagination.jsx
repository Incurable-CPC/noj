/**
 * Create by cpc on 3/23/16.
 **/

import React, { Component, PropTypes } from 'react';
import RaisedButton from 'material-ui/lib/raised-button';

import Location from '../../core/Location';

export default class Pagination extends Component {
  static propTypes = {
    list: PropTypes.arrayOf(
      PropTypes.shape({
        content: PropTypes.string,
        href: PropTypes.string,
      })
    ),
    current: PropTypes.bool,
  };

  render() {
    const { list, current } = this.props;
    const nodeList = list.map((node, index) => {
      const { content, href, isCurrent, ...props } = node;
      return (
        <RaisedButton
          key={index}
          label={content}
          labelStyle={{ paddingLeft: 12, paddingRight: 12 }}
          style={{ minWidth: 40, marginLeft: 1 }}
          onTouchTap={() => Location.push(href)}
          secondary={current === content}
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
