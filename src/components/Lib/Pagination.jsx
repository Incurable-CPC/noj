/**
 * Create by cpc on 3/23/16.
 **/

import React, { Component, PropTypes } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

import Location from '../../core/Location';

export default class Pagination extends Component {
  static propTypes = {
    list: PropTypes.arrayOf(
      PropTypes.shape({
        content: PropTypes.string,
        href: PropTypes.string,
      })
    ),
    range: PropTypes.shape({
      begin: PropTypes.number,
      end: PropTypes.number,
      count: PropTypes.number,
      page: PropTypes.number,
      href: PropTypes.string,
    }),
    current: PropTypes.string,
  };

  render() {
    let { list, range, current } = this.props;
    if ((!list) && range) {
      const { href, begin, end, count, page } = range;
      const pageUrl = (pageId) => `${href}/${pageId}`;
      const first = { content: 'first', href: pageUrl(1) };
      const previous = {
        content: '<',
        href: pageUrl(Math.max(1, page - 1)),
      };
      list = [first, previous];
      for (let index = begin; index <= end; index++) {
        list.push({
          content: `${index}`,
          href: pageUrl(index),
        });
      }
      const last = { content: 'last', href: pageUrl(count) };
      const next = {
        content: '>',
        href: pageUrl(Math.min(page + 1, count)),
      };
      list.push(next);
      list.push(last);
      current = `${page}`;
    }
    const nodeList = list && list.map((node, index) => {
      const { content, href, isCurrent, ...props } = node;
      return (
        <RaisedButton
          key={index}
          label={content}
          labelStyle={{ padding: 12 }}
          style={{ minWidth: 40, marginLeft: 1 }}
          onTouchTap={() => Location.push(href)}
          primary={current === content}
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
