import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchExcusalInformation, sendExcusalUp, rejectExcusal, fullyAcceptExcusal } from '../firebase';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Box, Button, Heading, Text, VStack, Image, HStack, Spinner } from '@chakra-ui/react'; // Chakra components

function ReviewPage() {
  const { docId } = useParams();
  const { loggedInUsername } = useAuth();
  const history = useHistory();
  const [excusalInfo, setExcusalInfo] = useState(null);

  const handleSendUp = () => {
    const isConfirmed = window.confirm("Are you sure you want to accept this excusal?");
    if (isConfirmed) {
      sendExcusalUp(loggedInUsername, docId).then(() => history.goBack());
    }
  };

  const handleReject = () => {
    const isConfirmed = window.confirm("Are you sure you want to reject this excusal?");
    if (isConfirmed) {
      rejectExcusal(loggedInUsername, docId).then(() => history.goBack());
    }
  };

  const handleFullAccept = () => {
    fullyAcceptExcusal(loggedInUsername, docId).then(() => history.goBack());
  };

  useEffect(() => {
    if (docId) {
      fetchExcusalInformation(docId)
        .then((data) => {
          setExcusalInfo(data);
        })
        .catch((error) => {
          console.error('Failed to fetch excusal information:', error);
        });
    }
  }, [docId]);

  const buttonStyles = {
    bg: "#EEEEEE",
    color: "black",
    border: "1px solid black",
    transition: "border 0.1s ease-in-out",
    _hover: {
      borderWidth: "2px",
      bg: "#DDDDDD",
    },
    width: "150px",
  };

  return (
    <Box padding="20px">
      <Button {...buttonStyles} onClick={() => history.goBack()} mb={4}>
        Back
      </Button>
      <Heading as="h2" size="lg" mb={6}>
        Review Page
      </Heading>

      {excusalInfo ? (
        <Box>
          <Text><strong>Document ID:</strong> {docId}</Text>
          <Text><strong>Event:</strong> {excusalInfo.event}</Text>
          <Text><strong>Start Date:</strong> {excusalInfo.fromDate}</Text>
          <Text><strong>End Date:</strong> {excusalInfo.toDate}</Text>
          <Text><strong>Reason:</strong> {excusalInfo.reason}</Text>
          <Text><strong>Reason Details:</strong> {excusalInfo.reasonDetails}</Text>
          <Text><strong>Comments:</strong> {excusalInfo.comments}</Text>
          <Text><strong>Status:</strong> {excusalInfo.status}</Text>
          <Text><strong>Sent By:</strong> {excusalInfo.sentBy}</Text>
          <Text><strong>Sent On:</strong> {excusalInfo.dateSubmitted}</Text>

          <VStack align="start" mt={4}>
            <Text><strong>Reviews:</strong></Text>
            <Box as="ul" pl={4}>
              {excusalInfo.reviews && excusalInfo.reviews.map((review, index) => (
                <Box as="li" key={index} mb={2}>
                  <Text>Reviewer: {review.reviewer}, Review: {review.review}</Text>
                </Box>
              ))}
            </Box>
          </VStack>

          <HStack spacing={3} mt={4}>
            <Button
              bg="#88EE88"
              color="black"
              border="1px solid black"
              transition="border 0.1s ease-in-out"
              _hover={{ borderWidth: '2px', bg: '#77DD77' }}
              onClick={handleSendUp}
            >
              Approve
            </Button>
            
            <Button
              bg="#FF6666"
              color="white"
              border="1px solid black"
              transition="border 0.1s ease-in-out"
              _hover={{ borderWidth: '2px', bg: '#EE5555' }}
              onClick={handleReject}
            >
              Reject
            </Button>
            
            {loggedInUsername === 'mcclelland' && (
              <Button
                bg="#88EE88"
                color="black"
                border="1px solid black"
                transition="border 0.1s ease-in-out"
                _hover={{ borderWidth: '2px', bg: '#77DD77' }}
                onClick={handleFullAccept}
              >
                Accept All
              </Button>
            )}
          </HStack>


          {excusalInfo.fileURL && (
            <Box mt={6}>
              <Text><strong>Attached Document:</strong></Text>
              <Image
                src={excusalInfo.fileURL}
                alt="Attached Document"
                maxW="800px"
                maxH="800px"
                display="block"
                margin="auto"
              />
            </Box>
          )}
        </Box>
      ) : (
        <Spinner size="xl" />
      )}
    </Box>
  );
}

export default ReviewPage;
