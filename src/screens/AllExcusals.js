import React, { useState, useEffect } from 'react';
import { fetchAllExcusals } from '../firebase';
import { useHistory } from 'react-router-dom';
import { Box, Button, VStack, HStack, Select, Input, Text, Heading } from '@chakra-ui/react';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

function AllExcusalsScreen() {
    const [allExcusals, setAllExcusals] = useState([]);
    const [statusFilter, setStatusFilter] = useState(localStorage.getItem('statusFilter') || '');
    const [dateFromFilter, setDateFromFilter] = useState(localStorage.getItem('dateFromFilter') || '');
    const [dateToFilter, setDateToFilter] = useState(localStorage.getItem('dateToFilter') || '');
    const [sentByFilter, setSentByFilter] = useState(localStorage.getItem('sentByFilter') || '');
    const [printMode, setPrintMode] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const history = useHistory();

    useEffect(() => {
        localStorage.setItem('statusFilter', statusFilter);
        localStorage.setItem('dateFromFilter', dateFromFilter);
        localStorage.setItem('dateToFilter', dateToFilter);
        localStorage.setItem('sentByFilter', sentByFilter);
    }, [statusFilter, dateFromFilter, dateToFilter, sentByFilter]);

    const printDocument = () => {
        const shouldDownload = window.confirm("Do you want to download the PDF?");
        if (!shouldDownload) return;

        const input = document.getElementById('divToPrint');
        html2canvas(input).then((canvas) => {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const pageHeight = 295;
            let imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            const imgData = canvas.toDataURL('image/png');

            let position = 0;
            while (heightLeft > 0) {
                if (position !== 0) pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
                position -= pageHeight;
            }
            pdf.save("download.pdf");
        });
    };

    useEffect(() => {
        fetchAllExcusals(statusFilter, dateFromFilter, dateToFilter).then((res) => {
            setAllExcusals(res);
            console.log("fetching all excusals: ", res);
        });
    }, [statusFilter, dateFromFilter, dateToFilter]);

    const navigateToExcusal = (id) => {
        history.push(`/view/${id}`);
    };

    // Apply local filtering based on sentByFilter
    const filteredExcusals = allExcusals.filter(excusal =>
        excusal.sentBy.toLowerCase().includes(sentByFilter.toLowerCase())
    );

    return (
        <Box padding="20px">
            <Button 
                onClick={() => history.goBack()} 
                mb={4} 
                bg={"#EEEEEE"}
                color="black"
                border="1px solid black"
                transition="border 0.1s ease-in-out"
                _hover={{
                    borderWidth: "2px",
                    bg: "#DDDDDD"
                }}
                colorScheme="gray">
                Back
            </Button>
            <Heading as="h2" size="lg" mb={6}>
                All Excusals
            </Heading>

            {/* Filter Section */}
            <HStack spacing={4} mb={6}>
                <Text>Excusal Status:</Text>
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} width="200px">
                    <option value="">All Statuses</option>
                    <option value="submitted">Submitted</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </Select>
                <Text>Date From:</Text>
                <Input type="date" value={dateFromFilter} onChange={(e) => setDateFromFilter(e.target.value)} width="200px" />
                <Text>Date To:</Text>
                <Input type="date" value={dateToFilter} onChange={(e) => setDateToFilter(e.target.value)} width="200px" />
                <Text>Sent By:</Text>
                <Input
                    type="text"
                    placeholder="Filter by Sender name"
                    value={sentByFilter}
                    onChange={(e) => setSentByFilter(e.target.value)}
                    width="200px"
                />
            </HStack>

            <HStack spacing={4} mb={6}>
                <Button
                    onClick={() => setPrintMode(!printMode)}
                    bg={printMode ? "#FF6666" : "#99FF99"}
                    color="black"
                    border="1px solid black"
                    transition="border 0.1s ease-in-out"
                    _hover={{
                        borderWidth: "2px",
                        bg: printMode ? "#EE5555" : "#88EE88"
                    }}
                >
                    {printMode ? "Exit Print Mode" : "Enter Print Mode"}
                </Button>
                <Button
                    onClick={printDocument}
                    bg="#90CDF4"
                    color="black"
                    border="1px solid black"
                    transition="border 0.1s ease-in-out"
                    _hover={{
                        borderWidth: "2px",
                        bg: "#80BDE4"
                    }}
                >
                    Print PDF
                </Button>
            </HStack>


            {/* Excusal List */}
            <Box id="divToPrint">
                <VStack spacing={4} align="stretch">
                    {filteredExcusals.length > 0 ? (
                        filteredExcusals.map((excusal, index) => (
                            <Box
                                key={excusal.id}
                                onClick={() => navigateToExcusal(excusal.id)}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                border={hoveredIndex === index || printMode ? '2px solid black' : '1px solid black'}
                                borderRadius="md"
                                p={4}
                                bg={hoveredIndex === index ? '#f9f9f9' : 'white'}
                                transition="border 0.1s ease-in-out"
                                cursor="pointer"
                            >
                                {printMode ? (
                                    <VStack align="start">
                                        <Text><strong>ID:</strong> {excusal.id}</Text>
                                        <Text><strong>Event:</strong> {excusal.event}</Text>
                                        <Text><strong>From Date:</strong> {excusal.fromDate}</Text>
                                        <Text><strong>To Date:</strong> {excusal.toDate}</Text>
                                        <Text><strong>Date Submitted:</strong> {excusal.dateSubmitted}</Text>
                                        <Text><strong>Reason:</strong> {excusal.reason}</Text>
                                        <Text><strong>Reason Details:</strong> {excusal.reasonDetails}</Text>
                                        <Text><strong>Comments:</strong> {excusal.comments}</Text>
                                        <Text><strong>Sent By:</strong> {excusal.sentBy}</Text>
                                    </VStack>
                                ) : (
                                    <HStack justify="space-between">
                                        <Text><strong>ID:</strong> {excusal.id}</Text>
                                        <Text><strong>Sent By:</strong> {excusal.sentBy}</Text>
                                    </HStack>
                                )}
                            </Box>
                        ))
                    ) : (
                        <Text>No excusals found.</Text>
                    )}
                </VStack>
            </Box>
        </Box>
    );
}

export default AllExcusalsScreen;
