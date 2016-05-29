/**
 * Create by cpc on 1/8/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import { white, black, cyan500 } from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Link } from 'react-router';

import LoginDialog from '../Dialogs/LoginDialog.jsx';
import RegisterDialog from '../Dialogs/RegisterDialog.jsx';
import { nameToLabel } from '../../core';
import withStyles from '../../decorators/withStyles';
import Location from '../../core/Location';
import { root } from '../../config';

import s from './Header.scss';

const height = 48;
const styles = {
  ink: { backgroundColor: cyan500 },
  nameLabel: { textTransform: null },
  nameButton: { height },
  tabs: { height },
};

@withStyles(s)
export default class Header extends Component {
  static propTypes = {
    showDialog: PropTypes.func.isRequired,
    hideDialog: PropTypes.func.isRequired,
    active: PropTypes.string.isRequired,
    dialog: PropTypes.string.isRequired,
    login: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    auth: ImmutableTypes.map.isRequired,
    cid: PropTypes.string,
  };
  render() {
    const {
      dialog, showDialog, hideDialog,
      login, register, auth,
      active, cid,
    } = this.props;
    const LinkTab = (name, index) => (
      <Tab
        className={s.tab}
        key={index}
        value={name}
        label={nameToLabel(name)}
        onActive={() => Location.push(cid ? `/contests/${cid}/${name}` : `/${name}`)}
      />
    );
    const DialogTab = (name, index) => (
      <Tab
        className={s.tab}
        key={index}
        value={name}
        label={nameToLabel(name)}
        onActive={() => showDialog(name)}
      />
    );
    const items = (cid) ?
      ['overview', 'problems', 'status', 'standing', 'clarify'] :
      ['problems', 'contests', 'status', 'standing'];
    const leftPart = (
      <Tabs
        tabItemContainerStyle={styles.tabs}
        className={s.left}
        value={active}
      >{items.map(LinkTab)}</Tabs>
    );
    const rightPart = auth.has('username') ? (
      <div className={s.right}>
        <FlatButton
          className={s.button}
          style={styles.nameButton}
          label={auth.get('username')}
          labelStyle={styles.nameLabel}
          onTouchTap={() => Location.push('/users')}
        />
      </div>
    ) : (
      <div className={s.right}>
        <Tabs style={{ width: 180 }} tabItemContainerStyle={styles.tabs}>
          {['login', 'register'].map(DialogTab)}
        </Tabs>
      </div>
    );
    const rootClassName = s.header + (cid ? ` ${s['contest-header']}` : '');

    return (
      <Paper className={rootClassName}>
        <div className={s.container}>
          <Link className={s.title} to={root}><strong>NOJ</strong></Link>
          {leftPart}
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
