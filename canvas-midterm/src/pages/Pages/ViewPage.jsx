import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useApi } from "../../apiV3";
import { useAuth } from "../../hooks/useAuth";
import { Container, Typography, Button, Box, Paper } from "@mui/material";
import ReactMarkdown from "react-markdown";

const ViewPage = () => {
  const { id } = useParams();
  const pagesApi = useApi("pages");
  const [page, setPage] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPage = async () => {
      const pageData = await pagesApi.getById(id);
      setPage(pageData);
    };
    fetchPage();
  }, [id]);

  if (!page) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" gutterBottom>
            {page.title}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            <strong>Page Type:</strong> {page.page_type}
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
            {page.content}
          </ReactMarkdown>
        </Box>
        {user && user.userType === "Teacher" && (
          <Button
            component={Link}
            to={`/pages/edit/${page.id}`}
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
          >
            Edit Page
          </Button>
        )}
      </Paper>
    </Container>
  );
};

export default ViewPage;
