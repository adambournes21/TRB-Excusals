import React, { useState } from 'react';
import { useModal } from '../ModalContext'; // Adjust import path as needed
import { createUser } from '../FirebaseConfig'; // Import the createUser function

const CreateUserModal = () => {
  const { hideModal } = useModal();
  const [chainOfCommand, setChainOfCommand] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createUser({ chainOfCommand, username, password, otherExcusals: [], ownExcusals: [] });
    hideModal();
  };

  // Updated inline styles for the form to organize inputs in a column and align them to the left
  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start', // Align items to the left
    gap: '10px', // Adds space between form elements
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit} className="modal-content" style={formStyle}>
        <h2>Create New User</h2>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ marginRight: '10px' }}>Chain of Command:</span>
            <input
                type="text"
                placeholder="Chain of Command"
                value={chainOfCommand}
                onChange={(e) => setChainOfCommand(e.target.value)}
            />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ marginRight: '10px' }}>Username:</span>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ marginRight: '10px' }}>Password:</span>
            <input
                type="text"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
        </div>

        <button type="submit">Create User</button>
        <button style={{marginTop: '18px'}} onClick={hideModal}>Close</button>
      </form>
    </div>
  );
};

export default CreateUserModal;
