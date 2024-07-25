import React, { useState } from 'react';
import { useModal } from '../ModalContext'; // Adjust import path as needed
import { createUser } from '../firebase'; // Import the createUser function

const CreateUserModal = () => {
  const { hideModal } = useModal();
  const [company, setCompany] = useState('');
  const [platoon, setPlatoon] = useState('');
  const [squad, setSquad] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createUser({ company, platoon, squad, username, password, email });
    hideModal();
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '10px',
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit} className="modal-content" style={formStyle}>
        <h2>Create New User</h2>

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
            <span style={{ marginRight: '10px' }}>Email:</span> {/* Add Email Label */}
            <input
                type="email" // Use email input type for validation
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ marginRight: '10px' }}>Password:</span>
            <input
                type="password" // Change type to password for hiding text
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
