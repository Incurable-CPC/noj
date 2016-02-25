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
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/python/python';
import { reduxForm } from 'redux-form';

const fields = ['code', 'language'];
@reduxForm({
  form: 'submission',
  fields,
}, () => ({ initialValues: { language: 'c' } }))
export default class SubmissionForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    problem: ImmutableTypes.map.isRequired,
  };

  render() {
    const {
      problem,
      fields: { code, language },
      } = this.props;
    const { pid, title } = problem.toJS();
    const map = {
      c: 'text/x-csrc',
      cpp: 'text/x-c++src',
      java: 'text/x-java',
      python: 'python',
    };
    const options = {
      lineNumbers: true,
      mode: map[language.value],
    };
    return (
      <Paper>
        <form>
          <Toolbar>
            <ToolbarGroup float="left">
              <ToolbarTitle text="Language: "/>
              <DropDownMenu {...language} onChange={(evt, index, val) => language.onChange(val)}>
                <MenuItem value="c" primaryText="C" />
                <MenuItem value="cpp" primaryText="C++" />
                <MenuItem value="java" primaryText="Java" />
                <MenuItem value="python" primaryText="Python" />
              </DropDownMenu>
            </ToolbarGroup>
            <ToolbarGroup float="right">
              <ToolbarSeparator style={{ marginRight: 20 }}/>
              <ToolbarTitle text={` ${pid} - ${title}`} />
            </ToolbarGroup>
          </Toolbar>
          <Codemirror {...code} options={options} />
        </form>
      </Paper>
    );
  }
}
