import React from 'react';
import CreateUserModal from '../components/CreateUserModal'; // Adjust the import path as needed
import EditUserModal from './EditUserModal'; // Adjust the import path as needed
import { useModal } from '../ModalContext'; // Ensure this points to where your ModalContext is defined

function EditUsers({ users, openEditUserModal }) {
  const { showModal } = useModal();

  const handleOpenCreateUserModal = () => {
    showModal(<CreateUserModal />);
  };

  return (
    <div>
      <h2>Editable Users List</h2>
      <p>Click that users's button to edit their info</p>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {users.map(user => (
          <div key={user.id} style={{ flex: '1 0 21%', margin: '10px', textAlign: 'center' }}>
            <button 
              style={{ width: '100%', fontSize: '30px' }} 
              onClick={() => openEditUserModal(user.id)}
            >
              {user.id} {/* Dynamically setting the user ID for the modal */}
            </button>
          </div>
        ))}
      </div>
      <button style={{width: '100px'}} onClick={handleOpenCreateUserModal}>
        Create New User
      </button>
    </div>
  );
}

export default EditUsers;
