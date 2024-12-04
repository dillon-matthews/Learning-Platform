import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Typography, Button, Paper, Box } from "@mui/material";
import { useApi } from "../../apiV3";
import { useAuth } from "../../hooks/useAuth";
import ReactMarkdown from "react-markdown";

const ViewAnnouncement = () => {
  const { id } = useParams();
  const announcementsApi = useApi("announcements");
  const [announcement, setAnnouncement] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAnnouncement = async () => {
      const data = await announcementsApi.getById(id);
      setAnnouncement(data);
    };
    fetchAnnouncement();
  }, [id]);

  if (!announcement) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" gutterBottom>
            {announcement.title}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {announcement.date}
          </Typography>
        </Box>
        <Box>
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => (
                <Typography variant="h5" gutterBottom {...props} />
              ),
              h2: ({ node, ...props }) => (
                <Typography variant="h6" gutterBottom {...props} />
              ),
              p: ({ node, ...props }) => (
                <Typography variant="body1" paragraph {...props} />
              ),
              li: ({ node, ordered, ...props }) => (
                <li>
                  <Typography variant="body1" component="span" {...props} />
                </li>
              ),
            }}
          >
            {announcement.content}
          </ReactMarkdown>
        </Box>
        {user && user.userType === "Teacher" && (
          <Button
            component={Link}
            to={`/announcements/edit/${announcement.id}`}
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
          >
            Edit Announcement
          </Button>
        )}
      </Paper>
    </Container>
  );
};

export default ViewAnnouncement;
