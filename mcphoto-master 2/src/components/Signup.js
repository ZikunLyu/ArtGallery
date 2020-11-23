import React, { Component } from 'react';
import axios from 'axios';
//import 'react-datepicker/dist/react-datepicker.css';
//import urlConfig from '../urls';
import { Layout } from 'antd';
//let urls = urlConfig[process.env.NODE_ENV];

// This can replace the onChangeHandler for all attributes in state
function getAllAttributes(state, form) {
  let keys = Object.keys(state);
  keys.forEach(key => {
    state[key] = form[key].value;
  });
  return state;
}

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      name: '',
      email: '',
      password: '',
      passwordConfirm: ''
    };
  }

  async onSubmit(e) {
    e.preventDefault();
    this.state = getAllAttributes(this.state, e.target);

    if (this.state.password !== this.state.passwordConfirm) {
      alert('Password does not match');
      return;
    }

    let user = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      passwordConfirm: this.state.passwordConfirm
    };

    try {
      let res = await axios({
        method: 'post',
        url: 'http://localhost:3001/api/v1/users/signup',
        data: user,
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.data.status === 'success') {
        window.localStorage.setItem('token', res.data.token);
        window.localStorage.setItem('loggedIn', true);
        window.localStorage.setItem('loggedInEmail', user.email);
        console.log(window.localStorage.getItem('token'));
        this.props.history.push('/');
      } else {
        window.localStorage.removeItem('loggedIn');
        window.localStorage.removeItem('loggedInEmail');
      }
    } catch (err) {
      window.localStorage.removeItem('loggedIn');
      window.localStorage.removeItem('loggedInEmail');
      alert(err.response.data.message);
    }
  }

  render() {
    return (
      <Layout className="m-5" style={{backgroundColor: "white"}}>
        <h3 className="mb-3">New Account</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Name </label>
            <input type="text" required className="form-control" name="name" />
          </div>
          <div className="form-group">
            <label>Email </label>
            <input
              type="email"
              required
              className="form-control"
              name="email"
            />
          </div>
          <div className="form-group">
            <label>Password </label>
            <input
              type="password"
              required
              className="form-control"
              name="password"
              pattern=".{8,}"
            />
          </div>
          <div className="form-group">
            <label>Confirm Password </label>
            <input
              type="password"
              required
              className="form-control"
              name="passwordConfirm"
              title="At least 8 or more characters"
            />
          </div>

          <div className="form-group">
            <input
              type="submit"
              value="Create Account"
              className="btn btn-primary"
            />
          </div>
        </form>
      </Layout>
    );
  }
}
