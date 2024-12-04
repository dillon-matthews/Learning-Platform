import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../../apiV3";
import {
  Container,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const EditPage = () => {
  const { id } = useParams();
  const pagesApi = useApi("pages");
  const pageTypesApi = useApi("page_types");
  const modulesApi = useApi("modules");
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pageType, setPageType] = useState("");
  const [pageTypes, setPageTypes] = useState([]);
  const [newPageType, setNewPageType] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const [moduleId, setModuleId] = useState("");
  const [modules, setModules] = useState([]);
  const [orderInModule, setOrderInModule] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const pageData = await pagesApi.getById(id);
      if (pageData) {
        setTitle(pageData.title);
        setContent(pageData.content);
        setPageType(pageData.page_type);
        setModuleId(pageData.module_id || "");
        setOrderInModule(pageData.order_in_module || "");
      }

      const types = await pageTypesApi.getAll();
      setPageTypes(types);

      const modulesData = await modulesApi.getAll();
      setModules(modulesData);
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let finalPageType = pageType;

    if (pageType === "AddNewType") {
      finalPageType = newPageType;
      await pageTypesApi.create({ type: newPageType });
      setPageTypes([...pageTypes, { type: newPageType }]);
    }

    const pageData = {
      title,
      content,
      page_type: finalPageType,
      module_id: moduleId || null,
      order_in_module: moduleId ? Number(orderInModule) : null,
    };

    await pagesApi.update(id, pageData);

    navigate("/pages");
  };

  const handleAddNewType = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setNewPageType("");
    setPageType("");
  };

  const handleModalSave = async () => {
    await pageTypesApi.create({ type: newPageType });
    setPageTypes([...pageTypes, { type: newPageType }]);
    setPageType(newPageType);
    setOpenModal(false);
    setNewPageType("");
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Edit Page
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Page Type</InputLabel>
          <Select
            value={pageType}
            onChange={(e) => {
              if (e.target.value === "AddNewType") {
                handleAddNewType();
              } else {
                setPageType(e.target.value);
              }
            }}
            required
          >
            {pageTypes.map((type) => (
              <MenuItem key={type.type} value={type.type}>
                {type.type}
              </MenuItem>
            ))}
            <MenuItem value="AddNewType">+ Add New Page Type</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Module</InputLabel>
          <Select
            value={moduleId}
            onChange={(e) => setModuleId(e.target.value)}
          >
            <MenuItem value="">No Module</MenuItem>
            {modules.map((module) => (
              <MenuItem key={module.id} value={module.id}>
                {module.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {moduleId && (
          <TextField
            label="Order in Module"
            type="number"
            fullWidth
            margin="normal"
            value={orderInModule}
            onChange={(e) => setOrderInModule(e.target.value)}
          />
        )}
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
          type="submit"
          fullWidth
          style={{ marginTop: "16px" }}
        >
          Update Page
        </Button>
      </form>

      <Dialog open={openModal} onClose={handleModalClose}>
        <DialogTitle>Add New Page Type</DialogTitle>
        <DialogContent>
          <TextField
            label="New Page Type"
            fullWidth
            margin="normal"
            value={newPageType}
            onChange={(e) => setNewPageType(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>Cancel</Button>
          <Button onClick={handleModalSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EditPage;
