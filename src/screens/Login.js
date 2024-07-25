import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { checkCredentials } from '../firebase';
import { useHistory } from 'react-router-dom';


function LoginPage() {
  const { loggedInUsername, login } = useAuth();
  const history = useHistory();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (loggedInUsername) {
      history.push('/home');
    }
  }, [loggedInUsername, history]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    checkCredentials(username, password).then((res) => {
      if (res) {
        login(username)
        history.push('/home');
      }
    })
  };

  return (
    <div>
      <h2>Login Page</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default LoginPage;
