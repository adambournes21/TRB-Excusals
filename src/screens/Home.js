import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { Button, Box, Text, Flex, Spacer, HStack } from '@chakra-ui/react'; // Import Chakra components
import CreateExcusalForm from '../components/CreateExcusalForm';
import OwnExcusalList from '../components/OwnExcusalList';
import OtherExcusalList from '../components/OtherExcusalList';
import { useHistory } from 'react-router-dom';

function HomePage() {
    const history = useHistory();
    const { loggedInUsername, logout } = useAuth();
    const [currentComponent, setCurrentComponent] = useState(0);

    useEffect(() => {
        // Redirect to login if not logged in
        if (!loggedInUsername) {
            history.push('/login');
        }
    }, [loggedInUsername, history]);

    const buttonStyles = {
        bg: "#EEEEEE",
        color: "black",
        border: "1px solid black",
        transition: "border 0.1s ease-in-out",
        _hover: {
            borderWidth: "2px",
            bg: "#DDDDDD"
        }
    };

    const logoutButtonStyles = {
        bg: "#FF6666",
        color: "white",
        border: "1px solid black",
        transition: "border 0.1s ease-in-out",
        _hover: {
            borderWidth: '2px',
            bg: "#EE5555"
        }
    };

    return (
        <Box padding="20px" fontSize="20px">
            <Flex alignItems="center" mb={3}>
                {/* Button row for main actions */}
                <HStack spacing={3}> {/* Reduced spacing to 10px */}
                    <Button {...buttonStyles} onClick={() => setCurrentComponent(0)}>
                        Create Excusal
                    </Button>
                    <Button {...buttonStyles} onClick={() => setCurrentComponent(1)}>
                        Your Excusals
                    </Button>
                    <Button {...buttonStyles} onClick={() => setCurrentComponent(2)}>
                        Excusals You Need To Check
                    </Button>
                </HStack>
                <Spacer /> {/* Spacer pushes the logout button to the right */}
                <Text mr={2}>{loggedInUsername ? `${loggedInUsername} is logged in` : 'User is not logged in'}</Text>
                <Button {...logoutButtonStyles} onClick={logout}>
                    Logout
                </Button>
            </Flex>

            {/* Optional buttons for admin users */}
            {(loggedInUsername === 'bournes' || 
              loggedInUsername === 'ohanlon' || 
              loggedInUsername === 'parikh' || 
              loggedInUsername === 'lattie' || 
              loggedInUsername === 'detling' || 
              loggedInUsername === 'maruscak' || 
              loggedInUsername === 'kish' || 
              loggedInUsername === 'sims' || 
              loggedInUsername === 'mcclelland') && (
                <HStack spacing={3} mb={4}> {/* Reduced spacing to 10px */}
                    <Button {...buttonStyles} onClick={() => history.push('/all')}>
                        See All Excusals
                    </Button>
                    <Button {...buttonStyles} onClick={() => history.push('/admin')}>
                        Admin Page
                    </Button>
                </HStack>
            )}

            {/* Conditionally render components */}
            {currentComponent === 0 ? (
                <CreateExcusalForm />
            ) : currentComponent === 1 ? (
                <OwnExcusalList />
            ) : (
                <OtherExcusalList />
            )}
        </Box>
    );
}

export default HomePage;
