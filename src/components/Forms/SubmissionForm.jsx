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
import DropDownMenu from 'material-ui/DropDownMenu';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Codemirror from 'react-codemirror';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/python/python';
import { reduxForm } from 'redux-form';

import { submit } from '../../actions/submission';
import { LANGUAGES, LANGUAGE_MODES } from '../../constants/index';

const fields = ['code', 'language', 'pid', 'cid'];
@reduxForm({
  form: 'submission',
  fields,
}, (state, props) => ({
  initialValues: {
    language: 0,
    pid: props.problem.get('pid'),
    cid: props.cid,
  },
}))
export default class SubmissionForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    problem: ImmutableTypes.map.isRequired,
    cid: PropTypes.number,
  };

  render() {
    const {
      fields: { code, language },
      handleSubmit,
      submitting,
      problem,
      } = this.props;
    const pid = problem.get('pid');
    const langs = LANGUAGES[problem.get('originOJ')].map((lang, index) => (
      <MenuItem value={index} key={index} primaryText={lang} />
    ));
    const options = {
      lineNumbers: true,
      mode: LANGUAGE_MODES[problem.get('originOJ')][language.value],
    };
    return (
      <Paper>
        <form onSubmit={handleSubmit(submit)}>
          <Toolbar>
            <ToolbarGroup float="left">
              <ToolbarTitle text="Language: "/>
              <DropDownMenu {...language} onChange={(evt, index, val) => language.onChange(val)}>
                {langs}
              </DropDownMenu>
            </ToolbarGroup>
            <ToolbarGroup float="right">
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
          <Codemirror
            onChange={code.onChange}
            options={options}
          />
        </form>
      </Paper>
    );
  }
}
