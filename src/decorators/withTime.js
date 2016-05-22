import React, { Component } from 'react';
import moment from 'moment';

import { getJSON } from '../core/fetchJSON';
import { api } from '../config';

let _interval = null;
let _diff = 0;
let _time = moment();
let _func = [];
const init = async() => {
  const res = await getJSON(`${api}/time`);
  const { time } = await res.json();
  clearInterval(_interval);
  _diff = moment().diff(time);
  _interval = setInterval(() => {
    _time = moment().subtract(_diff);
    _func.forEach((func) => func());
  }, 1000);
};

export default function withTime() {
  return (BaseComponent) => class ComponentWithTitle extends Component {
    componentDidMount() {
      init();
      this._index = _func.length;
      _func.push(() => this.forceUpdate());
    }

    componentWillUnmount() {
      _func.splice(this._index, 1);
    }
    _index;

    render() {
      return <BaseComponent time={_time} {...this.props} />;
    }
  };
}

export const getTime = () => _time;
