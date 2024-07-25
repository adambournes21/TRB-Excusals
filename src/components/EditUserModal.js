import React, { useState, useEffect } from 'react';
import { useModal } from '../ModalContext'; // Adjust import path as needed
import { fetchUserInfo, editUserInfo, deleteUser } from '../firebase';

const EditUserModal = ({ userId }) => {
  const { hideModal } = useModal();
  const [company, setCompany] = useState('');
  const [platoon, setPlatoon] = useState('');
  const [squad, setSquad] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (userId) {
      fetchUserInfo(userId).then(userInfo => {
        setCompany(userInfo.company || '');
        setPlatoon(userInfo.platoon || '');
        setSquad(userInfo.squad || '');
        setUsername(userInfo.username || '');
        setPassword(userInfo.password || '');
        setEmail(userInfo.email || '');
      }).catch(error => console.error("Error fetching user info:", error));
    }
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await editUserInfo(userId, { company, platoon, squad, username, password, email });
    hideModal();
  };

  const handleDeleteUser = async () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser(userId);
      hideModal();
    }
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit} className="modal-content">
        <h2>Edit User</h2>

        {/* Dropdowns for Company, Platoon, and Squad */}
        <div>
          <label>Company:</label>
          <select value={company} onChange={(e) => setCompany(e.target.value)}>
            <option value="">Select Company</option>
            <option value="a">A</option>
          </select>
        </div>
        <div>
          <label>Platoon:</label>
          <select value={platoon} onChange={(e) => setPlatoon(e.target.value)}>
            <option value="">Select Platoon</option>
            <option value="1st">1st</option>
            <option value="2nd">2nd</option>
          </select>
        </div>
        <div>
          <label>Squad:</label>
          <select value={squad} onChange={(e) => setSquad(e.target.value)}>
            <option value="">Select Squad</option>
            <option value="1st">1st</option>
            <option value="2nd">2nd</option>
            <option value="3rd">3rd</option>
            <option value="4th">4th</option>
          </select>
        </div>

        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password" // Change type to password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email" // Specify input type as email for validation
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button type="submit">Set User Values</button>
        <button type="button" onClick={handleDeleteUser} style={{ color: 'red' }}>Delete User</button>
        <button onClick={hideModal}>Close</button>
      </form>
    </div>
  );
};

export default EditUserModal;
