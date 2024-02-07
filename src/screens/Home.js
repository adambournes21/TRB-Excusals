import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import CreateExcusalForm from '../components/CreateExcusalForm';
import OwnExcusalList from '../components/OwnExcusalList';
import OtherExcusalList from '../components/OtherExcusalList';
import { useHistory } from 'react-router-dom';

function HomePage() {
    const history = useHistory();

    const { isLoggedIn, loggedInUsername, logout } = useAuth();
    const [currentComponent, setCurrentComponent] = useState(0);

    useEffect(() => {
        if (!loggedInUsername) {
            history.push('/login');
        }
    }, [loggedInUsername]);

    return (
      <div>

        <div style={{display: 'flex', flexDirection: 'row', height: 40}}>
            {isLoggedIn ? <p>{loggedInUsername} is logged in</p> : <p>User is not logged in</p>}
            <button onClick={() => logout()}>
                logout
            </button>
        </div>

        <button onClick={() => setCurrentComponent(0)}>
            Create Excusal
        </button>
        <button onClick={() => setCurrentComponent(1)}>
            Your Excusals
        </button>
        <button onClick={() => setCurrentComponent(2)}>
            Excusals You Need To Check
        </button>
        {
            loggedInUsername === 'lucas' && 
            <button onClick={() => history.push('/approved')}>
                See Approved Excusals
            </button>
        }


        {/* Conditionally render components based on createExcusal */}
        {currentComponent === 0 ? <CreateExcusalForm /> :
        currentComponent === 1 ? <OwnExcusalList /> :
        <OtherExcusalList />}
      </div>
    );
}

export default HomePage;
