/**
 * Create by cpc on 2/17/16.
 **/

import React, { Component } from 'react';
import Marked from './Marked.jsx';

export default class Test extends Component {
  state = {
    src: '',
  };

  handleChange = (evt) => {
    this.setState({ src: evt.target.value });
  };

  render() {
    return (
      <div style={{ maxWidth: 780 }}>
        <textarea onChange={this.handleChange}/>
        <Marked src={this.state.src} />
      </div>
    );
  }
}
