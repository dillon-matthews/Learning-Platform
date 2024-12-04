import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useApi } from "../../apiV3";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useAuth } from "../../hooks/useAuth";

const ViewModule = () => {
  const { id } = useParams();
  const modulesApi = useApi("modules");
  const pagesApi = useApi("pages");
  const { user } = useAuth();

  const [module, setModule] = useState(null);
  const [modulePages, setModulePages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const moduleData = await modulesApi.getById(id);
      if (moduleData) {
        setModule(moduleData);
      }

      const allPages = await pagesApi.getAll();
      const pagesInModule = allPages
        .filter((page) => page.module_id === id)
        .sort((a, b) => (a.order_in_module || 0) - (b.order_in_module || 0));
      setModulePages(pagesInModule);
    };
    fetchData();
  }, [id]);

  if (!module) {
    return <Typography>Loading...</Typography>;
  }

  if (!module.published && (!user || user.userType !== "Teacher")) {
    return <Typography>Module not available.</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {module.title}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {module.content}
      </Typography>
      <Typography variant="h5" gutterBottom style={{ marginTop: "20px" }}>
        Pages
      </Typography>
      <List>
        {modulePages.map((page) => (
          <ListItem key={page.id}>
            <ListItemText
              primary={
                <Link
                  to={`/pages/${page.id}`}
                  style={{ textDecoration: "none" }}
                >
                  {page.title}
                </Link>
              }
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default ViewModule;
