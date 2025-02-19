import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { ModalProvider } from './ModalContext';
import { ChakraProvider } from '@chakra-ui/react';

// Import your page components
import HomePage from './screens/Home';
import LoginPage from './screens/Login';
import AllPage from './screens/AllExcusals';
import ViewPage from './screens/View';
import ReviewPage from './screens/Review';
import AdminPage from './screens/Admin';

function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <ModalProvider>
        <Router>
          <div>
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route exact path="/home" component={HomePage} />
              <Route exact path="/login" component={LoginPage} />
              <Route exact path="/all" component={AllPage} />
              <Route exact path="/view/:docId" component={ViewPage} />
              <Route path="/review/:docId" component={ReviewPage} />
              <Route exact path="/admin" component={AdminPage} />
            </Switch>
          </div>
        </Router>
        </ModalProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
