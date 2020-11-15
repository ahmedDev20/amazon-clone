import React, { useState } from 'react';
import './Login.css';

import { Link, useHistory } from 'react-router-dom';
import { auth } from '../firebase';

function Login() {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = (e) => {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .then((auth) => {
        history.push('/');
      })
      .catch((e) => alert(e.message));
  };

  const register = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((auth) => {
        history.push('/');
      })
      .catch((e) => alert(e.message));
  };

  return (
    <div className="login">
      <Link to="/">
        <img className="login__logo" src="https://upload.wikimedia.org/wikipedia/commons/6/62/Amazon.com-Logo.svg" alt="amazon_logo" />
      </Link>

      <div className="login__container">
        <h1>Sign in</h1>
        <form action="">
          <h5>E-mail</h5>
          <input
            onChange={(e) => {
              setEmail(e.currentTarget.value);
            }}
            type="email"
            name=""
          />
          <h5>Password</h5>
          <input
            onChange={(e) => {
              setPassword(e.currentTarget.value);
            }}
            type="password"
            name=""
          />
          <button onClick={login} className="login__signInButton">
            Sign In
          </button>
        </form>

        <p>By continuing, you agree to Amazon's Conditions of Use and Privacy Notice.</p>
        <button onClick={register} className="login__registerButton">
          Create your Amazon Account
        </button>
      </div>
    </div>
  );
}

export default Login;
