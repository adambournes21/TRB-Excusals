import React, { useState, useEffect } from 'react';
import { fetchAllExcusals } from '../firebase';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

function AllExcusalsScreen() {
    const [allExcusals, setAllExcusals] = useState([]);
    const [statusFilter, setStatusFilter] = useState(localStorage.getItem('statusFilter') || '');
    const [dateFromFilter, setDateFromFilter] = useState(localStorage.getItem('dateFromFilter') || '');
    const [dateToFilter, setDateToFilter] = useState(localStorage.getItem('dateToFilter') || '');
    const [sentByFilter, setSentByFilter] = useState(localStorage.getItem('sentByFilter') || '');
    const [printMode, setPrintMode] = useState(false);
    const history = useHistory();

    useEffect(() => {
        localStorage.setItem('statusFilter', statusFilter);
        localStorage.setItem('dateFromFilter', dateFromFilter);
        localStorage.setItem('dateToFilter', dateToFilter);
        localStorage.setItem('sentByFilter', sentByFilter);
    }, [statusFilter, dateFromFilter, dateToFilter, sentByFilter]);

    const printDocument = () => {
        const shouldDownload = window.confirm("Do you want to download the PDF?");
        if (!shouldDownload) {
          return; // Exit the function if the user chooses not to download
        }
      
        const input = document.getElementById('divToPrint'); // Ensure your div or component has this ID
        html2canvas(input).then((canvas) => {
          const pdf = new jsPDF('p', 'mm', 'a4');
          const imgWidth = 210; // A4 width in mm
          const pageHeight = 295; // A4 height in mm, adjust this as needed
          let imgHeight = canvas.height * imgWidth / canvas.width;
          let heightLeft = imgHeight;
          const imgData = canvas.toDataURL('image/png');
      
          let position = 0;
      
          // This will split the image into parts based on the page height.
          while (heightLeft > 0) {
            if (position !== 0) {
              pdf.addPage();
            }
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            position -= pageHeight;
          }
      
          pdf.save("download.pdf");
        });
      };
      

    useEffect(() => {
        // Call fetchAllExcusals with filter parameters
        fetchAllExcusals(statusFilter, dateFromFilter, dateToFilter, sentByFilter).then((res) => {
            setAllExcusals(res);
        });
    }, [statusFilter, dateFromFilter, dateToFilter, sentByFilter]); // Depend on filter states


    const navigateToExcusal = (id) => {
        history.push(`/view/${id}`); // Navigate to the view page of the clicked excusal
    };

    return (
        <div style={{ paddingLeft: '20px', paddingTop: '10px', fontSize: '17px' }}>
            <button onClick={() => history.goBack()}>Back</button>
            <h2 style={{ margin: '16px 0 0px 0' }}>All Excusals</h2>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px'}}>
                <p>Excusal Status:</p>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">All Statuses</option>
                    <option value="submitted">Submitted</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
                <p>Date From:</p>
                <input
                    type="date"
                    placeholder="From Date"
                    value={dateFromFilter}
                    onChange={(e) => setDateFromFilter(e.target.value)}
                />
                <p>Date To:</p>
                <input
                    type="date"
                    placeholder="To Date"
                    value={dateToFilter}
                    onChange={(e) => setDateToFilter(e.target.value)}
                />
                <p>Sent By:</p>
                <input
                    type="text"
                    placeholder="Filter by Sender name"
                    value={sentByFilter}
                    onChange={(e) => setSentByFilter(e.target.value)}
                />
            </div>
            <div>
                {
                    printMode ? (
                        <button onClick={() => setPrintMode(false)}>Not Print Mode</button>
                    ) : (
                        <button onClick={() => setPrintMode(true)}>Print Mode</button>
                    )
                }
                <button onClick={printDocument}>Print PDF</button>
            </div>
        </div>
    );
}

export default AllExcusalsScreen;
