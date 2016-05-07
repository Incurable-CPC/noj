/**
 * Create by cpc on 2/25/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import MenuItem from 'material-ui/lib/menus/menu-item';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import Codemirror from 'react-codemirror';
import Paper from 'material-ui/lib/paper';
import RaisedButton from 'material-ui/lib/raised-button';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/python/python';
import { reduxForm } from 'redux-form';

import { submit } from '../../actions/submissionActions';
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
    const { pid, title } = problem.toJS();
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
                secondary
              />
              <ToolbarSeparator style={{ marginRight: 20 }}/>
              <ToolbarTitle text={` ${pid} - ${title}`} />
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
