import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleIcon from "@mui/icons-material/People";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import BookIcon from "@mui/icons-material/Book";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import { toast } from "react-toastify";

const LibrarianDashboard = () => {
  const { token } = useContext(AppContext);
  const [data, setData] = useState({
    usersCount: 0,
    sections: 0,
    ebooks: 0,
    totalBooksIssued: 0,
    users: [],
  });
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5001/api/librarian/dashboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(res.data);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    };

    fetchData();
  }, [token]);

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        `http://localhost:5001/api/librarian/user/${selectedUser._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setData((prevState) => ({
        ...prevState,
        users: prevState.users.filter((user) => user._id !== selectedUser._id),
      }));
      toast.success("User deleted successfully");
      handleClose();
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Error deleting User";
      console.error("Error deleting user", err);
      toast.error(errorMessage);
    }
  };

  return (
    <Container sx={{ paddingTop: 5, paddingBottom: 5 }}>
      <Grid container spacing={3} sx={{ marginBottom: 5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#3f51b5",
              color: "#fff",
              height: 150,
              borderRadius: 2,
              boxShadow: 6,
              transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: 20,
              },
            }}
          >
            <CardMedia>
              <PeopleIcon sx={{ fontSize: 50, margin: 2 }} />
            </CardMedia>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>Active Users</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>{data.usersCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#381822",
              color: "#fff",
              height: 150,
              borderRadius: 2,
              boxShadow: 6,
              transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: 20,
              },
            }}
          >
            <CardMedia>
              <LibraryBooksIcon sx={{ fontSize: 50, margin: 2 }} />
            </CardMedia>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>Total Sections</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>{data.sections}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#e91e63",
              color: "#fff",
              height: 150,
              borderRadius: 2,
              boxShadow: 6,
              transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: 20,
              },
            }}
          >
            <CardMedia>
              <BookIcon sx={{ fontSize: 50, margin: 2 }} />
            </CardMedia>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>Total Books</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>{data.ebooks}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#f57c00",
              color: "#fff",
              height: 150,
              borderRadius: 2,
              boxShadow: 6,
              transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: 20,
              },
            }}
          >
            <CardMedia>
              <ImportContactsIcon sx={{ fontSize: 50, margin: 2 }} />
            </CardMedia>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>Total Books Issued</Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>{data.totalBooksIssued}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ paddingTop: 5, fontWeight: "bold" }}>
        All Users
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          border: "1px solid #ccc",
          marginTop: 2,
          marginBottom: 10,
          borderRadius: 2,
          boxShadow: 5,
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>Username</TableCell>
              <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>Role</TableCell>
              <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.users.map((user) => (
              <TableRow key={user._id} sx={{ "&:hover": { backgroundColor: "#fafafa" } }}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(user)}
                    sx={{
                      transition: "transform 0.3s ease",
                      "&:hover": { transform: "scale(1.1)" },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete User"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LibrarianDashboard;
