import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../apiV3";
import {
  Container,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

const CreatePage = () => {
  const pagesApi = useApi("pages");
  const pageTypesApi = useApi("page_types");
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pageType, setPageType] = useState("");
  const [pageTypes, setPageTypes] = useState([]);
  const [newPageType, setNewPageType] = useState("");
  const [openTypeDialog, setOpenTypeDialog] = useState(false);

  const [homePageExists, setHomePageExists] = useState(false);
  const [existingHomePageId, setExistingHomePageId] = useState(null);
  const [openHomePageDialog, setOpenHomePageDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const types = await pageTypesApi.getAll();
      setPageTypes(types);

      const pages = await pagesApi.getAll();
      const homePage = pages.find((page) => page.page_type === "HomePage");
      if (homePage) {
        setHomePageExists(true);
        setExistingHomePageId(homePage.id);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (pageType === "HomePage" && homePageExists) {
      setOpenHomePageDialog(true);
      return;
    }

    const pageData = {
      title,
      content,
      page_type: pageType,
    };

    await pagesApi.create(pageData);

    navigate("/pages");
  };

  const handleAddNewType = () => {
    setOpenTypeDialog(true);
  };

  const handleTypeDialogClose = () => {
    setOpenTypeDialog(false);
    setNewPageType("");
  };

  const handleHomePageDialogClose = () => {
    setOpenHomePageDialog(false);
  };

  const handleEditHomePage = () => {
    navigate(`/pages/edit/${existingHomePageId}`);
  };

  const handleDeleteHomePage = async () => {
    await pagesApi.delete(existingHomePageId);
    setHomePageExists(false);
    setOpenHomePageDialog(false);
    handleSubmit(new Event("submit"));
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography component="h1" variant="h5" align="center">
          Create New Page
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Page Type</InputLabel>
            <Select
              value={pageType}
              onChange={(e) => {
                if (e.target.value === "AddNewType") {
                  handleAddNewType();
                } else {
                  setPageType(e.target.value);
                }
              }}
            >
              {pageTypes.map((type) => (
                <MenuItem key={type.type} value={type.type}>
                  {type.type}
                </MenuItem>
              ))}
              <MenuItem value="AddNewType">
                <Box display="flex" alignItems="center">
                  <AddIcon fontSize="small" sx={{ marginRight: 1 }} />
                  Add New Page Type
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Content"
            fullWidth
            margin="normal"
            multiline
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ mt: 3 }}
          >
            Create Page
          </Button>
        </Box>
      </Paper>

      <Dialog open={openTypeDialog} onClose={handleTypeDialogClose}>
        <DialogTitle>Add New Page Type</DialogTitle>
        <DialogContent>
          <TextField
            label="New Page Type"
            fullWidth
            margin="normal"
            value={newPageType}
            onChange={(e) => setNewPageType(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTypeDialogClose}>Cancel</Button>
          <Button
            onClick={async () => {
              if (newPageType) {
                await pageTypesApi.create({ type: newPageType });
                setPageTypes([...pageTypes, { type: newPageType }]);
                setPageType(newPageType);
                handleTypeDialogClose();
              } else {
                alert("Please enter a new page type.");
              }
            }}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openHomePageDialog} onClose={handleHomePageDialogClose}>
        <DialogTitle>Home Page Already Exists</DialogTitle>
        <DialogContent>
          <Typography>
            A Home Page already exists. You can edit the existing Home Page or
            delete it and create a new one.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleHomePageDialogClose}>Cancel</Button>
          <Button onClick={handleEditHomePage} color="primary">
            Edit Existing
          </Button>
          <Button onClick={handleDeleteHomePage} color="secondary">
            Delete and Create New
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreatePage;
