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
  Announcement as AnnouncementIcon,
} from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";

const ListAnnouncements = () => {
  const announcementsApi = useApi("announcements");
  const [announcements, setAnnouncements] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const data = await announcementsApi.getAll();
      setAnnouncements(data);
    };
    fetchAnnouncements();
  }, []);

  const handleDelete = async (id) => {
    await announcementsApi.delete(id);
    setAnnouncements(
      announcements.filter((announcement) => announcement.id !== id)
    );
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
          <Typography variant="h4">Announcements</Typography>
          {user.userType === "Teacher" && (
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/announcements/create"
              startIcon={<AddIcon />}
            >
              Add Announcement
            </Button>
          )}
        </Box>
        <List>
          {announcements.map((announcement) => (
            <ListItem key={announcement.id} sx={{ mb: 1 }}>
              <ListItemIcon>
                <AnnouncementIcon />
              </ListItemIcon>
              <ListItemText
                primary={announcement.title}
                secondary={announcement.date}
              />
              <Button
                component={Link}
                to={`/announcements/${announcement.id}`}
                variant="outlined"
                sx={{ mr: 1 }}
              >
                View
              </Button>
              {user.userType === "Teacher" && (
                <>
                  <IconButton
                    component={Link}
                    to={`/announcements/edit/${announcement.id}`}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(announcement.id)}
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

export default ListAnnouncements;
