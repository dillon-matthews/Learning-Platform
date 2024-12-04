import React, { useEffect, useState } from "react";
import { useApi } from "../apiV3";
import { Container, Typography, Box, Paper } from "@mui/material";
import ReactMarkdown from "react-markdown";

const HomePage = () => {
  const pagesApi = useApi("pages");
  const [homePage, setHomePage] = useState(null);

  useEffect(() => {
    const fetchHomePage = async () => {
      const pages = await pagesApi.getAll();
      const home = pages.find((page) => page.page_type === "HomePage");
      if (home) {
        setHomePage(home);
      }
    };
    fetchHomePage();
  }, []);

  if (!homePage) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" gutterBottom>
            {homePage.title}
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
            {homePage.content}
          </ReactMarkdown>
        </Box>
      </Paper>
    </Container>
  );
};

export default HomePage;
