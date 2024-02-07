import React, { useState } from 'react';
import { createExcusalRequest } from '../FirebaseConfig';
import { useAuth } from '../AuthContext';

function CreateExcusalForm() {
    const { isLoggedIn, loggedInUsername } = useAuth();

    const [excusalName, setExcusalName] = useState('');
    const [event, setEvent] = useState('');
    const [date, setDate] = useState('');
    const [reason, setReason] = useState('');
    const [reasonDetails, setReasonDetails] = useState('');
    const [comments, setComments] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(loggedInUsername, excusalName, event, reason, reasonDetails, comments);
        createExcusalRequest(loggedInUsername, excusalName, event, date, reason, reasonDetails, comments);
    
        setExcusalName('');
        setEvent('');
        setDate('');
        setReason('');
        setReasonDetails('');
        setComments('');
    };

    return (
        <div>
            <h2>Create Excusal</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="event">Unique Excusal Name:</label>
                    <input 
                        type="text" 
                        id="excusalName" 
                        value={excusalName} 
                        onChange={(e) => setExcusalName(e.target.value)} 
                    />
                </div>
                <div>
                    <label htmlFor="event">Event to be Excused:</label>
                    <input 
                        type="text" 
                        id="event" 
                        value={event} 
                        onChange={(e) => setEvent(e.target.value)} 
                    />
                </div>

                <div>
                    <label htmlFor="date">Date:</label>
                    <input 
                        type="date" 
                        id="date" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                    />
                </div>

                <div>
                    <label>Reason for Excusal:</label>
                    <div>
                        <input 
                            type="radio" 
                            id="clinical" 
                            name="reason" 
                            value="Clinical" 
                            onChange={(e) => setReason(e.target.value)} 
                        />
                        <label htmlFor="clinical">Clinical</label>
                        {reason === 'Clinical' && (
                            <input 
                                type="text" 
                                placeholder="Enter details" 
                                value={reasonDetails} 
                                onChange={(e) => setReasonDetails(e.target.value)} 
                            />
                        )}
                    </div>
                    <div>
                        <input 
                            type="radio" 
                            id="school-obligation" 
                            name="reason" 
                            value="School Obligation" 
                            onChange={(e) => setReason(e.target.value)} 
                        />
                        <label htmlFor="school-obligation">School Obligation</label>
                        {reason === 'School Obligation' && (
                            <input 
                                type="text" 
                                placeholder="Enter details" 
                                value={reasonDetails} 
                                onChange={(e) => setReasonDetails(e.target.value)} 
                            />
                        )}
                    </div>
                    <div>
                        <input 
                            type="radio" 
                            id="other" 
                            name="reason" 
                            value="Other" 
                            onChange={(e) => setReason(e.target.value)} 
                        />
                        <label htmlFor="other">Other</label>
                        {reason === 'Other' && (
                            <input 
                                type="text" 
                                placeholder="Enter details" 
                                value={reasonDetails} 
                                onChange={(e) => setReasonDetails(e.target.value)} 
                            />
                        )}
                    </div>
                </div>

                <div>
                    <label htmlFor="comments">Comments:</label>
                    <textarea 
                        id="comments" 
                        value={comments} 
                        onChange={(e) => setComments(e.target.value)} 
                    />
                </div>

                <button type="submit">Submit Excusal</button>
            </form>
        </div>
    );
}

export default CreateExcusalForm;
