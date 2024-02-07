import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { fetchOtherExcusals } from '../FirebaseConfig';
import { useHistory } from 'react-router-dom';

function OtherExcusalList() {
    const history = useHistory();
    const { isLoggedIn, loggedInUsername } = useAuth();
    const [excusals, setExcusals] = useState([]);

    const handleReviewClick = (id) => {
        history.push('/review/' + id);
    }

    useEffect(() => {
        if (loggedInUsername) {
            fetchOtherExcusals(loggedInUsername).then((res) => {
                setExcusals(res);
            })
        }
    }, [loggedInUsername]);

    return (
        <div>
            <h2>Excusal List</h2>
            <div style={{ listStyleType: 'none', padding: 0 }}>
                {excusals.map(excusal => (
                    <div key={excusal.id} style={{ margin: '10px 0' }}>
                        {excusal.id} on {excusal.date} (Reason: {excusal.reason})
                        <button onClick={() => handleReviewClick(excusal.id)} style={{ marginLeft: '10px' }}>
                            Review
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OtherExcusalList;
