import React, { useState, useEffect } from "react";
import { useApi } from "../apiV3";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { ListItem, ListItemText, Button, Typography } from "@mui/material";

const ModuleItem = ({ moduleItem }) => {
  const { user } = useAuth();
  const [itemData, setItemData] = useState(null);
  const progressApi = useApi("progress");
  const [progress, setProgress] = useState(null);

  const itemApi = useApi(moduleItem.item_type.toLowerCase() + "s");

  useEffect(() => {
    const fetchItemData = async () => {
      const data = await itemApi.getById(moduleItem.item_id);
      setItemData(data);
    };

    const fetchProgress = async () => {
      const prog = await progressApi.getByField(
        "module_item_id",
        moduleItem.id
      );
      const userProgress = prog.find((p) => p.user_id === user.id);
      setProgress(userProgress);
    };

    fetchItemData();
    if (user && user.userType === "Student") {
      fetchProgress();
    }
  }, [moduleItem]);

  if (!itemData) {
    return null;
  }

  const renderStatus = () => {
    if (progress) {
      return (
        <Typography variant="body2" color="textSecondary">
          Status: {progress.status}
        </Typography>
      );
    } else {
      return (
        <Typography variant="body2" color="textSecondary">
          Status: Not Started
        </Typography>
      );
    }
  };

  return (
    <ListItem>
      <ListItemText
        primary={
          <Link
            to={`/${moduleItem.item_type.toLowerCase()}s/${itemData.id}`}
            style={{ textDecoration: "none" }}
          >
            {itemData.title}
          </Link>
        }
        secondary={
          <>
            {itemData.points && (
              <Typography variant="body2" color="textSecondary">
                {itemData.points} pts
              </Typography>
            )}
            {renderStatus()}
          </>
        }
      />
    </ListItem>
  );
};

export default ModuleItem;
