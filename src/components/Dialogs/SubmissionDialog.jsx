/**
 * Create by cpc on 2/26/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import Dialog from 'material-ui/lib/dialog';

import SubmissionForm from '../Forms/SubmissionForm.jsx';

export default class SubmissionDialog extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    problem: ImmutableTypes.map.isRequired,
  };

  render() {
    const { open, hide, problem } = this.props;
    return (
      <Dialog
        title="Problem Submit"
        open={open}
        onRequestClose={hide}
      ><SubmissionForm problem={problem}/></Dialog>
    );
  }
}
