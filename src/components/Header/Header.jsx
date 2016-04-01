/**
 * Create by cpc on 1/8/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import Styles from 'material-ui/lib/styles';
import Paper from 'material-ui/lib/paper';
import { Link } from 'react-router';
import { Tabs, Tab } from 'material-ui/lib/tabs';
import FlatButton from 'material-ui/lib/flat-button';
const { Colors } = Styles;

import LoginDialog from '../Dialogs/LoginDialog.jsx';
import RegisterDialog from '../Dialogs/RegisterDialog.jsx';
import { nameToLabel } from '../../common';
import withStyles from '../../decorators/withStyles';
import Location from '../../core/Location';

import s from './Header.scss';

const styles = {
  tab: {
    backgroundColor: Colors.white,
    color: Colors.black,
  },
  ink: { backgroundColor: Colors.grey500 },
  whiteInk: { backgroundColor: Colors.white },
};

@withStyles(s)
export default class Header extends Component {
  static propTypes = {
    showDialog: PropTypes.func.isRequired,
    hideDialog: PropTypes.func.isRequired,
    active: PropTypes.string.isRequired,
    dialog: PropTypes.string.isRequired,
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    auth: ImmutableTypes.map.isRequired,
    cid: PropTypes.string,
  };
  render() {
    const {
      dialog, showDialog, hideDialog,
      login, logout, register, auth,
      active, cid,
    } = this.props;
    const LinkTab = (name, index) => (
      <Tab
        className={s.tab}
        style={styles.tab}
        key={index}
        value={name}
        label={nameToLabel(name)}
        onActive={() => Location.push((cid && `/contests/${cid}/${name}`) || `/${name}`)}
      />
    );
    const DialogTab = (name, index) => (
      <Tab
        className={s.tab}
        style={styles.tab}
        key={index}
        value={name}
        label={nameToLabel(name)}
        onActive={() => showDialog(name)}
      />
    );
    const items = (cid) ?
      ['overview', 'problems', 'standing', 'clarify'] :
      ['problems', 'contests', 'status', 'standing'];
    const leftPart = items.map(LinkTab);
    const rightPart = auth.has('username') ? (
      <div>
        <FlatButton
          style={{ textTransform: '' }}
          className={s.button}
          label={auth.get('username')}
          onTouchTap={logout}
        />
      </div>
    ) : (
      <div>
        <Tabs inkBarStyle={styles.whiteInk}>
          {['login', 'register'].map(DialogTab)}
        </Tabs>
      </div>
    );

    return (
      <Paper className={s.header}>
        <div className={s.container}>
          <Link className={s.title} to="/"><strong>NOJ</strong></Link>
          <Tabs className={s.left} value={active} inkBarStyle={styles.ink}>
            {leftPart}
          </Tabs>
          <div className={s.right}>
            {rightPart}
          </div>
        </div>
        <LoginDialog
          auth={auth}
          login={login}
          open={dialog === 'login'}
          hide={hideDialog}
        />
        <RegisterDialog
          auth={auth}
          register={register}
          open={dialog === 'register'}
          hide={hideDialog}
        />
      </Paper>
    );
  }
}
