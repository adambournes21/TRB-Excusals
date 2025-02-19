import React, { useState } from 'react';
import Confetti from 'react-confetti';  // Import Confetti component
import { createExcusalRequest, uploadFile } from '../firebase';
import { useAuth } from '../AuthContext';
import {
    Button, Input, Box, Textarea, Radio, RadioGroup, Stack, FormControl, FormLabel, Heading,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton
} from '@chakra-ui/react';

function CreateExcusalForm() {
    const { loggedInUsername } = useAuth();

    const [event, setEvent] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [reason, setReason] = useState('');
    const [reasonDetails, setReasonDetails] = useState('');
    const [comments, setComments] = useState('');
    const [file, setFile] = useState(null); // State to hold the uploaded file

    const [showConfetti, setShowConfetti] = useState(false); // State for confetti
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!event || !fromDate || !toDate || !reason) {
            window.alert("Please fill out all the fields!");
            return;
        }
        const isConfirmed = window.confirm("Are you sure you want to submit this excusal?");
        if (!isConfirmed) return; // If not confirmed, exit the function early

        const excusalName = `${loggedInUsername}-${event}-${fromDate}`;
        const todayDate = new Date().toISOString().split('T')[0]; // Format date as yyyy-mm-dd

        try {
            let downloadURL = '';
            if (file) {
                const filePath = `excusals/${loggedInUsername}/${new Date().getTime()}-${file.name}`;
                downloadURL = await uploadFile(file, filePath);
            }

            await createExcusalRequest(
                loggedInUsername, excusalName, event, fromDate, toDate, reason, reasonDetails, comments, downloadURL, todayDate
            );

            // Reset form fields
            setEvent('');
            setFromDate('');
            setToDate('');
            setReason('');
            setReasonDetails('');
            setComments('');
            setFile(null);

            // Show confetti and modal
            setShowConfetti(true);
            setIsModalOpen(true);

            // Stop confetti after 5 seconds
            setTimeout(() => setShowConfetti(false), 5000);

        } catch (error) {
            console.error("Error processing the excusal form:", error);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]); // Set the file to the first file if multiple files are selected
    };

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

    return (
        <>
            {showConfetti && <Confetti />}

            <Box maxWidth="600px" mx="auto" p="4" borderRadius="md" boxShadow="md" bg="white">
                <Heading as="h2" size="lg" mb="6" textAlign="center">Create Excusal</Heading>
                <form onSubmit={handleSubmit}>
                    {/* Event */}
                    <FormControl id="event" mb="4">
                        <FormLabel>Event to be Excused:</FormLabel>
                        <Input
                            type="text"
                            value={event}
                            onChange={(e) => setEvent(e.target.value)}
                            border="1px solid black"
                        />
                    </FormControl>

                    {/* From Date */}
                    <FormControl id="fromDate" mb="4">
                        <FormLabel>Date From:</FormLabel>
                        <Input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            border="1px solid black"
                        />
                    </FormControl>

                    {/* To Date */}
                    <FormControl id="toDate" mb="4">
                        <FormLabel>Date To:</FormLabel>
                        <Input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            border="1px solid black"
                        />
                    </FormControl>

                    {/* Reason */}
                    <FormControl as="fieldset" mb="4">
                        <FormLabel as="legend">Reason for Excusal:</FormLabel>
                        <RadioGroup onChange={setReason} value={reason}>
                            <Stack direction="column">
                                <Radio value="Clinical">Clinical</Radio>
                                {reason === 'Clinical' && (
                                    <Input
                                        type="text"
                                        placeholder="Enter details"
                                        value={reasonDetails}
                                        onChange={(e) => setReasonDetails(e.target.value)}
                                        border="1px solid black"
                                        mt="2"
                                    />
                                )}

                                <Radio value="School Obligation">School Obligation</Radio>
                                {reason === 'School Obligation' && (
                                    <Input
                                        type="text"
                                        placeholder="Enter details"
                                        value={reasonDetails}
                                        onChange={(e) => setReasonDetails(e.target.value)}
                                        border="1px solid black"
                                        mt="2"
                                    />
                                )}

                                <Radio value="Other">Other</Radio>
                                {reason === 'Other' && (
                                    <Input
                                        type="text"
                                        placeholder="Enter details"
                                        value={reasonDetails}
                                        onChange={(e) => setReasonDetails(e.target.value)}
                                        border="1px solid black"
                                        mt="2"
                                    />
                                )}
                            </Stack>
                        </RadioGroup>
                    </FormControl>

                    {/* Comments */}
                    <FormControl id="comments" mb="4">
                        <FormLabel>Comments:</FormLabel>
                        <Textarea
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            border="1px solid black"
                        />
                    </FormControl>

                    {/* File Upload */}
                    <FormControl id="fileUpload" mb="4">
                        <FormLabel>Upload File (PDF, JPG, JPEG, or PNG only):</FormLabel>
                        <Input
                            type="file"
                            accept="application/pdf,image/png,image/jpeg,image/jpg"
                            onChange={handleFileChange}
                            border="0px solid black"
                        />
                    </FormControl>

                    {/* Submit Button */}
                    <Button {...buttonStyles} type="submit" width="full">
                        Submit Excusal
                    </Button>
                </form>
            </Box>

            {/* Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Success</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Excusal successfully submitted!
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={() => setIsModalOpen(false)}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default CreateExcusalForm;
