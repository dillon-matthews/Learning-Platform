import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Typography } from "@mui/material";
import { useApi } from "../../apiV3";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const EditAnnouncement = () => {
  const { id } = useParams();
  const announcementsApi = useApi("announcements");
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchAnnouncement = async () => {
      const data = await announcementsApi.getById(id);
      if (data) {
        setTitle(data.title);
        setContent(data.content);
      }
    };
    fetchAnnouncement();
  }, [id]);

  const handleUpdate = async () => {
    await announcementsApi.update(id, {
      title,
      content,
      author_id: user.id,
    });
    navigate("/announcements");
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Edit Announcement
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
        onClick={handleUpdate}
        fullWidth
      >
        Update
      </Button>
    </Container>
  );
};

export default EditAnnouncement;
