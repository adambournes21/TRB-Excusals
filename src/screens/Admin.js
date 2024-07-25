import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { fetchUserNames } from '../firebase'; // Adjust the import path as needed
import EditUserModal from '../components/EditUserModal'; // Adjust the import path as needed
import { useModal } from '../ModalContext'; // Ensure this points to where your ModalContext is defined
import EditUsers from '../components/EditUsers'; // Adjust the import path as needed
import EditRanks from '../components/EditRanks'; // Adjust the import path as needed
// import EditRanksComponent from './EditRanksComponent'; // Adjust the import path as needed

function Admin() {
  const [users, setUsers] = useState([]);
  const [showEditUsers, setShowEditUsers] = useState(true); // Toggle between EditUsers and EditRanks
  const { showModal } = useModal();
  const history = useHistory();

  useEffect(() => {
    fetchUserNames().then(users => {
      setUsers(users);
    }).catch(error => {
      console.error("Error fetching users:", error);
    });
  }, []);

  const openEditUserModal = (userId) => {
    showModal(<EditUserModal userId={userId} />);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <button style={{ width: '100px' }} onClick={() => history.goBack()}>back</button>
      {showEditUsers ? (
        <button style={{ width: '100px' }} onClick={() => setShowEditUsers(!showEditUsers)}>Edit Ranks</button>
      ) : (
        <button style={{ width: '100px' }} onClick={() => setShowEditUsers(!showEditUsers)}>Edit Users</button>
      )}
      
      {showEditUsers ? (
        <EditUsers users={users} openEditUserModal={openEditUserModal} />
      ) : (
        <EditRanks />
      )}
    </div>
  );
}

export default Admin;
