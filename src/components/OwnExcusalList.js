import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { fetchOwnExcusals, deleteExcusal } from '../firebase'; // Import the deleteExcusal function
import { useHistory } from 'react-router-dom';
import { Box, Button, Text, VStack, Heading, Flex } from '@chakra-ui/react';

function OwnExcusalList() {
    const history = useHistory();
    const { loggedInUsername } = useAuth();
    const [excusals, setExcusals] = useState([]);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [printMode, setPrintMode] = useState(false);

    const handleSeeMoreClick = (id) => {
        history.push('view/' + id);
    };

    useEffect(() => {
        if (loggedInUsername) {
            fetchOwnExcusals(loggedInUsername).then((res) => {
                setExcusals(res);
            });
        }
    }, [loggedInUsername]);

    const handleDeleteClick = async (id) => {
        if (window.confirm("Are you sure you want to delete this excusal?")) {
            await deleteExcusal(id); // Call the deleteExcusal function
            setExcusals(excusals.filter(excusal => excusal.id !== id)); // Remove the excusal locally after deletion
        }
    };

    const itemStyles = {
        cursor: 'pointer',
        border: '1px solid black',
        transition: 'border 0.1s ease-in-out, background-color 0.2s ease',
        borderRadius: '10px',
        padding: '15px',
        backgroundColor: 'white',
        _hover: {
            borderWidth: '2px',
            backgroundColor: '#f9f9f9',
        },
    };

    return (
        <Box maxWidth="800px" mx="auto" p={4} bg="white" borderRadius="md" boxShadow="md">
            <Heading as="h2" size="lg" mb={6}>
                Your Excusal List
            </Heading>
            <VStack spacing={4} align="stretch">
                {excusals.length > 0 ? (
                    excusals.map((excusal, index) => (
                        <Box
                            key={excusal.id}
                            {...itemStyles}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            border={hoveredIndex === index || printMode ? '2px solid black' : '1px solid black'}
                        >
                            {/* Flex container to align text and buttons in the same row */}
                            <Flex alignItems="center" justifyContent="space-between">
                                <Text>
                                    {excusal.id} on {excusal.date} (Reason: {excusal.reason}, Status: {excusal.status})
                                </Text>
                                <Flex>
                                    <Button
                                        size="sm"
                                        colorScheme="blue"
                                        onClick={() => handleSeeMoreClick(excusal.id)}
                                        mr={2}
                                    >
                                        See More
                                    </Button>
                                    <Button
                                        size="sm"
                                        colorScheme="red"
                                        variant="outline"
                                        border="1px solid red"
                                        _hover={{ bg: 'red.500', color: 'white' }}
                                        onClick={() => handleDeleteClick(excusal.id)}
                                    >
                                        Delete Excusal
                                    </Button>
                                </Flex>
                            </Flex>
                        </Box>
                    ))
                ) : (
                    <Text>No excusals found.</Text>
                )}
            </VStack>
        </Box>
    );
}

export default OwnExcusalList;
