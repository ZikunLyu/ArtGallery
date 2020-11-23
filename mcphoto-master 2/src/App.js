import React from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'semantic-ui-css/semantic.min.css';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Link,
  withRouter
} from 'react-router-dom';
import axios from 'axios';
import { MDBCol, MDBContainer, MDBRow, MDBFooter } from "mdbreact";
import Login from './components/Login';
import Signup from './components/Signup';
import Gallery from './components/Gallery';
import Profile from './components/Profile';
import Editor from './components/Editor';
import Home from './components/Home';
import Transaction from './components/Transaction';

export const Auth = {
  async authenticate(userinfo) {
    try {
      const res = await axios({
        method: 'post',
        url: 'http://localhost:3001/api/v1/users/login',
        data: userinfo
      });
      if (res.status === 200) {
        window.localStorage.setItem('token', res.data.token);
        window.localStorage.setItem('loggedIn', true);
        window.localStorage.setItem('loggedInEmail', userinfo.email);
      } else {
        window.localStorage.removeItem('loggedIn');
        window.localStorage.removeItem('loggedInEmail');
      }
    } catch (e) {
      console.log(e);
      alert(e.response.data.message);
      window.localStorage.removeItem('loggedIn');
      window.localStorage.removeItem('loggedInEmail');
    }
  },
  logout() {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('loggedIn');
    window.localStorage.removeItem('loggedInEmail');
  }
};

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      window.localStorage.getItem('loggedIn') ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

const Protected = () => <h3>Protected</h3>;

const AuthButton = withRouter(({ history }) =>
  window.localStorage.getItem('loggedIn') ? (
    <div className="Login_Signup">
      <Button
        onClick={() => {
          Auth.logout();
          history.push('/');
        }}
        className="Logout"
      >
        Logout
      </Button>
    </div>
  ) : (
    <div className="Login_Signup">
      <Button className="Login" onClick={() => history.push('/login')}>
        Login
      </Button>
      <Button
        className="Signup"
        variant="danger"
        onClick={() => history.push('/signup')}
      >
        Signup
      </Button>
    </div>
  )
);

const NavLinks = withRouter(() =>
  window.localStorage.getItem('loggedIn') ? (
    <Nav className="mr-auto ">
      <Nav.Link href="/">Home</Nav.Link>
      <Nav.Link href="/gallery">Gallery</Nav.Link>
      <Nav.Link href="/editor">Edit Profile</Nav.Link>
      <Nav.Link href={`/profile?email=${window.localStorage.getItem('loggedInEmail')}`}>My Profile</Nav.Link>
      <Nav.Link href={`/transaction?email=${window.localStorage.getItem('loggedInEmail')}`}>Transaction</Nav.Link>
    </Nav>
  ) : (
    <Nav className="mr-auto">
      <Nav.Link href="/">Home</Nav.Link>
      <Nav.Link href="/gallery">Gallery</Nav.Link>
    </Nav>
  )
);

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar bg="dark" variant="dark" sticky="top">
          <div className="App-logo-div">
            <Navbar.Brand>McGallery</Navbar.Brand>
          </div>

          <NavLinks className="sticky-top"/>
          <AuthButton />
        </Navbar>

        <Route path="/" exact={true} component={Home} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/gallery" component={Gallery} />
        <PrivateRoute path="/editor" component={Editor} />
        <Route path="/profile" component={Profile} />
        <PrivateRoute path="/transaction" component={Transaction} />
        <PrivateRoute path="/protected" component={Protected} />
      </div>

      {/* Footer */}
      <MDBFooter color="stylish-color-dark" className="font-small pt-4 mt-4">
        <MDBContainer fluid className="text-center text-md-left">
          <MDBRow>
            <MDBCol md="4">
              <h4 className="text-uppercase mb-4 mt-3 font-weight-bold">Abstract</h4>
              <p id="footer-abstract">
                This is an online platform for McGill members to upload, view, and potentially borrow, and purchase artworks, promoting student artists.
              </p>
            </MDBCol>
            <MDBCol md="4">
              <h4 className="text-uppercase mb-4 mt-3 font-weight-bold">Links</h4>
              <a href="https://github.com/ZikunLyu/McPhoto" className="mr-4">Backend Repo</a>
              <a href="https://github.com/MartiniChauchat/mcphoto">Frontend Repo</a>
            </MDBCol>
            <MDBCol md="4">
              <h4 className="text-uppercase mb-4 mt-3 font-weight-bold">Contact</h4>
              <div>
                <a href="mailto:katya.i.marc@mcgill.ca">Co-Supervisor: Katya Marc</a>
              </div>
              <div>
                <a href="mailto:ioannis.psaromiligkos@mcgill.ca">Co-Supervisor: Ioannis Psaromiligkos</a>
              </div>
              <div>
                <a href="mailto:zikun.lyu@mail.mcgill.ca">Team member: Zikun Lyu</a>
              </div>
              <div>
                <a href="mailto:wenhao.geng@mail.mcgill.ca">Team member: Wenhao Geng</a>
              </div>
              <div>
                <a href="mailto:yudi.xie@mail.mcgill.ca">Team member: Yudi Xie</a>
              </div>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
        <div className="footer-copyright text-center py-3 mt-4">
          <MDBContainer fluid>
            &copy; {new Date().getFullYear()} Copyright:{' '} 
            Made with ❤️ by Wenhao Geng, Yudi Xie, Zikun Lyu
          </MDBContainer>
        </div>
      </MDBFooter>
    </Router>
  );
}

export default App;
