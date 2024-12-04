import React, { useState, useEffect } from "react";
import { useApi } from "../../apiV3";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Paper,
  Box,
  Collapse,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandLess,
  ExpandMore,
  Description as DescriptionIcon,
} from "@mui/icons-material";

const ListModules = () => {
  const modulesApi = useApi("modules");
  const pagesApi = useApi("pages");
  const { user } = useAuth();
  const [modules, setModules] = useState([]);
  const [pages, setPages] = useState([]);
  const [openModules, setOpenModules] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      let fetchedModules = await modulesApi.getAll();

      fetchedModules.sort((a, b) => a.order - b.order);

      if (!user || user.userType !== "Teacher") {
        fetchedModules = fetchedModules.filter((mod) => mod.published);
      }

      setModules(fetchedModules);

      const allPages = await pagesApi.getAll();
      setPages(allPages);
    };
    fetchData();
  }, [user]);

  const handleToggle = (moduleId) => {
    setOpenModules((prevOpenModules) => ({
      ...prevOpenModules,
      [moduleId]: !prevOpenModules[moduleId],
    }));
  };

  const handleDeleteModule = async (moduleId) => {
    await modulesApi.delete(moduleId);
    setModules(modules.filter((module) => module.id !== moduleId));
  };

  const handleRemovePageFromModule = async (page) => {
    await pagesApi.update(page.id, {
      ...page,
      module_id: null,
      order_in_module: null,
    });
    setPages(
      pages.map((p) =>
        p.id === page.id
          ? {
              ...p,
              module_id: null,
              order_in_module: null,
            }
          : p
      )
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
          <Typography variant="h4">Modules</Typography>
          {user && user.userType === "Teacher" && (
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/modules/create"
              startIcon={<AddIcon />}
            >
              Create Module
            </Button>
          )}
        </Box>
        {modules.map((module) => (
          <Paper key={module.id} sx={{ mb: 2 }}>
            <List disablePadding>
              <ListItem
                button
                onClick={() => handleToggle(module.id)}
                sx={{ bgcolor: "background.paper" }}
              >
                <ListItemText
                  primary={
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {module.title}
                    </Typography>
                  }
                  secondary={module.description}
                />
                {openModules[module.id] ? <ExpandLess /> : <ExpandMore />}
                {user && user.userType === "Teacher" && (
                  <>
                    <IconButton
                      component={Link}
                      to={`/modules/edit/${module.id}`}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteModule(module.id)}
                      color="secondary"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
              </ListItem>
              <Collapse
                in={openModules[module.id]}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding sx={{ pl: 4 }}>
                  {pages
                    .filter((page) => page.module_id === module.id)
                    .sort(
                      (a, b) =>
                        (a.order_in_module || 0) - (b.order_in_module || 0)
                    )
                    .map((page) => (
                      <ListItem
                        key={page.id}
                        sx={{ pl: 2 }}
                        secondaryAction={
                          user &&
                          user.userType === "Teacher" && (
                            <IconButton
                              edge="end"
                              color="secondary"
                              onClick={() => handleRemovePageFromModule(page)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          )
                        }
                      >
                        <ListItemIcon>
                          <DescriptionIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Link
                              to={`/pages/${page.id}`}
                              style={{ textDecoration: "none" }}
                            >
                              {page.title}
                            </Link>
                          }
                          secondary={page.page_type}
                        />
                      </ListItem>
                    ))}
                </List>
              </Collapse>
            </List>
          </Paper>
        ))}
      </Paper>
    </Container>
  );
};

export default ListModules;
