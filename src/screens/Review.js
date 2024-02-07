import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchExcusalInformation, sendExcusalUp, approveExcusal, rejectExcusal } from '../FirebaseConfig'; // Adjust the import path as needed
import { useHistory } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function ReviewPage() {
  const { docId } = useParams();
  const { isLoggedIn, loggedInUsername, login } = useAuth();
  const history = useHistory();

  const [excusalInfo, setExcusalInfo] = useState(null);

  const handleSendUp = () => {
    sendExcusalUp(loggedInUsername, docId)
    // Add logic to handle "Send Up" action
  };

  const handleApprove = () => {
    approveExcusal(loggedInUsername, docId)
    // Add logic to handle "Send Up" action
  };

  const handleReject = () => {
    rejectExcusal(loggedInUsername, docId)
    // Add logic to handle "Reject" action
  };

  useEffect(() => {
    fetchExcusalInformation(docId)
      .then(data => {
        setExcusalInfo(data);
      })
      .catch(error => {
        console.error('Failed to fetch excusal information:', error);
        // Handle the error appropriately
      });
  }, [docId]);

  return (
    <div>
      <button onClick={() => history.goBack()}>back</button>
      <h2>Review Page</h2>
      <p>Reviewing document: {docId}</p>
      {excusalInfo ? (
        <div>
          <p><strong>Event:</strong> {excusalInfo.event}</p>
          <p><strong>Date:</strong> {excusalInfo.date}</p>
          <p><strong>Reason:</strong> {excusalInfo.reason}</p>
          <p><strong>Details:</strong> {excusalInfo.reasonDetails}</p>
          <p><strong>Comments:</strong> {excusalInfo.comments}</p>
          <p><strong>Status:</strong> {excusalInfo.status}</p>
            {loggedInUsername === 'lucas' ? 
            <button onClick={handleApprove}>
                accept excusal
            </button>
            : 
            <button onClick={handleSendUp}>
                send excusal up
            </button>}
          <button onClick={handleReject}>Reject</button>
        </div>
      ) : (
        <p>Loading excusal information...</p>
      )}
    </div>
  );
}

export default ReviewPage;
