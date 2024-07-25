import React, { useState, useEffect } from 'react';
import { fetchUserRanks, editUserRanks, updateUserCocValues, updateExcusalSentToValues } from '../firebase'; // Adjust the import path as needed

function EditRank() {
    // Initial state for ranks
    const [showMessage, setShowMessage] = useState(false);
    const [ranks, setRanks] = useState({
        pms: '',
        cc: '',
        _1sgt: '',
        _1pl: '',
        _1psg: '',
        _1sl1: '',
        _1sl2: '',
        _1sl3: '',
        _1sl4: '',
        _2pl: '', 
        _2psg: '',
        _2sl1: '',
        _2sl2: '',
        _2sl3: '',
        _2sl4: '',
    });

    // The desired order of ranks
    const rankOrder = [
        'pms', 'cc', '_1sgt', '_1pl', '_1psg', '_1sl1', '_1sl2', '_1sl3', '_1sl4',
        '_2pl', '_2psg', '_2sl1', '_2sl2', '_2sl3', '_2sl4',
    ];

    useEffect(() => {
        const loadRanks = async () => {
            const fetchedRanks = await fetchUserRanks();
            if (fetchedRanks) {
                setRanks(fetchedRanks);
            }
        };
        loadRanks();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRanks((prevRanks) => ({
            ...prevRanks,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateExcusalSentToValues(ranks);
        await editUserRanks(ranks);
        await updateUserCocValues();
        // Optionally, handle any post-update logic here, such as showing a success message
        setShowMessage(true);
    };

    return (
        <div style={{ paddingLeft: '20px', fontSize: '20px' }}>
        <h2>Edit Ranks</h2>
        <form onSubmit={handleSubmit}>
            {rankOrder.map((rankKey) => (
            <div key={rankKey} style={{ marginBottom: '10px' }}>
                <label>
                {rankKey.replace('_', '')}: 
                <input 
                    type="text" 
                    name={rankKey} 
                    value={ranks[rankKey]} 
                    onChange={handleChange} 
                    style={{ fontSize: '18px', marginLeft: '10px' }} 
                />
                </label>
            </div>
            ))}
            <button type="submit" style={{ fontSize: '18px' }}>Update Ranks</button>
            {showMessage && <p style={{ fontSize: '18px' }}>Ranks have been updated!</p>}
        </form>
        </div>
    );
}

export default EditRank;
