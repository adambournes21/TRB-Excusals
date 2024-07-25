import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchExcusalInformation, fullyAcceptExcusal } from '../firebase';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function ViewPage() {
  const history = useHistory();
  const { docId } = useParams();
  const [excusalInfo, setExcusalInfo] = useState(null);

  const { loggedInUsername } = useAuth();

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

  const handleFullAccept = () => {
    fullyAcceptExcusal(loggedInUsername, docId).then(() => history.goBack()); // Assuming rejectExcusal is async
  };

  return (
    <div>
      <button onClick={() => history.goBack()}>back</button>
      <h2>Review Page</h2>
      {excusalInfo ? (
        <div>
          <p><strong>Document ID:</strong> {docId}</p>
          <p><strong>Event:</strong> {excusalInfo.event}</p>
          <p><strong>Start Date:</strong> {excusalInfo.fromDate}</p>
          <p><strong>End Date:</strong> {excusalInfo.toDate}</p>
          <p><strong>Reason:</strong> {excusalInfo.reason}</p>
          <p><strong>Reason Details:</strong> {excusalInfo.reasonDetails}</p>
          <p><strong>Comments:</strong> {excusalInfo.comments}</p>
          <p><strong>Status:</strong> {excusalInfo.status}</p>
          <p><strong>Sent By:</strong> {excusalInfo.sentBy}</p>
          <p><strong>Sent On:</strong> {excusalInfo.dateSubmitted}</p>
          <div>
            <strong>Reviews:</strong>
            <ul>
              {excusalInfo.reviews && excusalInfo.reviews.map((review, index) => (
                <li key={index}>
                  Reviewer: {review.reviewer}, Review: {review.review}
                </li>
              ))}
            </ul>
          </div>

          {excusalInfo.status === 'submitted' && (
              <p><strong>Sent To:</strong> {excusalInfo.sentTo}</p>
          )}

          {loggedInUsername === 'mcclelland' && 
              <button onClick={handleFullAccept}>Accept All</button>
          }

          {excusalInfo.fileURL && (
            <div>
              <p><strong>Attached Document:</strong></p>
              <img
                src={excusalInfo.fileURL}
                alt="Attached Document"
                style={{
                  maxWidth: '800px',
                  maxHeight: '800px',
                  width: 'auto',
                  height: 'auto',
                  display: 'block', // Center the image in the div
                }}
              />
            </div>
          )}

        </div>
      ) : (
        <p>Loading excusal information...</p>
      )}
    </div>
  );
}

export default ViewPage;