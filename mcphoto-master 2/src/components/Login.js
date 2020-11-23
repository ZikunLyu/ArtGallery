import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import { Auth } from '../App';
import { BrowserRouter as Router, Redirect } from 'react-router-dom'; // for some reason, has to Keep Router imported to make Redirect work

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.login = this.login.bind(this);
  }
  state = {
    email: '',
    password: '',
    redirectToReferrer: false
  };
  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    });
  }
  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  async login() {
    Auth.authenticate({
      email: this.state.email,
      password: this.state.password
    }).then(() => {
      this.setState(() => ({
        redirectToReferrer: true
      }));
    });
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const redirectToReferrer = this.state.redirectToReferrer;

    if (redirectToReferrer === true) {
      return <Redirect to={from} />;
    }

    return (
      <div className="m-5">
        <h3 className="mb-3">Login</h3>
        <div className="form-group">
          <label>email </label>
          <input
            type="text"
            required
            className="form-control"
            name="email"
            value={this.state.email}
            onChange={this.onChangeEmail}
          />
        </div>
        <div className="form-group">
          <label>password </label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={this.state.password}
            onChange={this.onChangePassword}
          />
        </div>
        <div className="btn-group">
          <Button onClick={this.login} name="Login">
            {' '}
            Login{' '}
          </Button>
        </div>
      </div>
    );
  }
}
