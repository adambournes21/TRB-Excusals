import React, { useState } from 'react';
import { createExcusalRequest, uploadFile } from '../firebase';
import { useAuth } from '../AuthContext';

function CreateExcusalForm() {
    const { loggedInUsername } = useAuth();

    const [event, setEvent] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [reason, setReason] = useState('');
    const [reasonDetails, setReasonDetails] = useState('');
    const [comments, setComments] = useState('');
    const [file, setFile] = useState(null); // State to hold the uploaded file


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!event || !fromDate || !toDate || !reason) {
            window.alert("Please fill out all the fields!");
            return;
        }
        const isConfirmed = window.confirm("Are you sure you want to submit this excusal?");
        if (!isConfirmed) {
            // If not confirmed, exit the function early
            return;
        }
    
        // Function to format date into yyyy-mm-dd
        const formatDate = (date) => {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();
    
            if (month.length < 2) 
                month = '0' + month;
            if (day.length < 2) 
                day = '0' + day;
    
            return [year, month, day].join('-');
        };
    
        // Generate a unique excusal name
        const excusalName = `${loggedInUsername}-${event}-${fromDate}`;
        const todayDate = formatDate(new Date()); // Use the formatDate function to get today's date in yyyy-mm-dd format
    
        // Check if a file has been selected
        if (file) {
            const filePath = `excusals/${loggedInUsername}/${new Date().getTime()}-${file.name}`;
            try {
                // Upload the file and get the download URL
                const downloadURL = await uploadFile(file, filePath);
    
                // Now include the downloadURL in your excusal request data
                await createExcusalRequest(loggedInUsername, excusalName, event, fromDate, toDate, reason, reasonDetails, comments, downloadURL, todayDate);
            } catch (error) {
                console.error("Error processing the excusal form:", error);
            }
        } else {
            // Handle the case where no file is selected, maybe set an error message
            await createExcusalRequest(loggedInUsername, excusalName, event, fromDate, toDate, reason, reasonDetails, comments, '', todayDate);
        }
    
        // Reset form fields here
        setEvent('');
        setFromDate('');
        setToDate('');
        setReason('');
        setReasonDetails('');
        setComments('');
        setFile(null);
    };
    


    const handleFileChange = (e) => {
        setFile(e.target.files[0]); // Set the file to the first file if multiple files are selected
    };

    return (
        <div>
            <h2>Create Excusal</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '40vw' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label htmlFor="event">Event to be Excused:</label>
                    <input 
                        type="text" 
                        id="event" 
                        value={event} 
                        onChange={(e) => setEvent(e.target.value)} 
                    />
                </div>
    
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label htmlFor="fromDate">Date From:</label>
                    <input 
                        type="date" 
                        id="fromDate" 
                        value={fromDate} 
                        onChange={(e) => setFromDate(e.target.value)} 
                    />
                </div>
    
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label htmlFor="toDate">Date To:</label>
                    <input 
                        type="date" 
                        id="toDate" 
                        value={toDate} 
                        onChange={(e) => setToDate(e.target.value)} 
                    />
                </div>
    
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
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
    
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label htmlFor="comments" style={{ alignSelf: 'flex-start' }}>Comments:</label>
                    <textarea 
                        id="comments" 
                        value={comments} 
                        onChange={(e) => setComments(e.target.value)} 
                        style={{ width: '100%', height: '100px' }}
                    />
                </div>
    
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label htmlFor="fileUpload">Upload File (PDF, JPG, JPEG, or PNG only):</label>
                    <input 
                        type="file" 
                        id="fileUpload" 
                        accept="application/pdf,image/png,image/jpeg,image/jpg" 
                        onChange={handleFileChange} 
                    />
                </div>
    
                <button style={{width: 130, height: 40}} type="submit">Submit Excusal</button>
            </form>
        </div>
    );    
}

export default CreateExcusalForm;
