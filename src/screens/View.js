import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchExcusalInformation } from '../FirebaseConfig';
import { useHistory } from 'react-router-dom';

function ViewPage() {
  const history = useHistory();
  const { docId } = useParams();
  const [excusalInfo, setExcusalInfo] = useState(null);

  useEffect(() => {
    if (docId) {
      fetchExcusalInformation(docId)
        .then(data => {
          setExcusalInfo(data);
        })
        .catch(error => {
          console.error('Error fetching excusal information:', error);
          // Handle the error appropriately
        });
    }
  }, [docId]);

  return (
    <div>
      <button onClick={() => history.goBack()}>back</button>
      <h2>Review Page</h2>
      {excusalInfo ? (
        <div>
          <p><strong>Document ID:</strong> {docId}</p>
          <p><strong>Event:</strong> {excusalInfo.event}</p>
          <p><strong>Date:</strong> {excusalInfo.date}</p>
          <p><strong>Reason:</strong> {excusalInfo.reason}</p>
          <p><strong>Reason Details:</strong> {excusalInfo.reasonDetails}</p>
          <p><strong>Comments:</strong> {excusalInfo.comments}</p>
          <p><strong>Status:</strong> {excusalInfo.status}</p>
          <p><strong>Username:</strong> {excusalInfo.username}</p>
        </div>
      ) : (
        <p>Loading excusal information...</p>
      )}
    </div>
  );
}

export default ViewPage;