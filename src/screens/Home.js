// HomePage component
import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import CreateExcusalForm from '../components/CreateExcusalForm';
import OwnExcusalList from '../components/OwnExcusalList';
import OtherExcusalList from '../components/OtherExcusalList';
import { useHistory } from 'react-router-dom';

function HomePage() {
    const history = useHistory();
    const { loggedInUsername, logout } = useAuth();
    const [currentComponent, setCurrentComponent] = useState(0);

    useEffect(() => {
        // Redirect to login if not logged in
        if (!loggedInUsername) {
            history.push('/login');
        }
    }, [loggedInUsername, history]);

    return (
        <div style={{ paddingLeft: '20px', paddingTop: '10px', fontSize: '20px' }}>
            <div style={{display: 'flex', flexDirection: 'row', height: 40, alignItems: 'center'}}>
                {loggedInUsername ? <p>{loggedInUsername} is logged in</p> : <p>User is not logged in</p>}
                <button style={{marginLeft: 20, height: '100%'}} onClick={logout}>Logout</button>
            </div>

            <button onClick={() => setCurrentComponent(0)}>Create Excusal</button>
            <button onClick={() => setCurrentComponent(1)}>Your Excusals</button>
            <button onClick={() => setCurrentComponent(2)}>Excusals You Need To Check</button>

            {(loggedInUsername === 'bournes' || loggedInUsername === 'haines' || 
            loggedInUsername === 'eadie' || loggedInUsername === 'gardner'
            || loggedInUsername === 'mcclelland') && (
                <div>
                    <button onClick={() => history.push('/all')}>See All Excusals</button>
                </div>
            )}

            {/* Conditionally render components */}
            {currentComponent === 0 ? <CreateExcusalForm /> :
             currentComponent === 1 ? <OwnExcusalList /> :
             <OtherExcusalList />}

        </div>
    );
}

export default HomePage;
