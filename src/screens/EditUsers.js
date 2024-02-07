import React, { useState, useEffect } from 'react';
import CreateUserModal from '../components/CreateUserModal'; // Adjust the import path as needed
import EditUserModal from '../components/EditUserModal'; // Adjust the import path as needed
import { useModal } from '../ModalContext'; // Ensure this points to where your ModalContext is defined
import { fetchUserNames } from '../FirebaseConfig'; // Adjust the import path as needed
import { useHistory } from 'react-router-dom';

function EditUsers() {
  const [users, setUsers] = useState([]);
  const { showModal } = useModal();
  const [selectedUserId, setSelectedUserId] = useState(null);
  
  const history = useHistory();

  useEffect(() => {
    fetchUserNames().then(users => {
        console.log("Fetched users:", users);
        setUsers(users);
    }).catch(error => {
        console.error("Error fetching users:", error);
    });
}, []);

    const openEditUserModal = (userId) => {
        showModal(<EditUserModal userId={userId} />); // Dynamically pass the userId to the modal
    };

    const handleOpenCreateUserModal = () => {
        showModal(<CreateUserModal />); // Pass the CreateUserModal as the content to showModal
    };

  return (
    <div style={{display: 'flex', flexDirection: 'column', }}>
      <button style={{width: '100px'}} onClick={() => history.goBack()}>back</button>

      <h2>Users List</h2>
      <ul>
        {users.map(user => (
          <li key={user.id} onClick={() => openEditUserModal(user.id)}>
            {user.id} {/* Dynamically setting the user ID for the modal */}
          </li>
        ))}
      </ul>
      <button style={{width: '100px'}} onClick={handleOpenCreateUserModal}>
        Create New User
      </button>
    </div>
  );
}

export default EditUsers;
