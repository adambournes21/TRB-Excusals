import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { fetchOwnExcusals } from '../FirebaseConfig';
import { useHistory } from 'react-router-dom';

function OwnExcusalList() {
    const history = useHistory();
    const { isLoggedIn, loggedInUsername } = useAuth();
    const [excusals, setExcusals] = useState([]);

    const handleSeeMoreClick = (id) => {
        history.push('view/' + id);
    }

    useEffect(() => {
        if (loggedInUsername) {
            fetchOwnExcusals(loggedInUsername).then((res) => {
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
                        {excusal.id} on {excusal.date} (Reason: {excusal.reason}, Status: {excusal.status})
                        <button onClick={() => handleSeeMoreClick(excusal.id)} style={{ marginLeft: '10px' }}>
                            See More
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OwnExcusalList;
