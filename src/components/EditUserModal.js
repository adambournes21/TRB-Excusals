import React, { useState, useEffect } from 'react';
import { useModal } from '../ModalContext'; // Adjust import path as needed
import { fetchUserInfo, editUserInfo, deleteUser } from '../firebase';
import { Box, Button, FormControl, FormLabel, Input, Select, VStack, Heading } from '@chakra-ui/react';

const EditUserModal = ({ userId }) => {
  const { hideModal } = useModal();
  const [company, setCompany] = useState('');
  const [platoon, setPlatoon] = useState('');
  const [squad, setSquad] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [coc, setCoc] = useState(''); // New state for coc

  useEffect(() => {
    if (userId) {
      fetchUserInfo(userId)
        .then(userInfo => {
          setCompany(userInfo.company || '');
          setPlatoon(userInfo.platoon || '');
          setSquad(userInfo.squad || '');
          setUsername(userInfo.username || '');
          setPassword(userInfo.password || '');
          setEmail(userInfo.email || '');
          setCoc(userInfo.coc || ''); // Set the coc value
        })
        .catch(error => console.error("Error fetching user info:", error));
    }
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Include coc in the user data
    await editUserInfo(userId, { company, platoon, squad, username, password, email, coc });
    hideModal();
  };

  const handleDeleteUser = async () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser(userId);
      hideModal();
    }
  };

  return (
    <Box
      bg="white"
      p={2}
      pl={6}
      pr={6}
    >
      <Heading as="h2" size="lg" mb={4}>
        Edit User
      </Heading>

      <form onSubmit={handleSubmit}>
        <VStack spacing={1} align="start">
          {/* Company */}
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

          {/* Platoon */}
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

          {/* Squad */}
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

          {/* Username */}
          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              bg="gray.100"
              borderColor="black"
              _hover={{ borderColor: 'gray.600' }}
              placeholder="Enter Username"
            />
          </FormControl>

          {/* Email */}
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              bg="gray.100"
              borderColor="black"
              _hover={{ borderColor: 'gray.600' }}
              placeholder="Enter Email"
            />
          </FormControl>

          {/* Password */}
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              bg="gray.100"
              borderColor="black"
              _hover={{ borderColor: 'gray.600' }}
              placeholder="Enter Password"
            />
          </FormControl>

          {/* COC */}
          <FormControl id="coc" isRequired>
            <FormLabel>COC</FormLabel>
            <Input
              type="text"
              value={coc}
              onChange={(e) => setCoc(e.target.value)}
              bg="gray.100"
              borderColor="black"
              _hover={{ borderColor: 'gray.600' }}
              placeholder="Enter Chain of Command (COC)"
            />
          </FormControl>

          {/* Buttons */}
          <Button
            mt="5"
            type="submit"
            colorScheme="green"
            width="100%"
            _hover={{ bg: 'green.500' }}
          >
            Set User Values
          </Button>

          <Button
            mt={2}
            colorScheme="red"
            width="100%"
            onClick={handleDeleteUser}
            _hover={{ bg: 'red.500' }}
          >
            Delete User
          </Button>

          <Button
            onClick={hideModal}
            mt={2}
            colorScheme="blue"
            width="100%"
            _hover={{ bg: 'blue.500' }}
          >
            Close
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default EditUserModal;
