import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const UserFines = ({ userId }) => {
    const [fines, setFines] = useState([]);
    const [paidFines, setPaidFines] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchFines();
        fetchPaidFines();
    }, []);

    const fetchFines = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/fines/${userId}`);
            setFines(response.data);
        } catch (err) {
            console.error('Error fetching fines:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPaidFines = async () => {
        try {
            const response = await axios.get(`/api/fines/payment-history/${userId}`);
            setPaidFines(response.data);
        } catch (err) {
            console.error('Error fetching paid fines:', err);
        }
    };

    const payFine = async (fineId) => {
        try {
            await axios.put(`/api/fines/pay/${fineId}`);
            fetchFines(); // Re-fetch fines after payment
            fetchPaidFines(); // Re-fetch paid fines history
        } catch (err) {
            console.error('Error paying fine:', err);
        }
    };

    return (
        <div>
            <h2>User Fines</h2>

            {loading && <p>Loading fines...</p>}

            {/* Fines Table */}
            <h3>Unpaid Fines</h3>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Book ID</TableCell>
                            <TableCell>Fine Amount (LKR)</TableCell>
                            <TableCell>Issued Date</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {fines.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4}>No fines found</TableCell>
                            </TableRow>
                        ) : (
                            fines.map((fine) => (
                                <TableRow key={fine._id}>
                                    <TableCell>{fine.bookId}</TableCell>
                                    <TableCell>{fine.fineAmount}</TableCell>
                                    <TableCell>{new Date(fine.dateIssued).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        {!fine.paid ? (
                                            <Button variant="contained" color="primary" onClick={() => payFine(fine._id)}>
                                                Pay Fine
                                            </Button>
                                        ) : (
                                            <span>Paid</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Paid Fines History */}
            <h3>Paid Fines History</h3>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Book ID</TableCell>
                            <TableCell>Fine Amount (LKR)</TableCell>
                            <TableCell>Issued Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paidFines.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3}>No paid fines found</TableCell>
                            </TableRow>
                        ) : (
                            paidFines.map((fine) => (
                                <TableRow key={fine._id}>
                                    <TableCell>{fine.bookId}</TableCell>
                                    <TableCell>{fine.fineAmount}</TableCell>
                                    <TableCell>{new Date(fine.dateIssued).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default UserFines;
