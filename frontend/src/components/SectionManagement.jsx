import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Modal,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

const SectionManagement = () => {
  const { token } = useContext(AppContext);
  const [sections, setSections] = useState([]);
  const [newSection, setNewSection] = useState({
    name: "",
    description: "",
  });
  const [editSection, setEditSection] = useState(null);
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/user/sections", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSections(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSections();
  }, [token]);

  const addSection = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5001/api/librarian/sections",
        newSection,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSections([...sections, res.data]);
      setNewSection({ name: "", description: "" });
      toast.success("Section added successfully");
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Error adding Section";
      console.error(err);
      toast.error(errorMessage);
    }
  };

  const handleDeleteClick = (section) => {
    setSelectedSection(section);
    setOpenDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        `http://localhost:5001/api/librarian/sections/${selectedSection._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSections(
        sections.filter((section) => section._id !== selectedSection._id)
      );
      toast.success("Section deleted successfully");
      handleCloseDialog();
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Error deleting Section";
      console.error(err);
      toast.error(errorMessage);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSection(null);
  };

  const updateSection = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5001/api/librarian/sections/${editSection._id}`,
        editSection,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSections(
        sections.map((section) =>
          section._id === editSection._id ? res.data : section
        )
      );
      setEditSection(null);
      setOpen(false);
      toast.success("Section updated successfully");
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Error updating Section";
      console.error(err);
      toast.error(errorMessage);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSection({ ...newSection, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditSection({ ...editSection, [name]: value });
  };

  const handleEditOpen = (section) => {
    setEditSection(section);
    setOpen(true);
  };

  const handleEditClose = () => {
    setEditSection(null);
    setOpen(false);
  };

  return (
    <Container sx={{ marginTop: 5 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", fontWeight: "bold", color: "#3f51b5" }}>
        Manage Sections
      </Typography>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px" }}>
        <TextField
          label="Section Name"
          name="name"
          value={newSection.name}
          onChange={handleChange}
          sx={{ flex: 1 }}
          variant="outlined"
          required
        />
        <TextField
          label="Description"
          name="description"
          value={newSection.description}
          onChange={handleChange}
          sx={{ flex: 1 }}
          variant="outlined"
        />
        <Button
          onClick={addSection}
          variant="contained"
          color="primary"
          sx={{
            alignSelf: "center",
            height: "100%",
            padding: "0 20px",
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          Add Section
        </Button>
      </div>

      {sections.length > 0 ? (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "10px",
            border: "1px solid #ddd",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", backgroundColor: "#3f51b5", color: "#fff" }}>
                  Section Name
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", backgroundColor: "#3f51b5", color: "#fff" }}>
                  Description
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", backgroundColor: "#3f51b5", color: "#fff" }}>
                  Date Created
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", backgroundColor: "#3f51b5", color: "#fff" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sections.map((section) => (
                <TableRow key={section._id}>
                  <TableCell>{section.name}</TableCell>
                  <TableCell>{section.description}</TableCell>
                  <TableCell>
                    {new Date(section.dateCreated).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditOpen(section)}
                      sx={{ marginRight: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(section)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="h6" color="textSecondary" align="center" sx={{ marginTop: 3 }}>
          No sections available.
        </Typography>
      )}

      <Modal open={open} onClose={handleEditClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #3f51b5",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleEditClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            sx={{ marginBottom: 2 }}
            variant="h6"
            component="h2"
            color="primary"
            align="center"
            gutterBottom
          >
            Edit Section
          </Typography>
          <TextField
            label="Section Name"
            name="name"
            value={editSection?.name || ""}
            onChange={handleEditChange}
            sx={{ marginBottom: 2 }}
            fullWidth
            required
          />
          <TextField
            label="Description"
            name="description"
            value={editSection?.description || ""}
            onChange={handleEditChange}
            sx={{ marginBottom: 2 }}
            fullWidth
          />
          <Button
            onClick={updateSection}
            variant="contained"
            color="primary"
            sx={{ marginRight: 1, width: "100%" }}
          >
            Save
          </Button>
          <Button
            onClick={handleEditClose}
            variant="contained"
            color="secondary"
            sx={{ width: "100%" }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="confirm-delete-dialog"
        aria-describedby="confirm-delete-description"
      >
        <DialogTitle id="confirm-delete-dialog">{"Delete Section"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-delete-description">
            Are you sure you want to delete this section?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SectionManagement;
