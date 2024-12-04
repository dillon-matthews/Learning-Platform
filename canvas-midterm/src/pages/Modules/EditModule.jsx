import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../../apiV3";
import {
  Container,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
} from "@mui/material";

const EditModule = () => {
  const { id } = useParams();
  const modulesApi = useApi("modules");
  const pagesApi = useApi("pages");
  const navigate = useNavigate();

  const [module, setModule] = useState(null);
  const [title, setTitle] = useState("");
  const [published, setPublished] = useState(false);
  const [modulePages, setModulePages] = useState([]);
  const [availablePages, setAvailablePages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const moduleData = await modulesApi.getById(id);
      if (moduleData) {
        setModule(moduleData);
        setTitle(moduleData.title);
        setPublished(moduleData.published);
      }

      const allPages = await pagesApi.getAll();

      setModulePages(
        allPages
          .filter((page) => page.module_id === id)
          .sort((a, b) => (a.order_in_module || 0) - (b.order_in_module || 0))
      );

      setAvailablePages(allPages.filter((page) => !page.module_id));
    };
    fetchData();
  }, [id]);

  const handleUpdate = async () => {
    await modulesApi.update(id, {
      ...module,
      title,
      published,
    });
    navigate("/modules");
  };

  const handleAddPage = async (pageId) => {
    const page = await pagesApi.getById(pageId);
    const maxOrder = modulePages.reduce(
      (max, p) => (p.order_in_module > max ? p.order_in_module : max),
      0
    );

    await pagesApi.update(pageId, {
      ...page,
      module_id: id,
      order_in_module: maxOrder + 1,
    });

    setModulePages([
      ...modulePages,
      { ...page, module_id: id, order_in_module: maxOrder + 1 },
    ]);
    setAvailablePages(availablePages.filter((p) => p.id !== pageId));
  };

  const handleRemovePage = async (pageId) => {
    const page = await pagesApi.getById(pageId);
    await pagesApi.update(pageId, {
      ...page,
      module_id: null,
      order_in_module: null,
    });

    setModulePages(modulePages.filter((p) => p.id !== pageId));
    setAvailablePages([
      ...availablePages,
      { ...page, module_id: null, order_in_module: null },
    ]);
  };

  const handleMovePageUp = async (index) => {
    if (index === 0) return;

    const currentPage = modulePages[index];
    const previousPage = modulePages[index - 1];

    await pagesApi.update(currentPage.id, {
      ...currentPage,
      order_in_module: currentPage.order_in_module - 1,
    });
    await pagesApi.update(previousPage.id, {
      ...previousPage,
      order_in_module: previousPage.order_in_module + 1,
    });

    const updatedModulePages = [...modulePages];
    updatedModulePages[index] = {
      ...currentPage,
      order_in_module: currentPage.order_in_module - 1,
    };
    updatedModulePages[index - 1] = {
      ...previousPage,
      order_in_module: previousPage.order_in_module + 1,
    };

    setModulePages(
      updatedModulePages.sort((a, b) => a.order_in_module - b.order_in_module)
    );
  };

  const handleMovePageDown = async (index) => {
    if (index === modulePages.length - 1) return;

    const currentPage = modulePages[index];
    const nextPage = modulePages[index + 1];

    await pagesApi.update(currentPage.id, {
      ...currentPage,
      order_in_module: currentPage.order_in_module + 1,
    });
    await pagesApi.update(nextPage.id, {
      ...nextPage,
      order_in_module: nextPage.order_in_module - 1,
    });

    const updatedModulePages = [...modulePages];
    updatedModulePages[index] = {
      ...currentPage,
      order_in_module: currentPage.order_in_module + 1,
    };
    updatedModulePages[index + 1] = {
      ...nextPage,
      order_in_module: nextPage.order_in_module - 1,
    };

    setModulePages(
      updatedModulePages.sort((a, b) => a.order_in_module - b.order_in_module)
    );
  };

  if (!module) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Edit Module
      </Typography>
      <TextField
        label="Module Title"
        fullWidth
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
        }
        label="Published"
      />
      <div style={{ marginTop: "16px" }}>
        <Button variant="contained" onClick={handleUpdate}>
          Update Module
        </Button>
      </div>

      <Typography variant="h5" gutterBottom style={{ marginTop: "20px" }}>
        Module Pages
      </Typography>
      <List>
        {modulePages.map((page, index) => (
          <ListItem key={page.id}>
            <ListItemText primary={page.title} secondary={page.page_type} />
            <Button
              size="small"
              onClick={() => handleMovePageUp(index)}
              disabled={index === 0}
            >
              Up
            </Button>
            <Button
              size="small"
              onClick={() => handleMovePageDown(index)}
              disabled={index === modulePages.length - 1}
            >
              Down
            </Button>
            <Button
              size="small"
              color="secondary"
              onClick={() => handleRemovePage(page.id)}
            >
              Remove
            </Button>
          </ListItem>
        ))}
      </List>

      <Typography variant="h5" gutterBottom style={{ marginTop: "20px" }}>
        Add Pages to Module
      </Typography>
      <List>
        {availablePages.map((page) => (
          <ListItem key={page.id}>
            <ListItemText primary={page.title} secondary={page.page_type} />
            <Button size="small" onClick={() => handleAddPage(page.id)}>
              Add
            </Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default EditModule;
