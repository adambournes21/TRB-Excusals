import React, { useState } from 'react';
import { useModal } from '../ModalContext'; // Adjust import path as needed
import { createUser } from '../firebase'; // Import the createUser function
import { Box, Button, FormControl, FormLabel, Input, Select, VStack, Heading } from '@chakra-ui/react';

const CreateUserModal = () => {
  const { hideModal } = useModal();
  const [company, setCompany] = useState('');
  const [platoon, setPlatoon] = useState('');
  const [squad, setSquad] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [coc, setCoc] = useState(''); // New state for COC

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createUser({ company, platoon, squad, username, password, email, coc }); // Pass coc to createUser
    hideModal();
  };

  return (
    <Box
      bg="white"
      p={6}
      pb={0}
      pt={0}
    >
      <Heading as="h2" size="lg" mb={3}>
        Create New User
      </Heading>

      <form onSubmit={handleSubmit}>
        <VStack spacing={2} align="start">
          <FormControl id="company" isRequired>
            <FormLabel>Company</FormLabel>
            <Select
              placeholder="Select Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              bg="gray.100"
              borderColor="black"
              _hover={{ borderColor: 'gray.600' }}
            >
              <option value="a">A</option>
              <option value="b">B</option>
              <option value="c">C</option>
              <option value="d">D</option>
            </Select>
          </FormControl>

          <FormControl id="platoon" isRequired>
            <FormLabel>Platoon</FormLabel>
            <Select
              placeholder="Select Platoon"
              value={platoon}
              onChange={(e) => setPlatoon(e.target.value)}
              bg="gray.100"
              borderColor="black"
              _hover={{ borderColor: 'gray.600' }}
            >
              <option value="1st">1st</option>
              <option value="2nd">2nd</option>
            </Select>
          </FormControl>

          <FormControl id="squad" isRequired>
            <FormLabel>Squad</FormLabel>
            <Select
              placeholder="Select Squad"
              value={squad}
              onChange={(e) => setSquad(e.target.value)}
              bg="gray.100"
              borderColor="black"
              _hover={{ borderColor: 'gray.600' }}
            >
              <option value="1st">1st</option>
              <option value="2nd">2nd</option>
              <option value="3rd">3rd</option>
              <option value="4th">4th</option>
            </Select>
          </FormControl>

          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              bg="gray.100"
              borderColor="black"
              _hover={{ borderColor: 'gray.600' }}
            />
          </FormControl>

          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              bg="gray.100"
              borderColor="black"
              _hover={{ borderColor: 'gray.600' }}
            />
          </FormControl>

          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              bg="gray.100"
              borderColor="black"
              _hover={{ borderColor: 'gray.600' }}
            />
          </FormControl>

          <FormControl id="coc" isRequired>
            <FormLabel>Chain of Command (COC)</FormLabel>
            <Input
              type="text"
              placeholder="Enter COC"
              value={coc}
              onChange={(e) => setCoc(e.target.value)}
              bg="gray.100"
              borderColor="black"
              _hover={{ borderColor: 'gray.600' }}
            />
          </FormControl>

          <Button
            mt="2"
            type="submit"
            colorScheme="green"
            width="100%"
            _hover={{ bg: 'green.500' }}
          >
            Create User
          </Button>
          <Button
            onClick={hideModal}
            mt={2}
            colorScheme="red"
            width="100%"
            _hover={{ bg: 'red.500' }}
          >
            Close
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CreateUserModal;
