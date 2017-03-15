/**
 * Create by cpc on 2/25/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import Toolbar from 'material-ui/Toolbar/Toolbar';
import ToolbarGroup from 'material-ui/Toolbar/ToolbarGroup';
import ToolbarTitle from 'material-ui/Toolbar/ToolbarTitle';
import ToolbarSeparator from 'material-ui/Toolbar/ToolbarSeparator';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { Field, Form, formValueSelector, reduxForm } from 'redux-form/immutable';

import { connect } from 'react-redux';

import { submitCode } from '../../actions/submission';
import { SelectInput, CodeInput } from './Inputs';
import { LANGUAGES, getModeByValue } from '../../core/languages';

const form = 'submission';
const selector = formValueSelector(form);
@connect((state, props) => ({
  language: selector(state, 'language'),
  initialValues: {
    language: 0,
    pid: props.problem.get('pid'),
    cid: props.cid,
  },
}))
@reduxForm({ form })
export default class SubmissionForm extends Component {
  static propTypes = {
    language: PropTypes.number,
    initialValues: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    problem: ImmutableTypes.map.isRequired,
    cid: PropTypes.number,
  };

  render() {
    const {
      language,
      problem,
      handleSubmit,
      submitting,
      } = this.props;
    const pid = problem.get('pid');
    const originOJ = problem.get('originOJ');
    const langs = LANGUAGES[originOJ].map((lang, index) => (
      <MenuItem value={index} key={index} primaryText={lang} />
    ));
    const options = {
      lineNumbers: true,
      mode: getModeByValue(originOJ, language),
    };
    return (
      <Paper>
        <Form onSubmit={handleSubmit(submitCode())}>
          <Toolbar>
            <ToolbarGroup>
              <ToolbarTitle text="Language: "/>
              <Field name="language" component={SelectInput}>
                {langs}
              </Field>
            </ToolbarGroup>
            <ToolbarGroup>
              <RaisedButton
                type="submit"
                label="submit"
                disabled={submitting}
                primary
              />
              <ToolbarSeparator style={{ marginRight: 20 }}/>
              <ToolbarTitle text={pid} />
            </ToolbarGroup>
          </Toolbar>
          <Field name="code" options={options} component={CodeInput}/>
        </Form>
      </Paper>
    );
  }
}
