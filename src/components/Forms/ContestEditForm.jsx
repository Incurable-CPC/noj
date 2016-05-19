/**
 * Create by cpc on 3/27/16.
 **/

import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import DateTimePicker from '../Lib/DateTimePicker.jsx';

import Animate from '../Lib/Animate.jsx';
import { getJSON } from '../../core/fetchJSON';
import { postContest } from '../../actions/contestActions';
import s from './EditForm.scss';
import withStyles from '../../decorators/withStyles';

const fields = [
  'cid',
  'title',
  'start',
  'duration',
  'problems[].pid',
  'problems[].title',
  'problems[].error',
];

@reduxForm({
  form: 'contestEdit',
  fields,
}, (state) => ({ initialValues: state.contest.get('detail').toJS() }))
@withStyles(s)
export default class ContestEditForm extends Component {
  static propTypes = {
    action: PropTypes.string,
    fields: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
  };

  setProblemInfoText = (index, title, error) => {
    const problem = this.props.fields.problems[index];
    problem.title.onChange(title);
    problem.error.onChange(error);
  };
  getProblemTitle = (index, pid) => {
    clearTimeout(this._updateProblem[index]);
    this._updateProblem[index] = setTimeout(async () => {
      try {
        const res = await getJSON(`/api/problems/${pid}`);
        const { problem: { title } } = await res.json();
        this.setProblemInfoText(index, title);
      } catch (err) {
        this.setProblemInfoText(index, '', `Problem ${pid} not exist`);
      }
      this.forceUpdate();
    }, 500);
  };
  _updateProblem = [];

  render() {
    const {
      fields: { title, duration, start, problems },
      handleSubmit,
      submitting,
      action,
    } = this.props;
    const startDate = start.value && new Date(start.value);
    return (
      <form className={s.form} onSubmit={handleSubmit(postContest)}>
        <div>
          <TextField
            floatingLabelText="Title"
            {...title}
          />
          <DateTimePicker
            floatingLabelText="Start Time"
            format="YYYY-MM-DD HH:mm"
            value={startDate}
            onChange={(evt, date) => start.onChange(date)}
          />
          <div>
            <TextField
              floatingLabelText="Duration / hours"
              {...duration}
            />
          </div>
          <Animate style={s} name="problem">
            {problems.map((problem, index) => {
              const { pid: { onChange, ...others } } = problem;
              const handleChange = (evt) => {
                const value = evt.target.value;
                onChange(value);
                this.getProblemTitle(index, value);
              };
              return (
                <div className={s.problem} key={index}>
                  <TextField
                    floatingLabelText={`Problem ${index + 1}`}
                    errorText={problem.error.value}
                    onChange={handleChange}
                    {...others}
                  />
                  {problem.title.value}
                  <FlatButton label="REMOVE" onTouchTap={() => problems.removeField(index)}/>
                </div>
              );
            })}
          </Animate>
          <FlatButton label="add problem" onTouchTap={() => problems.addField()}/>
        </div>
        <div className={s.action}>
          <RaisedButton
            primary
            type="submit"
            label={action}
            disabled={submitting}
          />
        </div>
      </form>
    );
  }
}
