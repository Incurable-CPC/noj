/**
 * Create by cpc on 4/14/16.
 **/

import React, { Component } from 'react';
import moment from 'moment';

import { getJSON } from '../../core/fetchJSON';

export default class Time extends Component {
  state = {
    time: moment(),
  }

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  init = async() => {
    const res = await getJSON('/api/time');
    const { time } = await res.json();
    this.setState({ time: moment(time) });
    clearInterval(this._interval);
    this._diff = moment().diff(time);
    this._interval = setInterval(() => {
      this.setState({
        time: moment().subtract(this._diff),
      });
    }, 200);
  }

  _interval = null;

  render() {
    return (
      <span>
        {this.state.time.format('YYYY-MM-DD HH:mm:ss')}
      </span>
    );
  }
}
