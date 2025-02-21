import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Grid,
  InputAdornment,
  IconButton,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { toast } from "react-toastify";

const AvailableBooks = () => {
  const { token } = useContext(AppContext);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    bookName: "",
    authorName: "",
    sectionName: "",
  });

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/user/ebooks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooks(res.data);
        setFilteredBooks(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBooks();
  }, [token]);

  useEffect(() => {
    const { bookName, authorName, sectionName } = searchCriteria;
    const filtered = books.filter(
      (book) =>
        (bookName === "" ||
          book.name.toLowerCase().includes(bookName.toLowerCase())) &&
        (authorName === "" ||
          book.authors.some((author) =>
            author.toLowerCase().includes(authorName.toLowerCase())
          )) &&
        (sectionName === "" ||
          book.section?.name.toLowerCase().includes(sectionName.toLowerCase()))
    );
    setFilteredBooks(filtered);
  }, [searchCriteria, books]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleClearSearch = (field) => {
    setSearchCriteria((prevState) => ({ ...prevState, [field]: "" }));
  };

  const requestBook = async (bookId) => {
    try {
      await axios.post(
        `http://localhost:5001/api/user/ebooks/${bookId}/request`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Book requested successfully");
    } catch (err) {
      const errorMessage = err.response?.data?.msg || "Error requesting book";
      console.error(err);
      toast.error(errorMessage);
    }
  };

  return (
    <Container sx={{ paddingY: 5 }}>
      <Grid container spacing={2} sx={{ marginBottom: 3 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Search Book Name"
            name="bookName"
            value={searchCriteria.bookName}
            onChange={handleSearchChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchCriteria.bookName && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleClearSearch("bookName")}
                    edge="end"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: "20px" },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Search Author Name"
            name="authorName"
            value={searchCriteria.authorName}
            onChange={handleSearchChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchCriteria.authorName && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleClearSearch("authorName")}
                    edge="end"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: "20px" },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Search Section Name"
            name="sectionName"
            value={searchCriteria.sectionName}
            onChange={handleSearchChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchCriteria.sectionName && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleClearSearch("sectionName")}
                    edge="end"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: "20px" },
            }}
          />
        </Grid>
      </Grid>

      <TableContainer
        component={Paper}
        sx={{
          border: "1px solid #ccc",
          borderRadius: 2,
          boxShadow: 3,
          marginTop: 2,
          marginBottom: 10,
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                Book Name
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                Author
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                Section Name
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#333" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <TableRow
                  key={book._id}
                  sx={{
                    "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                    "&:hover": { backgroundColor: "#f0f0f0" },
                  }}
                >
                  <TableCell>{book.name}</TableCell>
                  <TableCell>{book.authors.join(", ")}</TableCell>
                  <TableCell>{book.section?.name || "N/A"}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => requestBook(book._id)}
                    >
                      Request
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography
                    variant="h6"
                    color="textSecondary"
                    align="center"
                  >
                    No Books available.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AvailableBooks;
