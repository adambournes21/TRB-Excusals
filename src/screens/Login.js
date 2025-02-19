import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { checkCredentials } from '../firebase';
import { useHistory } from 'react-router-dom';
import { Box, Button, FormControl, FormLabel, Input, Heading, VStack } from '@chakra-ui/react';

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
        login(username);
        history.push('/home');
      }
    });
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bg="#f5f5f5"
      p={6}
    >
      <Box bg="white" p={8} boxShadow="md" borderRadius="md" width="100%" maxWidth="400px">
        <Heading as="h2" size="lg" textAlign="center" mb={6}>
          Login Page
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl id="username">
              <FormLabel>Username:</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="Enter your username"
              />
            </FormControl>

            <FormControl id="password">
              <FormLabel>Password:</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
              />
            </FormControl>

            <Button type="submit" colorScheme="blue" width="100%">
              Log In
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
}

export default LoginPage;
