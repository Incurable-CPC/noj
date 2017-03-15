/**
 * Create by cpc on 5/14/16.
 **/

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form, Field, reduxForm } from 'redux-form/immutable';
import RaisedButton from 'material-ui/RaisedButton';

import s from './EditForm.scss';
import withStyles from '../../decorators/withStyles';
import { clarifyContest } from '../../actions/contest';
import { TextInput } from './Inputs';

const form = 'clarification';

@connect((state, prop) => ({
  initialValues: {
    cid: state.getIn(['contest', 'detail', 'cid']),
    qid: prop.qid,
  },
}))
@reduxForm({ form })
@withStyles(s)
export default class ClarificationForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    qid: PropTypes.number.isRequired,
  };

  render() {
    const {
      handleSubmit,
      submitting,
      qid,
    } = this.props;
    const label = (qid < 0) ? 'Question' : 'Answer';
    return (
      <Form onSubmit={handleSubmit(clarifyContest())}>
        <div>
          <Field
            name="content" label={label}
            multiLine fullWidth
            component={TextInput}
          />
        </div>
        <div className={s.action}>
          <RaisedButton
            disabled={submitting}
            primary
            type="submit"
            label="post"
          />
        </div>
        <div style={{ clear: 'both' }}/>
      </Form>
    );
  }
}
