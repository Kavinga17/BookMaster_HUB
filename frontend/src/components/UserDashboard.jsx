import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import { toast } from "react-toastify";
import BookIcon from "@mui/icons-material/Book";
import EventIcon from "@mui/icons-material/Event";
import VisibilityIcon from "@mui/icons-material/Visibility";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import WarningIcon from "@mui/icons-material/Warning";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

const UserDashboard = () => {
  const { token } = useContext(AppContext);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fines, setFines] = useState(0);
  const [paypalReady, setPaypalReady] = useState(false);
  const [openReturnDialog, setOpenReturnDialog] = useState(false);
  const [bookToReturn, setBookToReturn] = useState(null);
  const navigate = useNavigate();

  // Load PayPal SDK dynamically
  useEffect(() => {
    const loadPayPalScript = () => {
      if (!window.paypal) {
        const script = document.createElement("script");
        script.src = `https://www.paypal.com/sdk/js?client-id=AbiIIGSHUt6GIIbTDEHJ2jS4qiViZRQkys5sG0IHGTYyn94sGhVq_Q3uaTSaZ_x7M2Rxco0jWT4L8SFT`;
        script.async = true;
        script.onload = () => setPaypalReady(true);
        document.body.appendChild(script);
      } else {
        setPaypalReady(true);
      }
    };

    loadPayPalScript();
  }, []);

  // Calculate days remaining or overdue for a book
  const calculateDaysStatus = (returnDate) => {
    const today = new Date();
    const bookReturnDate = new Date(returnDate);
    const diffTime = bookReturnDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      days: Math.abs(diffDays),
      overdue: diffDays < 0
    };
  };

  // Fetch issued books and calculate fines
  useEffect(() => {
    const fetchIssuedBooks = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5001/api/user/issued-books",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIssuedBooks(res.data);
        
        const totalFines = res.data.reduce((acc, book) => {
          const { overdue, days } = calculateDaysStatus(book.returnDate);
          if (overdue) {
            return acc + days * 10; // Fine is $10 per day overdue
          }
          return acc;
        }, 0);
        setFines(totalFines);
      } catch (err) {
        console.error("Error details:", err.response?.data || err.message);
        toast.error("Failed to fetch issued books");
      } finally {
        setLoading(false);
      }
    };

    fetchIssuedBooks();
  }, [token]);

  // Render PayPal button once SDK is ready and fines are present
  useEffect(() => {
    if (paypalReady && fines > 0) {
      window.paypal.Buttons({
        style: {
          color: "blue",
          shape: "pill",
          label: "pay",
        },
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: fines.toString(),
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          await actions.order.capture();
          toast.success("Fine payment successful");
          setFines(0);
        },
        onError: (err) => {
          console.error("PayPal error:", err);
          toast.error("An error occurred with PayPal payment");
        },
      }).render("#paypal-button-container");
    }
  }, [paypalReady, fines]);

  // Handle book return - FIXED
  const handleReturnEbook = async () => {
    if (!bookToReturn || !bookToReturn._id) {
      console.error("Invalid book selected for return");
      toast.error("Error processing return: Invalid book selection");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5001/api/user/notify-admin-return",
        { ebookId: bookToReturn._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Return request sent to admin for approval");

      // Remove returned book from the issuedBooks list
      setIssuedBooks((prevBooks) =>
        prevBooks.filter((book) => book._id !== bookToReturn._id)
      );

      setOpenReturnDialog(false);
    } catch (err) {
      console.error("Error details:", err.response?.data || err.message);
      toast.error("Error notifying admin for return");
    }
  };

  const handleReturnDialogOpen = (book) => {
    console.log("Book selected for return:", book);
    setBookToReturn(book);
    setOpenReturnDialog(true);
  };

  const handleReturnDialogClose = () => {
    setOpenReturnDialog(false);
  };

  // Get random color for book avatar
  const getRandomColor = (str) => {
    const colors = [
      "#3f51b5", "#f44336", "#4caf50", "#ff9800", "#2196f3",
      "#9c27b0", "#009688", "#673ab7", "#e91e63", "#ffc107"
    ];
    const hash = str.split("").reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return colors[hash % colors.length];
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box
        sx={{
          background: "linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)",
          borderRadius: 3,
          padding: 4,
          marginBottom: 5,
          color: "white",
          boxShadow: "0 8px 32px rgba(0, 13, 255, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <LibraryBooksIcon sx={{ fontSize: 40, marginRight: 2 }} />
          <Typography variant="h4" fontWeight="bold">
            Your Library Dashboard
          </Typography>
        </Box>
        
        {fines > 0 && (
          <Chip
            icon={<WarningIcon />}
            label={`Outstanding Fines: $${fines}`}
            color="error"
            variant="filled"
            sx={{ 
              fontSize: "1rem", 
              padding: "20px 10px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderColor: "rgba(255, 255, 255, 0.5)",
              "& .MuiChip-icon": { color: "#FFEB3B" }
            }}
          />
        )}
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : issuedBooks.length === 0 ? (
        <Card
          sx={{
            textAlign: "center",
            py: 8,
            background: "linear-gradient(to right, #f5f7fa, #e8eaec)",
            borderRadius: 4,
            boxShadow: "0 8px 20px rgba(0,0,0,0.05)"
          }}
        >
          <CardContent>
            <BookIcon sx={{ fontSize: 80, color: "#9e9e9e", mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No books currently issued
            </Typography>
          
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Fine Payment Section */}
          {fines > 0 && (
            <Card 
              sx={{ 
                mb: 4, 
                overflow: "hidden",
                borderRadius: 3,
                boxShadow: "0 8px 25px rgba(255,87,34,0.2)",
                background: "linear-gradient(145deg, #fff8f6, #fff0eb)",
                border: "1px solid #ffdacf"
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 3, borderBottom: "1px solid #ffe9e2" }}>
                  <Typography variant="h5" color="error.main" sx={{ display: "flex", alignItems: "center" }}>
                    <MonetizationOnIcon sx={{ mr: 1 }} /> 
                    Outstanding Fine: ${fines}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Please settle your fine to continue borrowing books and requesting returns
                  </Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ color: "#757575" }}>
                    Pay securely with PayPal:
                  </Typography>
                  <Box 
                    id="paypal-button-container" 
                    sx={{ 
                      maxWidth: 300,
                      "& .paypal-button": {
                        borderRadius: "30px !important"
                      }
                    }}
                  ></Box>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Books Grid */}
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 3, 
              fontWeight: 500,
              display: "flex",
              alignItems: "center"
            }}
          >
            <BookIcon sx={{ mr: 1 }} />
            Your Issued Books ({issuedBooks.length})
          </Typography>
          
          <Grid container spacing={3}>
            {issuedBooks.map((book) => {
              const { days, overdue } = calculateDaysStatus(book.returnDate);
              const bookColor = getRandomColor(book.name);
              
              return (
                <Grid item xs={12} md={6} key={book._id}>
                  <Card 
                    sx={{ 
                      display: "flex",
                      height: "100%",
                      overflow: "hidden",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      borderRadius: 3,
                      boxShadow: overdue 
                        ? "0 8px 15px rgba(244, 67, 54, 0.15)" 
                        : "0 8px 15px rgba(0, 0, 0, 0.08)",
                      border: overdue ? "1px solid rgba(244, 67, 54, 0.3)" : "none",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: overdue 
                          ? "0 12px 20px rgba(244, 67, 54, 0.2)" 
                          : "0 12px 20px rgba(0, 0, 0, 0.12)"
                      }
                    }}
                  >
                    <Box 
                      sx={{ 
                        display: "flex", 
                        flexDirection: "column",
                        width: 10,
                        backgroundColor: bookColor
                      }} 
                    />
                    <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", p: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: bookColor,
                            width: 50,
                            height: 50,
                            mr: 2
                          }}
                        >
                          {book.name.charAt(0)}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" component="div" sx={{ lineHeight: 1.3 }}>
                            {book.name}
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                            <EventIcon fontSize="small" sx={{ color: "text.secondary", mr: 0.5 }} />
                            <Typography variant="body2" color="text.secondary">
                              Due: {new Date(book.returnDate).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ mb: 2 }}>
                        <Chip 
                          label={overdue 
                            ? `${days} days overdue` 
                            : `${days} days remaining`}
                          color={overdue ? "error" : "success"}
                          size="small"
                          icon={overdue ? <WarningIcon /> : <EventIcon />}
                          sx={{ 
                            fontWeight: 500,
                            py: 0.5
                          }}
                        />
                      </Box>
                      
                      <Box 
                        sx={{ 
                          display: "flex", 
                          justifyContent: "space-between",
                          mt: "auto",
                          pt: 1
                        }}
                      >
                        <Tooltip title="View Book Details">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => navigate(`/books/${book._id}`)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title={fines > 0 ? "Pay fines to return book" : "Request Return"}>
                          <span>
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              startIcon={<KeyboardReturnIcon />}
                              onClick={() => handleReturnDialogOpen(book)}
                              disabled={fines > 0}
                              sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                backgroundColor: "#2e7d32",
                                transition: "all 0.2s",
                                "&:hover": {
                                  backgroundColor: "#1b5e20",
                                  transform: "translateY(-2px)"
                                },
                                "&:disabled": {
                                  backgroundColor: "rgba(0, 0, 0, 0.12)",
                                }
                              }}
                            >
                              Return Book
                            </Button>
                          </span>
                        </Tooltip>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Return Confirmation Dialog */}
          <Dialog
            open={openReturnDialog}
            onClose={handleReturnDialogClose}
            PaperProps={{
              sx: {
                borderRadius: 3,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                padding: 1
              }
            }}
          >
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <KeyboardReturnIcon sx={{ mr: 1, color: "primary.main" }} />
                Confirm Book Return
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Are you sure you want to request the return of:
              </Typography>
              {bookToReturn && (
                <Card sx={{ mt: 2, mb: 2, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
                  <CardContent sx={{ py: 2 }}>
                    <Typography variant="h6" color="primary.main" sx={{ fontWeight: 500 }}>
                      "{bookToReturn.name}"
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Due date: {new Date(bookToReturn?.returnDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </CardContent>
                </Card>
              )}
              <Typography variant="body2" color="text.secondary">
                Your return request will be sent to the administrator for approval.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button 
                onClick={handleReturnDialogClose}
                variant="outlined"
                sx={{ 
                  borderRadius: 2,
                  textTransform: "none",
                  px: 3
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleReturnEbook}
                variant="contained"
                color="primary"
                sx={{ 
                  borderRadius: 2,
                  textTransform: "none",
                  px: 3,
                  backgroundColor: "#2e7d32",
                  "&:hover": {
                    backgroundColor: "#1b5e20"
                  }
                }}
              >
                Confirm Return
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Container>
  );
};

export default UserDashboard;