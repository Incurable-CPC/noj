/**
 * Create by cpc on 1/13/16.
 **/

import React, { PropTypes } from 'react';
import Paper from 'material-ui/Paper';

import s from './common.scss';
import withTitle from '../../decorators/withTitle';
import withStyles from '../../decorators/withStyles';
import ProblemEditForm from '../Forms/ProblemEditForm';
import BasePage from './BasePage';

@withTitle('NOJ - Problems')
@withStyles(s)
export default class ProblemEditPage extends BasePage {
  static propTypes = {
    params: PropTypes.object,
  };

  render() {
    const { params: { pid } } = this.props;
    const action = pid ? 'save' : 'add';

    return (
      <div className={s.div}>
        <div className={s.left}>
          <Paper className={s.paper}>
            <ProblemEditForm action={action} />
          </Paper>
        </div>
        <div className={s.right}>
          <Paper className={s.paper} style={{ height: 250 }}>
            TEST
          </Paper>
        </div>
      </div>
    );
  }
}
