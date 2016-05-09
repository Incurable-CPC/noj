/**
 * Create by cpc on 4/17/16.
 **/

import React, { Component } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';
import { Map } from 'immutable';

import withStyle from '../decorators/withStyles';
import s from './Board.scss';

@withStyle(s)
export default class Board extends Component {
  static propTypes = {
    problems: ImmutableTypes.list,
    teams: ImmutableTypes.map,
  };

  render() {
    const { problems, teams } = this.props;
    const colStyle = {
      backgroundColor: null,
      whiteSpace: 'nowrap',
    };
    return (
      <table>
        <tr>
          <th>#</th>
          <th>Team</th>
          <th>Penalty</th>
          {problems.map((problem, index) => {
            const pid = String.fromCharCode(index + 'A'.charCodeAt(0));
            const title = problem.get('title');
            return (
              <th key={pid} tooltip={title} style={colStyle}>
                {pid}
              </th>
            );
          })}
        </tr>
        {teams.entrySeq().map(([name, team], rank) => (
          <tr key={rank}>
            <td>{rank + 1}</td>
            <td>{name}</td>
            <td>{team.get('penalty')}</td>
            {problems.map((problem, index) => {
              const state = team.getIn(['problems', index]) || new Map();
              let className = '';
              if (state.has('solved')) className = s.solved;
              if (state.has('tried')) className = s.tried;
              return (
                <td
                  key={index}
                  className={className}
                  style={colStyle}
                >
                  {state.get('solved')}
                  {state.has('tried') && `(-${state.get('tried')})`}
                </td>
              );
            })}
          </tr>
        ))}
      </table>
    );
  }
}
