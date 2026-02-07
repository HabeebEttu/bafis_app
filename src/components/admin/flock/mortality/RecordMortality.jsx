import { Close, CloudUpload, Warning } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import React, { useState } from "react";

export default function RecordMortality() {
  const [formData, setFormData] = useState({
    date: "2023-10-27",
    batchId: "",
    quantity: "",
    reason: "",
    observation: "",
    file: null,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleChange("file", file);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
        bgcolor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          flexDirection: "column",
          maxWidth: 500,
          width: "100%",
          bgcolor: "white",
          borderRadius: 2,
        }}
      >
        <Box sx={{ px: 3, py: 2.5 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h6" fontWeight={600} color="text.primary">
                Record New Mortality Event
              </Typography>
              <Typography variant="body2" color="success.main" fontSize={13}>
                Fill in the details to log bird mortality for analytics.
              </Typography>
            </Box>
            <IconButton size="small" sx={{ color: "text.secondary" }}>
              <Close fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Divider />

        <Box sx={{ px: 3, py: 3 }}>
          <Box display="flex" gap={2} mb={3}>
            <FormGroup
              label="Date of Event"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              fullWidth
            />
            <FormSelect
              label="Select Batch"
              value={formData.batchId}
              onChange={(e) => handleChange("batchId", e.target.value)}
              placeholder="Search and select bird batch..."
            />
          </Box>

          <Box display="flex" gap={2} mb={3}>
            <FormGroup
              label="Quantity Lost"
              type="number"
              value={formData.quantity}
              placeholder="0"
              onChange={(e) => handleChange("quantity", e.target.value)}
              fullWidth
            />
            <FormSelect
              label="Reason/Cause"
              value={formData.reason}
              onChange={(e) => handleChange("reason", e.target.value)}
              placeholder="Select reason"
                          showAddButton
                          children={<>
                              <MenuItem>
                              Disease
                              </MenuItem>
                          </>}
            />
          </Box>

          <Box mb={3}>
            <Typography
              fontSize={14}
              fontWeight={600}
              mb={1}
              color="text.primary"
            >
              Detailed Observation
            </Typography>
            <TextField
              multiline
              rows={3}
              fullWidth
              placeholder="Describe clinical signs, environment conditions, or findings..."
              value={formData.observation}
              onChange={(e) => handleChange("observation", e.target.value)}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontSize: 14,
                },
              }}
            />
          </Box>

          <Box mb={3}>
            <Typography
              fontSize={14}
              fontWeight={600}
              mb={1}
              color="text.primary"
            >
              Vet Report or Bird Evidence
            </Typography>
            <Box
              sx={{
                border: "2px dashed #e0e0e0",
                borderRadius: 1,
                bgcolor: "#fafff7",
                p: 4,
                textAlign: "center",
                cursor: "pointer",
                "&:hover": {
                  bgcolor: "#f5fff0",
                },
              }}
              onClick={() => document.getElementById("file-upload").click()}
            >
              <input
                id="file-upload"
                type="file"
                hidden
                accept=".png,.jpg,.jpeg,.pdf"
                onChange={handleFileUpload}
              />
              <CloudUpload
                sx={{ fontSize: 40, color: "success.main", mb: 1 }}
              />
              <Typography variant="body2" color="text.primary">
                Click to upload or drag and drop
              </Typography>
              <Typography variant="caption" color="text.secondary">
                PNG, JPG or PDF files, 10MB
              </Typography>
            </Box>
          </Box>

          <Alert
            severity="warning"
            icon={<Warning />}
            sx={{
              mb: 3,
              bgcolor: "#fff8e1",
              "& .MuiAlert-message": {
                fontSize: 13,
                },
              borderColor:'secondary.main'
            }}
          >
            This action will permanently reduce the batch count. Please ensure
            the quantity and batch selection are accurate before logging.
          </Alert>

          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button variant="outlined" sx={{ textTransform: "none" }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<CloudUpload />}
              sx={{
                textTransform: "none",
                bgcolor: "#f57c00",
                "&:hover": {
                  bgcolor: "#ef6c00",
                },
              }}
            >
              Log Mortality
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

function FormGroup({
  label,
  type = "text",
  value,
  placeholder = "",
  onChange,
  fullWidth,
}) {
  return (
    <Box
          //   sx={{ flex: fullWidth ? 1 : undefined, minWidth: fullWidth ? 0 : 200 }}
          sx={{
              width:'50%'
          }}
    >
      <Typography fontSize={14} fontWeight={600} mb={1} color="text.primary">
        {label}
      </Typography>
      <TextField
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        fullWidth
        size="small"
        variant="outlined"
        sx={{
          "& .MuiOutlinedInput-root": {
            fontSize: 14,
          },
        }}
      />
    </Box>
  );
}

function FormSelect({ label, value, onChange, placeholder,children }) {
  return (
    <Box sx={{ width:'50%' }}>
      <Typography fontSize={14} fontWeight={600} mb={1} color="text.primary">
        {label}
      </Typography>
      <Box display="flex" gap={1}>
        <Select
          value={value}
          onChange={onChange}
          displayEmpty
          fullWidth
          size="small"
          sx={{
            fontSize: 14,
            "& .MuiSelect-select": {
              color: value ? "text.primary" : "text.secondary",
            },
          }}
        >
          <MenuItem value="" disabled>
            {placeholder}
          </MenuItem>
          {children}
        </Select>
      
      </Box>
    </Box>
  );
}
