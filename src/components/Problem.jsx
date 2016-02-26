/**
 * Create by cpc on 2/21/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';

import { nameToStr, markWithMath } from '../common';
import withStyle from '../decorators/withStyles';
import s from './Problem.scss';

@withStyle(s)
export default class Problem extends Component {
  static propTypes = {
    editting: PropTypes.bool,
    problem: ImmutableTypes.map.isRequired,
  };

  render() {
    const { editting } = this.props;
    let { problem } = this.props;
    const srcFields = ['description', 'input', 'output', 'source', 'hint'];
    if (editting) {
      srcFields.forEach((field) => {
        const src = problem.get(`${field}Src`);
        if (src) {
          problem = problem.set(field, markWithMath(src));
        }
      });
    }

    const showField = (field) => (problem.has(field) &&
      <div>
        <h3>{nameToStr(field)}</h3>
        <div dangerouslySetInnerHTML={{ __html: problem.get(field) }} />
      </div>
    );
    return (
      <div>
        <div className={s.title}>
          <div>
            <h1>{problem.get('title')}</h1>
          </div>
          <div>
            <span className={s.center}>
              Time Limit: {problem.get('timeLimit')}ms
            </span>
            <span className={s.center}>
              Memory Limit: {problem.get('memoryLimit')}MB
            </span>
          </div>
        </div>
        {showField('description')}
        {showField('input')}
        {showField('output')}
        <div>
          <h3>Sample(s)</h3>
          {problem.get('samples').map((sample, index) => (
            <div key={index} className={s.sample}>
              <strong>Input #{index + 1}</strong>
              <pre className={s.pre}>{sample.get('input')}</pre>
              <strong>Output #{index + 1}</strong>
              <pre className={s.pre}>{sample.get('output')}</pre>
            </div>
          ))}
        </div>
        {showField('source')}
        {showField('hint')}
      </div>
    );
  }
}
