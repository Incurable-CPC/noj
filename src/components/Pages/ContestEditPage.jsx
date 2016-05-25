/**
 * Create by cpc on 1/13/16.
 **/

import React, { PropTypes } from 'react';
import Paper from 'material-ui/Paper';

import s from './common.scss';
import withTitle from '../../decorators/withTitle';
import withStyles from '../../decorators/withStyles';
import ContestEditForm from '../Forms/ContestEditForm';
import BasePage from './BasePage';

@withTitle('NOJ - Contests')
@withStyles(s)
export default class ContestEditPage extends BasePage {
  static propTypes = {
    params: PropTypes.object,
  };

  render() {
    const { params: { cid } } = this.props;
    const action = cid ? 'save' : 'add';

    return (
      <div className={s.div}>
        <div className={s.left}>
          <Paper className={s.paper}>
            <ContestEditForm action={action} />
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
