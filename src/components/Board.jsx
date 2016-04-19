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
    return (
      <Table selectable={false}>
        <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
          <TableRow>
            <TableHeaderColumn>#</TableHeaderColumn>
            <TableHeaderColumn>Team</TableHeaderColumn>
            <TableHeaderColumn>Penalty</TableHeaderColumn>
            {problems.map((problem, index) => {
              const pid = String.fromCharCode(index + 'A'.charCodeAt(0));
              const title = problem.get('title');
              return (
                <TableHeaderColumn key={pid} tooltip={title}>
                  {pid}
                </TableHeaderColumn>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {teams.entrySeq().map(([name, team], rank) => (
            <TableRow key={rank}>
              <TableRowColumn>{rank + 1}</TableRowColumn>
              <TableRowColumn>{name}</TableRowColumn>
              <TableRowColumn>{team.get('penalty')}</TableRowColumn>
              {problems.map((problem, index) => {
                const state = team.getIn(['problems', index]) || new Map();
                let className = '';
                if (state.has('solved')) className = s.solved;
                if (state.has('tried')) className = s.tried;
                return (
                  <TableRowColumn
                    style={{ backgroundColor: null }}
                    key={index}
                    className={className}
                  >
                    {state.get('solved')}
                    {state.has('tried') && `(-${state.get('tried')})`}
                  </TableRowColumn>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}
