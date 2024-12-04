import React, { useEffect, useState } from "react";
import { useApi } from "../../apiV3";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";

const ListPages = () => {
  const pagesApi = useApi("pages");
  const [pages, setPages] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPages = async () => {
      const data = await pagesApi.getAll();
      setPages(data);
    };
    fetchPages();
  }, []);

  const handleDelete = async (id) => {
    await pagesApi.delete(id);
    setPages(pages.filter((page) => page.id !== id));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography variant="h4">Pages</Typography>
          {user.userType === "Teacher" && (
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/pages/create"
              startIcon={<AddIcon />}
            >
              Add Page
            </Button>
          )}
        </Box>
        <List>
          {pages.map((page) => (
            <ListItem key={page.id} sx={{ mb: 1 }}>
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText primary={page.title} secondary={page.page_type} />
              <Button
                component={Link}
                to={`/pages/${page.id}`}
                variant="outlined"
                sx={{ mr: 1 }}
              >
                View
              </Button>
              {user.userType === "Teacher" && (
                <>
                  <IconButton
                    component={Link}
                    to={`/pages/edit/${page.id}`}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(page.id)}
                    color="secondary"
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              )}
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default ListPages;
