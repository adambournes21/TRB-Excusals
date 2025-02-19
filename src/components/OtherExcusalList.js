import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { fetchOtherExcusals } from '../firebase';
import { useHistory } from 'react-router-dom';
import { Box, Button, Heading, VStack, Text, HStack } from '@chakra-ui/react';

function OtherExcusalList() {
    const history = useHistory();
    const { loggedInUsername } = useAuth();
    const [excusals, setExcusals] = useState([]);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [printMode, setPrintMode] = useState(false); // To manage print mode if needed

    const handleReviewClick = (id) => {
        history.push('/review/' + id);
    };

    useEffect(() => {
        if (loggedInUsername) {
            fetchOtherExcusals(loggedInUsername).then((res) => {
                setExcusals(res);
            });
        }
    }, [loggedInUsername]);

    const itemStyles = {
        padding: '10px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Shadow for card style
        transition: 'border 0.1s ease-in-out, box-shadow 0.1s ease-in-out',
        _hover: {
            boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)', // Enhanced shadow on hover
            borderColor: 'black',
        },
    };

    return (
        <Box maxWidth="800px" mx="auto" p={4} bg="white" borderRadius="md" boxShadow="md">
            <Heading as="h2" size="lg" mb={4}>
                Excusal List
            </Heading>

            <VStack spacing={4} align="stretch">
                {excusals.map((excusal, index) => (
                    <Box
                        key={excusal.id}
                        {...itemStyles}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        border={hoveredIndex === index || printMode ? '2px solid black' : '1px solid black'}
                        onClick={() => handleReviewClick(excusal.id)}
                    >
                        <HStack justify="space-between">
                            <Text>
                                {excusal.id} on {excusal.date} (Reason: {excusal.reason})
                            </Text>
                            <Button
                                size="sm"
                                colorScheme="blue"
                                onClick={() => handleReviewClick(excusal.id)}
                            >
                                Review
                            </Button>
                        </HStack>
                    </Box>
                ))}
            </VStack>
        </Box>
    );
}

export default OtherExcusalList;
