/**
 * Create by cpc on 4/17/16.
 **/

import React, { Component } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { Map } from 'immutable';
import { green400, red500, green800, white } from 'material-ui/styles/colors';

import withStyle from '../decorators/withStyles';
import s from './Board.scss';

const styles = {
  solved: { backgroundColor: green800 },
  failed: { backgroundColor: red500 },
  first: { backgroundColor: green400 },
  col: { color: white },
};

@withStyle(s)
export default class Board extends Component {
  static propTypes = {
    problems: ImmutableTypes.list,
    teams: ImmutableTypes.map,
  };

  render() {
    const { problems, teams } = this.props;
    const showTime = (t) => {
      let res = '';
      if (t) {
        let sec = t.seconds();
        let min = t.minutes();
        let hour = Math.floor(t.asHours());
        if (sec < 10) sec = '0' + sec;
        if (min < 10) min = '0' + min;
        res = `${hour}:${min}:${sec}`;
      }
      return res;
    };
    return (
      <table className={s.board}>
        <tbody>
        <tr>
          <th>#</th>
          <th>Team</th>
          <th>Solved</th>
          <th>Penalty</th>
          {problems.map((problem, index) => {
            const pid = String.fromCharCode(index + 'A'.charCodeAt(0));
            const title = problem.get('title');
            return (
              <th key={pid} tooltip={title}>
                {pid}
                <br />
                <span style={{ fontSize: 12 }}>
                  {`${problem.get('accepted')}/${problem.get('submit')}`}
                </span>
              </th>
            );
          })}
        </tr>
        {teams && teams.entrySeq().map(([name, team], rank) => (
          <tr key={rank}>
            <td>{rank + 1}</td>
            <td>{name}</td>
            <td>{team.get('solved') || 0}</td>
            <td>{showTime(team.get('penalty'))}</td>
            {problems.map((problem, index) => {
              const state = team.getIn(['problems', index]) || new Map();
              let style = Object.assign({}, styles.col);
              if (state.has('failed')) Object.assign(style, styles.failed);
              if (state.has('solved')) Object.assign(style, styles.solved);
              if (state.get('isFirst')) Object.assign(style, styles.first);
              const twoLine = state.get('solved') && state.has('failed');
              return (
                <td
                  key={index}
                  style={style}
                >
                  {showTime(state.get('solved'))}
                  {twoLine && <br />}
                  {state.has('failed') && `(-${state.get('failed')})`}
                </td>
              );
            })}
          </tr>
        ))}
        </tbody>
      </table>
    );
  }
}
