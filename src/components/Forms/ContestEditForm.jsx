/**
 * Create by cpc on 3/27/16.
 **/

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form, Field, FieldArray, formValueSelector, reduxForm } from 'redux-form/immutable';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { fromJS } from 'immutable';

import { TextInput, DataTimeInput } from './Inputs';
import Animate from '../Lib/Animate';
import { getJSON } from '../../core/fetchJSON';
import { postContest } from '../../actions/contest';
import s from './EditForm.scss';
import withStyles from '../../decorators/withStyles';
import { problemNotExist, MAX_PROBLEM_CNT } from '../../check/contest';
import toast from '../../core/toast';
import { api } from '../../config';

const form = 'contestEdit';
const selector = formValueSelector(form);

@withStyles(s)
@connect((state) => ({
  start: selector(state, 'start'),
  initialValues: state.getIn(['contest', 'detail']),
}))
@reduxForm({ form })
export default class ContestEditForm extends Component {
  static propTypes = {
    action: PropTypes.string,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    start: PropTypes.object,
  };

  state = {
    data: fromJS([]),
  };

  updateProblem = (index, pid, input) => {
    input.onChange(pid);
    clearTimeout(this._updateProblem[index]);
    this._updateProblem[index] = setTimeout(async () => {
      let field = '';
      let content = '';
      try {
        const { problem: { title } } = await getJSON(`${api}/problems/${pid}`);
        field = 'title';
        content = title;
      } catch (err) {
        field = 'error';
        content = problemNotExist(pid, index);
      }
      this.setState(({ data }) => ({
        data: data.set(index, fromJS({ [field]: content })),
      }));
    }, 500);
  };

  _updateProblem = [];

  addProblem = (problems) => () => {
    if (problems.length < MAX_PROBLEM_CNT) {
      problems.push();
    } else {
      toast('warning', 'Too many problems');
    }
  };

  renderProblem = ({ input, label, index, error }) => (
    <TextField
      floatingLabelText={label}
      onChange={(evt, val) => this.updateProblem(index, val, input)}
      errorText={error}
    />
  );

  renderProblems = ({ fields, info }) => (
    <div>
      <Animate style={s} name="problem">
        {fields.map((problem, index) => {
          const pid = String.fromCharCode('A'.charCodeAt(0) + index);
          return (
            <div className={s.problem} key={index}>
              <Field
                name={`${problem}.pid`}
                label={`Problem ${pid}`}
                index={index}
                error={info.getIn([index, 'error'])}
                component={this.renderProblem}
              />
              {info.getIn([index, 'title'])}
              <FlatButton label="remove" onTouchTap={() => fields.remove(index)} />
            </div>
          );
        })}
      </Animate>
      <FlatButton
        onTouchTap={this.addProblem(fields)}
        label="add problem"
      />
    </div>
  );

  render() {
    const {
      handleSubmit,
      submitting,
      action,
      start,
    } = this.props;
    const startDate = start && new Date(start);
    return (
      <Form className={s.form} onSubmit={handleSubmit(postContest())}>
        <div>
          <Field name="title" label="Title" component={TextInput}/>
          <Field
            name="start" label="Start Time"
            dateTimeFormat="YYYY-MM-DD HH:mm"
            dateTime={startDate}
            component={DataTimeInput}
          />
          <div>
            <Field
              name="duration" label="Duration / hours"
              type="number"
              component={TextInput}
            />
          </div>
          <FieldArray
            name="problems"
            info={this.state.data}
            component={this.renderProblems}
          />
        </div>
        <div className={s.action}>
          <RaisedButton
            primary
            type="submit"
            label={action}
            disabled={submitting}
          />
        </div>
        <div style={{ clear: 'both' }} />
      </Form>
    );
  }
}
