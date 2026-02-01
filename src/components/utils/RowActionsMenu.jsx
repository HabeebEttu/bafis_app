import React, { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreHoriz,
} from "@mui/icons-material";

const RowActionsMenu = ({ row, onAction }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);


  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    if (event) {
      event.stopPropagation();
    }
    setAnchorEl(null);
  };

  const handleAction = (action, event) => {
    event.stopPropagation();
    handleClose(event);
    if (onAction) {
      onAction(action, row);
    }
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleClick}
        sx={{
          color: "#9CA3AF",
          "&:hover": {
            backgroundColor: "#F3F4F6",
          },
        }}
      >
        <MoreHoriz />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          "& .MuiPaper-root": {
            minWidth: 200,
            borderRadius: 2,
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },
        }}
      >
        <MenuItem
          onClick={(e) => handleAction("view", e)}
          sx={{
            fontSize: "0.875rem",
            py: 1,
            "&:hover": {
              backgroundColor: "#F9FAFB",
            },
          }}
        >
          <ListItemIcon>
            <ViewIcon fontSize="small" sx={{ color: "#6B7280" }} />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={(e) => handleAction("edit", e)}
          sx={{
            fontSize: "0.875rem",
            py: 1,
            "&:hover": {
              backgroundColor: "#F9FAFB",
            },
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" sx={{ color: "#6B7280" }} />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        {/* <MenuItem
          onClick={(e) => handleAction("duplicate", e)}
          sx={{
            fontSize: "0.875rem",
            py: 1,
            "&:hover": {
              backgroundColor: "#F9FAFB",
            },
          }}
        >
          <ListItemIcon>
            <DuplicateIcon fontSize="small" sx={{ color: "#6B7280" }} />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem
          onClick={(e) => handleAction("download", e)}
          sx={{
            fontSize: "0.875rem",
            py: 1,
            "&:hover": {
              backgroundColor: "#F9FAFB",
            },
          }}
        >
          <ListItemIcon>
            <DownloadIcon fontSize="small" sx={{ color: "#6B7280" }} />
          </ListItemIcon>
          <ListItemText>Download Report</ListItemText>
        </MenuItem>

        {/* Print *//*}
        <MenuItem
          onClick={(e) => handleAction("print", e)}
          sx={{
            fontSize: "0.875rem",
            py: 1,
            "&:hover": {
              backgroundColor: "#F9FAFB",
            },
          }}
        >
          <ListItemIcon>
            <PrintIcon fontSize="small" sx={{ color: "#6B7280" }} />
          </ListItemIcon>
          <ListItemText>Print</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={(e) => handleAction("share", e)}
          sx={{
            fontSize: "0.875rem",
            py: 1,
            "&:hover": {
              backgroundColor: "#F9FAFB",
            },
          }}
        >
          <ListItemIcon>
            <ShareIcon fontSize="small" sx={{ color: "#6B7280" }} />
          </ListItemIcon>
          <ListItemText>Share</ListItemText>
        </MenuItem> 
        */}

        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={(e) => handleAction("delete", e)}
          sx={{
            fontSize: "0.875rem",
            py: 1,
            color: "#DC2626",
            "&:hover": {
              backgroundColor: "#FEE2E2",
            },
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: "#DC2626" }} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default RowActionsMenu;
