/**
 * Create by cpc on 2/16/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { Form, Field, FieldArray, reduxForm } from 'redux-form/immutable';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { fromJS } from 'immutable';

import { nameToStr } from '../../core';
import s from './EditForm.scss';
import withStyles from '../../decorators/withStyles';
import Animate from '../Lib/Animate.jsx';
import Problem from '../Problem.jsx';
import { TextInput } from './Inputs';
import { postProblem } from '../../actions/problem';

const nextStatus = (status) => ((status === 'preview') ? 'edit' : 'preview');

const form = 'problemEdit';
@connect((state) => ({
  problem: state.getIn(['form', 'problemEdit', 'values']),
  initialValues: state.getIn(['problem', 'detail']),
}))
@reduxForm({ form })
@withStyles(s)
export default class ProblemEditForm extends Component {
  static propTypes = {
    problem: ImmutableTypes.map,
    action: PropTypes.string,
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

  renderSample = ({ fields }) => (
    <div>
      <Animate style={s} name="sample">
        {fields.map((sample, index) => (
          <div className={s.sample} key={index} name="sample">
            <Field
              style={{ width: 250, marginRight: 60 }}
              multiLine rows={3}
              label={`Sample Input #${index + 1}`}
              name={`${sample}.input`}
              component={TextInput}
            />
            <Field
              style={{ width: 250 }}
              multiLine rows={3}
              label={`Sample Output #${index + 1}`}
              name={`${sample}.output`}
              component={TextInput}
            />
            {(fields.length > 1) ? (
                <FlatButton label="remove" onTouchTap={() => fields.remove(index)}/>
              ) : null}
          </div>
        ))}
      </Animate>
      <FlatButton label="add sample" onTouchTap={() => fields.push()}/>
    </div>
  );


  render() {
    const {
      problem,
      handleSubmit,
      submitting,
      action,
      } = this.props;
    const renderTextarea = (field, row) => {
      return (
        <div>
          <Field
            fullWidth
            multiLine rows={row}
            label={nameToStr(field)}
            name={`${field}Src`}
            component={TextInput}
          />
        </div>
      );
    };

    return (
      <Form className={s.form} onSubmit={handleSubmit(postProblem())}>
        {(this.state.status === 'edit') ? (
            <div>
              <div>
                <Field name="title" label="Title" component={TextInput}/>
              </div>
              <div>
                <Field
                  style={{ width: 150, marginRight: 60 }}
                  name="timeLimitNum"
                  label="Time Limit / ms"
                  type="number"
                  component={TextInput}
                />
                <Field
                  style={{ width: 150 }}
                  name="memoryLimitNum"
                  label="Memory Limit / MB"
                  type="number"
                  component={TextInput}
                />
              </div>
              {renderTextarea('description', 5)}
              {renderTextarea('input', 3)}
              {renderTextarea('output', 3)}
              <FieldArray name="samples" component={this.renderSample}/>
              {renderTextarea('source', 1)}
              {renderTextarea('hint', 2)}
            </div>
          ) : <Problem editing problem={fromJS(problem)} />}
        <div className={s.action}>
          <RaisedButton
            style={{ marginRight: 40 }}
            label={nextStatus(this.state.status)}
            onTouchTap={this.changeStatus}
          />
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
