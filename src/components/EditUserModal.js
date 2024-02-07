import React, { useState, useEffect } from 'react';
import { useModal } from '../ModalContext'; // Adjust import path as needed
import { fetchUserInfo, editUserInfo, deleteUser } from '../FirebaseConfig'; // Make sure deleteUser is imported

const EditUserModal = ({ userId }) => {
  const { hideModal } = useModal();
  const [chainOfCommand, setChainOfCommand] = useState('');
  const [originalUsername, setOriginalUsername] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await editUserInfo(userId, { coc: chainOfCommand, username, password });
    hideModal();
  };

  useEffect(() => {
    if (userId) {
      fetchUserInfo(userId).then(userInfo => {
        setChainOfCommand(userInfo.coc || '');
        setUsername(userInfo.username || '');
        setPassword(userInfo.password || ''); // Consider security implications
      }).catch(error => console.error(error));
    }
  }, [userId]);

  // Updated inline styles for the form to organize inputs in a column and align them to the left
  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start', // Align items to the left
    gap: '10px', // Adds space between form elements
  };

  const handleDeleteUser = async () => {
    const isConfirmed = window.confirm("Are you sure you want to delete this user?");
    if (isConfirmed) {
      await deleteUser(userId);
      hideModal(); // Close the modal after deletion
    }
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit} className="modal-content" style={formStyle}>
        <h2>Edit User {originalUsername}</h2>
        
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

        <button type="submit" style={{marginTop: '15px'}}>Set User Values</button>
        <button type="button" onClick={handleDeleteUser} style={{marginTop: '10px', color: 'red'}}>Delete User</button>
        <button style={{marginTop: '10px'}} onClick={hideModal}>Close</button>
      </form>
    </div>
  );
};

export default EditUserModal;
