/**
 * Create by cpc on 1/4/16.
 **/

import React, { Component } from 'react';
import { Input } from 'react-bootstrap';

import Location from '../../core/Location';
import withTitle from '../../decorators/withTitle';
import UserActions from '../../actions/authActions';
import { toastr } from '../App/App';

@withTitle('NOJ - Login')
class LoginPage extends Component {
  state = {
    username: '',
    password: '',
  }
  _login = async () => {
    const username = this.state.username;
    const password = this.state.password;
    const res = await UserActions.login(username, password);
    if (res.status === 'success') {
      Location.push('/index');
      toastr('success', 'Login succeed', 'Welcome to NJU Online Judge');
    } else {
      toastr('error', 'Password not correct');
    }
  }
  _handleChange = (filed, evt) => {
    const newVal = {};
    newVal[filed] = evt.target.value;
    this.setState(newVal);
  }
  render() {
    return (
      <form className="form-horizontal">
        <fieldset>
          <legend>User Login</legend>
          <Input
            id="username"
            type="text"
            label="Username"
            onChange={this._handleChange.bind(null, 'username')}
            labelClassName="col-sm-2"
            wrapperClassName="col-sm-3"
          />
          <Input
            id="password"
            type="password"
            label="Password"
            onChange={this._handleChange.bind(null, 'password')}
            labelClassName="col-sm-2"
            wrapperClassName="col-sm-3"
          />
          <Input type="checkbox" label="Remember me" wrapperClassName="col-sm-offset-2 col-sm-2" />
          <Input
            type="button"
            value="Login"
            onClick={this._login}
            wrapperClassName="col-sm-offset-2 col-sm-2"
            className="btn btn-primary"
          />
        </fieldset>
      </form>
    );
  }
}

export default LoginPage;
