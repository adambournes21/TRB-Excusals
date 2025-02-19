import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { listenToUsers } from '../firebase'; // Adjust the import path as needed
import EditUserModal from '../components/EditUserModal'; // Adjust the import path as needed
import { useModal } from '../ModalContext'; // Ensure this points to where your ModalContext is defined
import EditUsers from '../components/EditUsers'; // Adjust the import path as needed
import EditRanks from '../components/EditRanks'; // Adjust the import path as needed
import { Box, Button, Flex, Heading } from '@chakra-ui/react'; // Chakra components

function Admin() {
  const [users, setUsers] = useState([]);
  const [showEditUsers, setShowEditUsers] = useState(true); // Toggle between EditUsers and EditRanks
  const { showModal } = useModal();
  const history = useHistory();

  useEffect(() => {
    // Start listening to users collection
    const unsubscribe = listenToUsers((users) => {
      setUsers(users); // Update the state with the users from Firestore in real-time
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  const openEditUserModal = (userId) => {
    showModal(<EditUserModal userId={userId} />);
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
    width: "150px",
    fontSize: "16px",
  };

  const toggleButtonStyles = {
    ...buttonStyles,
    bg: "#FFCC00",
    _hover: {
      borderWidth: "2px",
      bg: "#FFC107"
    }
  };

  return (
    <Box padding="20px">
      {/* Back and Toggle buttons */}
      <Flex mb={4} ml={4}>
        <Button {...buttonStyles} onClick={() => history.goBack()}>
          Back
        </Button>
        <Button
          {...toggleButtonStyles}
          ml={4}
          onClick={() => setShowEditUsers(!showEditUsers)}
        >
          {showEditUsers ? 'Edit Ranks' : 'Edit Users'}
        </Button>
      </Flex>

      {/* Render the EditUsers or EditRanks components */}
      <Box>
        {showEditUsers ? (
          <EditUsers users={users} openEditUserModal={openEditUserModal} />
        ) : (
          <EditRanks />
        )}
      </Box>
    </Box>
  );
}

export default Admin;
