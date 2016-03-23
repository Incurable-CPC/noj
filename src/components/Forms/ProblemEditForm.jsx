/**
 * Create by cpc on 2/16/16.
 **/

import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import TextField from 'material-ui/lib/text-field';
import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';
import { fromJS } from 'immutable';

import { nameToStr } from '../../common';
import s from './ProblemEditForm.scss';
import withStyles from '../../decorators/withStyles';
import Animate from '../Animate.jsx';
import Problem from '../Problem.jsx';
import { postProblem } from '../../actions/ProblemActions';

const fields = [
  'pid',
  'title',
  'timeLimit',
  'memoryLimit',
  'descriptionSrc',
  'inputSrc',
  'outputSrc',
  'samples[].input',
  'samples[].output',
  'sourceSrc',
  'hintSrc',
];
const nextStatus = (status) => ((status === 'preview') ? 'edit' : 'preview');

@reduxForm({
  form: 'problemEdit',
  fields,
}, (state) => ({ initialValues: state.problem.get('detail').toJS() }))
@withStyles(s)
export default class ProblemEditForm extends Component {
  static propTypes = {
    action: PropTypes.string,
    fields: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
  };

  state = {
    status: 'edit',
  };

  changeStatus = () => {
    const status = nextStatus(this.state.status);
    this.setState({ status });
  };

  render() {
    const {
      fields: { title, timeLimit, memoryLimit, samples },
      handleSubmit,
      submitting,
      values,
      } = this.props;
    const textarea = (field, row) => {
      const src = this.props.fields[`${field}Src`];
      return (
        <div>
          <TextField
            fullWidth
            multiLine
            rows={row}
            floatingLabelText={nameToStr(field)}
            {...src}
          />
        </div>
      );
    };

    return (
      <form className={s.form} onSubmit={handleSubmit(postProblem)}>
        {(this.state.status === 'edit') ? (
          <div>
            <div>
              <TextField
                floatingLabelText="Title"
                {...title}
              />
            </div>
            <div>
              <TextField
                style={{ width: 150, marginRight: 60 }}
                floatingLabelText="Time Limit / ms"
                type="number"
                {...timeLimit}
              />
              <TextField
                style={{ width: 150 }}
                floatingLabelText="Memory Limit / MB"
                type="number"
                {...memoryLimit}
              />
            </div>
            {textarea('description', 5)}
            {textarea('input', 3)}
            {textarea('output', 3)}
            <Animate style={s} name="sample">
              {samples.map((sample, index) => (
                <div className={s.sample} key={index} name="sample">
                  <TextField
                    style={{ width: 250, marginRight: 60 }}
                    multiLine
                    rows={3}
                    floatingLabelText={`Sample Input #${index + 1}`}
                    {...sample.input}
                  />
                  <TextField
                    style={{ width: 250 }}
                    multiLine
                    rows={3}
                    floatingLabelText={`Sample Output #${index + 1}`}
                    {...sample.output}
                  />
                  {(samples.length > 1) ? (
                    <FlatButton label="REMOVE" onTouchTap={() => samples.removeField(index)}/>
                  ) : null}
                </div>
              ))}
            </Animate>
            <FlatButton label="ADD SAMPLE" onTouchTap={() => samples.addField()}/>
            {textarea('source', 1)}
            {textarea('hint', 2)}
          </div>
        ) : <Problem editting problem={fromJS(values)} />}
        <div className={s.action}>
          <RaisedButton
            style={{ marginRight: 40 }}
            label={nextStatus(this.state.status)}
            onTouchTap={this.changeStatus}
          />
          <RaisedButton
            secondary
            type="submit"
            label={this.props.action}
            disabled={submitting}
          />
        </div>
      </form>
    );
  }
}
