import React, { useState } from 'react';
import CreateUserModal from '../components/CreateUserModal'; // Adjust the import path as needed
import { useModal } from '../ModalContext'; // Ensure this points to where your ModalContext is defined
import { Box, Button, Heading, VStack, Select, Divider } from '@chakra-ui/react'; // Import Chakra components

function EditUsers({ users, openEditUserModal }) {
  const { showModal } = useModal();
  const [selectedCompany, setSelectedCompany] = useState('a'); // Company selection state

  const handleOpenCreateUserModal = () => {
    showModal(<CreateUserModal />);
  };

  const handleCompanyChange = (e) => {
    setSelectedCompany(e.target.value); // Ensure company selection is uppercase
  };

  const buttonStyles = {
    bg: "#EEEEEE",
    color: "black",
    border: "1px solid black",
    transition: "border 0.1s ease-in-out",
    _hover: {
      borderWidth: "2px",
      bg: "#DDDDDD"
    },
    width: '100%',
    fontSize: '20px',
  };

  // Filter, sort users by platoon and squad, and only show users from the selected company
  const sortedUsers = users
    .filter((user) => user.company === selectedCompany) // Filter by selected company
    .reduce((acc, user) => {
      const { platoon, squad } = user;

      if (!acc[platoon]) {
        acc[platoon] = {}; // Create a new platoon if it doesn't exist
      }

      if (!acc[platoon][squad]) {
        acc[platoon][squad] = []; // Create a new squad within the platoon
      }

      acc[platoon][squad].push(user); // Add user to the squad

      return acc;
    }, {});

  // Sort platoons and squads in correct order
  const platoonOrder = ['1st', '2nd'];
  const squadOrder = ['1st', '2nd', '3rd', '4th'];

  return (
    <Box padding="20px" paddingTop="0px">
      <Heading as="h2" size="lg" mb={4}>
        Editable Users List
      </Heading>

      {/* Company Selection Dropdown */}
      <Select
        value={selectedCompany}
        onChange={handleCompanyChange}
        width="200px"
        mb={2}
        bg="#EEEEEE"
      >
        <option value="a">Company A</option>
        <option value="b">Company B</option>
        <option value="c">Company C</option>
        <option value="d">Company D</option>
      </Select>

      <p>Click the user's button to edit their info</p>
      <Button
        onClick={handleOpenCreateUserModal}
        {...buttonStyles}
        mt={2}
        width="200px"
        bg="#88EE88"
      >
        Create New User
      </Button>

      {/* Map platoons and squads in sorted order */}
      {platoonOrder.map((platoon) => (
        sortedUsers[platoon] && (
          <Box key={platoon} mb={6}>
            <Heading as="h3" size="xl" mb={3} mt={3}>
              {platoon} Platoon
            </Heading>
            <Divider borderColor="black" borderWidth="2px" my={4} />
            {squadOrder.map((squad) => (
              sortedUsers[platoon][squad] && (
                <Box key={squad} mb={4}>
                  <Heading as="h4" size="lg" mb={2}>
                    {squad} Squad
                  </Heading>
                  <VStack spacing={3} align="start">
                    {sortedUsers[platoon][squad].map((user) => (
                      <Button
                        key={user.id}
                        {...buttonStyles}
                        onClick={() => openEditUserModal(user.id)}
                        width="200px" // Set the width for each button
                        justifyContent="flex-start" // Align the text to the left
                      >
                        {user.username}
                      </Button>
                    ))}
                  </VStack>
                </Box>
              )
            ))}
          </Box>
        )
      ))}
    </Box>
  );
}

export default EditUsers;
