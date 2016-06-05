/**
 * Create by cpc on 1/8/16.
 **/

import React, { Component, PropTypes } from 'react';
import ImmutableTypes from 'react-immutable-proptypes';
import * as colors from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';
import Divider from 'material-ui/Divider';
import { NavigationMoreVert } from 'material-ui/svg-icons';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Link } from 'react-router';

import LoginDialog from '../Dialogs/LoginDialog.jsx';
import RegisterDialog from '../Dialogs/RegisterDialog.jsx';
import UserAvatar from '../Lib/UserAvatar';
import { nameToLabel } from '../../core';
import withStyles from '../../decorators/withStyles';
import Location from '../../core/Location';
import { root } from '../../config';

import s from './Header.scss';

const height = 48;
const styles = {
  ink: { backgroundColor: colors.cyan500 },
  nameLabel: { textTransform: null },
  tabs: { height },
  right: {
    float: 'right',
    marginRight: 20,
  },
  rightItem: { float: 'right' },
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
      <div style={styles.right}>
        <span style={styles.rightItem}>
          <IconMenu
            iconButtonElement={<IconButton><NavigationMoreVert /></IconButton>}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          >
            <MenuItem
              primaryText="Profile"
              onTouchTap={() => Location.push(`/users/${auth.get('username')}`)}
            />
            <MenuItem
              primaryText="Settings"
              onTouchTap={() => Location.push('/settings')}
            />
            <Divider />
            <MenuItem
              primaryText="Log out"
              onTouchTap={logout}
              style={{ color: colors.pinkA200 }}
            />
          </IconMenu>
        </span>
        <span style={styles.rightItem}>
          <UserAvatar user={auth} size={48} />
        </span>
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
