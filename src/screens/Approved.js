import React, { useState, useEffect } from 'react';
import { fetchApprovedExcusals } from '../FirebaseConfig'
import { useHistory } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function ApprovedScreen() {
    const [approvedExcusals, setApprovedExcusals] = useState([]);
    const history = useHistory();
    const { isLoggedIn, loggedInUsername, logout } = useAuth();

    useEffect(() => {
        fetchApprovedExcusals().then((res) => {
          console.log(res);
          setApprovedExcusals(res);
        });
    }, []);

    return (
        <div>
            <button onClick={() => history.goBack()}>back</button>
            <h2>Approved Excusals</h2>
            <div>
                {approvedExcusals.length > 0? (
                    <ul>
                        {approvedExcusals.map(excusal => (
                            <li key={excusal.id}>
                                <p><strong>Cadet:</strong> {excusal.username}</p>
                                <p><strong>Event:</strong> {excusal.event}</p>
                                <p><strong>Date:</strong> {excusal.date}</p>
                                <p><strong>Reason:</strong> {excusal.reason}</p>
                                <p><strong>Details:</strong> {excusal.reasonDetails}</p>
                                <p><strong>Comments:</strong> {excusal.comments}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No approved excusals found.</p>
                )}
            </div>
        </div>
    );
}

export default ApprovedScreen;
