import React, { useState } from "react";
import { useApi } from "../../apiV3";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Container, TextField, Button, Typography } from "@mui/material";

const CreateAnnouncement = () => {
  const announcementsApi = useApi("announcements");
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleCreate = async () => {
    await announcementsApi.create({
      title,
      content,
      author_id: user.id,
    });
    navigate("/announcements");
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Create Announcement
      </Typography>
      <TextField
        label="Title"
        fullWidth
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
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
        onClick={handleCreate}
        fullWidth
      >
        Create
      </Button>
    </Container>
  );
};

export default CreateAnnouncement;
