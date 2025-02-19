import React, { useState, useEffect } from 'react';
import { 
  fetchUserRanks, 
  editUserRanks, 
  updateUserCocValues, 
  updateExcusalSentToValues 
} from '../firebase'; // Adjust the import path as needed
import { Box, Button, Select, FormLabel, Input, VStack, Heading, Text } from '@chakra-ui/react';

function EditRank() {
  const [showMessage, setShowMessage] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('a'); // Default to Company A
  const [ranks, setRanks] = useState({
    pms: '',
    cc: '',
    _1sgt: '',
    _1pl: '',
    _1psg: '',
    _1sl1: '',
    _1sl2: '',
    _1sl3: '',
    _1sl4: '',
    _2pl: '', 
    _2psg: '',
    _2sl1: '',
    _2sl2: '',
    _2sl3: '',
    _2sl4: '',
  });

  const rankOrder = [
    'pms', 'cc', '_1sgt', '_1pl', '_1psg', '_1sl1', '_1sl2', '_1sl3', '_1sl4',
    '_2pl', '_2psg', '_2sl1', '_2sl2', '_2sl3', '_2sl4',
  ];

  // Fetch the ranks for the selected company whenever the company changes
  useEffect(() => {
    const loadRanks = async () => {
      const fetchedRanks = await fetchUserRanks(selectedCompany); // Fetch the ranks for the selected company
      if (fetchedRanks && fetchedRanks["pms"]) {
        setRanks(fetchedRanks); // Set ranks for the selected company
      } else {
        // If no ranks found, reset ranks
        setRanks({
          pms: '',
          cc: '',
          _1sgt: '',
          _1pl: '',
          _1psg: '',
          _1sl1: '',
          _1sl2: '',
          _1sl3: '',
          _1sl4: '',
          _2pl: '', 
          _2psg: '',
          _2sl1: '',
          _2sl2: '',
          _2sl3: '',
          _2sl4: '',
        });
      }
    };
    loadRanks();
  }, [selectedCompany]); // Re-fetch ranks whenever selectedCompany changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRanks((prevRanks) => ({
      ...prevRanks,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateExcusalSentToValues(ranks, selectedCompany); // Pass selected company
      await editUserRanks(selectedCompany, ranks); // Ensure selectedCompany is passed first
      await updateUserCocValues(selectedCompany); // Pass selected company
      setShowMessage(true);
    } catch (error) {
      console.error("Error updating ranks:", error);
    }
  };  

  const handleCompanyChange = (e) => {
    setSelectedCompany(e.target.value); // Update selected company
    setShowMessage(false); // Reset the message when company is changed
  };

  const buttonStyles = {
    bg: "#88EE88",
    color: "black",
    border: "1px solid black",
    transition: "border 0.1s ease-in-out",
    _hover: {
      borderWidth: "2px",
      bg: "#77DD77"
    }
  };

  return (
    <Box padding="20px" fontSize="20px">
      <Heading as="h2" size="lg" mb={4}>
        Edit Ranks
      </Heading>

      {/* Company selection */}
      <FormLabel htmlFor="company" fontSize="18px">Select Company</FormLabel>
      <Select
        id="company"
        value={selectedCompany}
        onChange={handleCompanyChange}
        width="200px"
        mb={6}
        bg="#EEEEEE"
        border="1px solid black"
        _hover={{ borderWidth: '2px' }}
      >
        <option value="a">Company A</option>
        <option value="b">Company B</option>
        <option value="c">Company C</option>
        <option value="d">Company D</option>
      </Select>

      {/* Form to edit ranks */}
      <form onSubmit={handleSubmit}>
        <VStack spacing={1} align="start">
          {rankOrder.map((rankKey) => (
            <Box key={rankKey} width="100%">
              <FormLabel fontSize="18px">
                {rankKey.replace('_', '')}:
              </FormLabel>
              <Input
                type="text"
                name={rankKey}
                value={ranks[rankKey]}
                onChange={handleChange}
                fontSize="18px"
                bg="#F9F9F9"
                border="1px solid black"
                _hover={{ borderWidth: '2px' }}
                width="300px"
              />
            </Box>
          ))}
        </VStack>
        <Button {...buttonStyles} type="submit" mt={4}>
          Update Ranks
        </Button>
        {showMessage && (
          <Text fontSize="18px" color="green.600" mt={3}>
            Ranks for Company {selectedCompany} have been updated!
          </Text>
        )}
      </form>
    </Box>
  );
}

export default EditRank;
