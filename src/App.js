import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { ModalProvider } from './ModalContext';

// Import your page components
import HomePage from './screens/Home';
import LoginPage from './screens/Login';
import ApprovedPage from './screens/Approved';
import ViewPage from './screens/View';
import ReviewPage from './screens/Review';
import EditUsersPage from './screens/EditUsers';

function App() {
  return (
    <AuthProvider>
      <ModalProvider>
      <Router>
        <div>
          <Switch>
            <Route exact path="/" component={LoginPage} />
            <Route exact path="/home" component={HomePage} />
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/approved" component={ApprovedPage} />
            <Route exact path="/view/:docId" component={ViewPage} />
            <Route path="/review/:docId" component={ReviewPage} />
            <Route exact path="/edit-users" component={EditUsersPage} />
          </Switch>
        </div>
      </Router>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
