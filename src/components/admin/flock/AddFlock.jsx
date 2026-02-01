import { useState } from "react";
import { storageService } from "../../../services/storageService";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import {
  Close,
  CloudUpload,
  Info,
  MedicalServices,
  Photo,
} from "@mui/icons-material";
import { flockService } from "../../../services/flockService";
import { useAuth } from "../../../context/AuthContext";

export default function AddBirds({ onCancel }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    age:0,
    batchNumber: "",
    location: "",
    breed: "",
    type: "layer",
    quantity: 0,
    dateReceived: 0,
    healthStatus: "healthy",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const {userData,currentUser}  = useAuth()
  const handleClick = () => {
    document.getElementById("file-input").click();
  };
  const handleDragOver = (event) => {
    event.preventDefault();
  };
  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };
  const generatePreview = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const validateAndSetFile = (file) => {
    try {
      const validTypes = ["image/png", "image/jpeg", "image/jpg"];
      const maxSize = 10 * 1024 * 1024;
      if (!validTypes.includes(file.type)) {
        alert(
          `${file.name} is not a valid file type. Only PNG, JPG, and PDF are allowed.`
        );
        return false;
      }
      if (file.size > maxSize) {
        alert(`${file.name} exceeds the 10MB limit.`);
        return false;
      }
      setSelectedFile(file);
      generatePreview(file);
      return true;
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      validateAndSetFile(files[0]);
    }
    event.target.value = "";
  };
  const validateForm = () => {
    const newErrors = {};

    if (!formData.batchNumber.trim()) {
      newErrors.batchNumber = "Batch number is required";
    }

    if (!formData.location) {
      newErrors.location = "Please select a location";
    }
    if (!formData.breed.trim()) {
      newErrors.breed = "Breed is required";
    }
    if (formData.quantity <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
    }
    if (!formData.dateReceived) {
      newErrors.dateReceived = "Date received is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const uploadFile = async () => {
    setUploading(true);
    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}_${selectedFile.name}`;
      const path = `uploads/${fileName}`;
      const downloadURL = await storageService.uploadFile(selectedFile, path);
      const uploadedFile = {
        name: selectedFile.name,
        url: downloadURL,
        path: path,
      };
      console.log("File uploaded successfully:", uploadedFile);
      alert("Upload successful!");
      setSelectedFile(null);
      setImagePreviewUrl(null);
      return uploadedFile;
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };
  const removeFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    setImagePreviewUrl(null);
  };
  const handleInputChange = (field,value) => {
    setFormData((prev) => ({
      ...prev,
      [field]:value
    }))
    setErrors((prev) => ({
      ...prev,
      [field]:''
    }))
  }
  const handleSubmit = async () => {
  if (!validateForm()) {
    setSubmitError("Please fix the errors above");
    return;
  }

  setLoading(true);
  setSubmitError("");

  try {
    // let imageUrl = null;

    // if (selectedFile) {
    //   const timestamp = Date.now();
    //   const fileName = `${timestamp}_${selectedFile.name}`;
    //   const path = `flocks/${fileName}`;
    //   imageUrl = await storageService.uploadFile(selectedFile, path);
    // }

    const flockData = {
      batchNumber: formData.batchNumber.trim(),
      location: formData.location,
      breed: formData.breed.trim(),
      type: formData.type,
      quantity: formData.quantity,
      dateReceived: formData.dateReceived,
      ageInWeeks: formData.age,
      healthStatus: formData.healthStatus,
      notes: formData.notes.trim(),
      // imageUrl: imageUrl,
      submittedBy: currentUser.id,// TODO: Get from auth context
    };

    const flockId = await flockService.createFlock(flockData);

    console.log("Flock created successfully:", flockId);
    setSuccessMessage("Flock created successfully!");
    setTimeout(() => {
      if (onCancel) {
        onCancel(); 
      } else {
        setFormData({
          batchNumber: "",
          location: "",
          breed: "",
          type: "layer",
          quantity: 0,
          dateReceived: "",
          ageInWeeks: 0,
          healthStatus: "healthy",
          notes: "",
        });
        setSelectedFile(null);
        setImagePreviewUrl(null);
      }
    }, 2000);

  } catch (error) {
    console.error("Error creating flock:", error);
    setSubmitError(error.message || "Failed to create flock");
  } finally {
    setLoading(false);
  }
};


  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      sx={{
        px: 4,
        py: 3,
        bgcolor: "#fafafa",
        minHeight: "100%",
        gap: 4,
      }}
    >
      <Box>
        <Typography
          sx={{
            fontSize: 25,
            fontWeight: 700,
            color: "black",
            mb: 0.5,
          }}
        >
          Add New Bird Entry
        </Typography>
        <Typography sx={{ fontSize: 16, color: "primary.light" }}>
          Complete the details below to register a new bird batch into the farm
          inventory
        </Typography>
      </Box>
      {/* Error Message */}
{submitError && (
  <Alert severity="error" onClose={() => setSubmitError("")}>
    {submitError}
  </Alert>
)}

{/* Success Message */}
{successMessage && (
  <Alert severity="success" onClose={() => setSuccessMessage("")}>
    {successMessage}
  </Alert>
)}
      <Card>
        <CardHeader
          title={
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "grey.200",
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Info color="primary" fontSize="small" />
              </Box>

              <Typography variant="h5">Basic Information</Typography>
            </Box>
          }
        />

        <CardContent>
          <Box
            display="grid"
            gridTemplateColumns="1fr 1fr"
            columnGap={3}
            rowGap={4}
          >
            <Box>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontWeight: 500, color: "text.primary" }}
              >
                Batch Number
              </Typography>
              <TextField
                placeholder="e.g. BATCH-2023-001"
                defaultValue={""}
                value={formData.batchNumber}
                fullWidth
                size="small"
                onChange={(e) =>
                  handleInputChange("batchNumber", e.target.value)
                }
              />
            </Box>

            <Box>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontWeight: 500, color: "text.primary" }}
              >
                Pen/House Location
              </Typography>
              <TextField
                select
                fullWidth
                defaultValue=""
                size="small"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              >
                <MenuItem value="">Select Location</MenuItem>
                <MenuItem value="pen-a1">Pen A1</MenuItem>
                <MenuItem value="pen-a2">Pen A2</MenuItem>
                <MenuItem value="pen-b1">Pen B1</MenuItem>
                <MenuItem value="pen-b2">Pen B2</MenuItem>
                <MenuItem value="house-1">House 1</MenuItem>
                <MenuItem value="house-2">House 2</MenuItem>
              </TextField>
            </Box>

            <Box>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontWeight: 500, color: "text.primary" }}
              >
                Breed
              </Typography>
              <TextField
                placeholder="e.g. Rhode Island Red"
                fullWidth
                size="small"
                value={formData.breed}
                onChange={(e) => handleInputChange("breed", e.target.value)}
              />
            </Box>

            <Box>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontWeight: 500, color: "text.primary" }}
              >
                Quantity
              </Typography>
              <TextField
                type="number"
                fullWidth
                defaultValue={0}
                size="small"
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
              />
            </Box>

            <Box>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontWeight: 500, color: "text.primary" }}
              >
                Date Received
              </Typography>
              <TextField
                type="date"
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                value={formData.dateReceived}
                onChange={(e) =>
                  handleInputChange("dateReceived", e.target.value)
                }
              />
            </Box>

            <Box>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontWeight: 500, color: "text.primary" }}
              >
                Age (Weeks)
              </Typography>
              <TextField
                type="number"
                fullWidth
                defaultValue={0}
                size="small"
                value={formData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
              />
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontWeight: 500, color: "text.primary" }}
              >
                Bird Type
              </Typography>
              <TextField
                select
                fullWidth
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                size="small"
                sx={{
                  gridRow: "span 2",
                }}
              >
                <MenuItem value="layer">Layer (Eggs)</MenuItem>
                <MenuItem value="broiler">Broiler (Meat)</MenuItem>
              </TextField>
            </Box>
          </Box>
        </CardContent>
      </Card>
      <Card>
        <CardHeader
          title={
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "grey.200",
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MedicalServices color="primary" fontSize="small" />
              </Box>

              <Typography variant="h5">Health Information</Typography>
            </Box>
          }
        />

        <CardContent
          sx={{
            mt: 1,
          }}
        >
          <Box display={"flex"} flexDirection={"column"}>
            <FormControl>
              <FormLabel
                sx={{
                  fontSize: "medium",
                  color: "black",
                  fontWeight: 600,
                }}
              >
                Health Status
              </FormLabel>

              <RadioGroup
                defaultValue="healthy"
                sx={{
                  display: "flex",
                  gap: 1,
                  flexDirection: "row",
                }}
                value={formData.healthStatus}
                onChange={(e) =>
                  handleInputChange("healthStatus", e.target.value)
                }
              >
                <FormControlLabel
                  value="sick"
                  control={<Radio />}
                  label="Sick"
                />
                <FormControlLabel
                  value="healthy"
                  control={<Radio />}
                  label="Healthy"
                />
                <FormControlLabel
                  value="quarantine"
                  control={<Radio />}
                  label="Quarantine"
                />
              </RadioGroup>
            </FormControl>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontSize: "medium",
                  color: "black",
                  fontWeight: 600,
                  mt: 2,
                  mb: 1,
                }}
              >
                Notes
              </Typography>
              <TextField
                label="Additional observations or notes about this batch."
                multiline
                rows={3}
                fullWidth
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>
      <Card>
        <CardHeader
          title={
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "grey.200",
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Photo color="primary" fontSize="small" />
              </Box>
              <Typography variant="h5">Upload Images</Typography>
            </Box>
          }
        />
        <CardContent>
          <input
            id="file-input"
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />

          <Box
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            sx={{
              border: "2px dashed",
              borderColor: "grey.300",
              borderRadius: 2,
              padding: 6,
              textAlign: "center",
              cursor: "pointer",
              "&:hover": {
                borderColor: "grey.400",
                bgcolor: "grey.50",
              },
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                bgcolor: "grey.100",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <CloudUpload sx={{ color: "success.main", fontSize: 24 }} />
            </Box>
            <Typography variant="body1" fontWeight={500} gutterBottom>
              Click to upload or drag and drop
            </Typography>
            <Typography variant="body2" color="text.secondary">
              PNG or JPG (max. 10MB)
            </Typography>
          </Box>

          {selectedFile && (
            <Box mt={3}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Selected file:
              </Typography>

              {imagePreviewUrl && (
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    maxWidth: 400,
                    mx: "auto",
                    mb: 2,
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "grey.300",
                  }}
                >
                  <img
                    src={imagePreviewUrl}
                    alt="Preview"
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                    }}
                  />
                </Box>
              )}

              {/* File Info */}
              <Box
                sx={{
                  bgcolor: "grey.50",
                  borderRadius: 1,
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {selectedFile.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={removeFile}
                  disabled={uploading}
                >
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
      <Box
        display={"flex"}
        alignItems={"center"}
        gap={2}
        justifyContent={"end"}
      >
        <Button
          variant="text"
          size="large"
          disabled={loading}
          sx={{
            "&:hover": {
              color: "text.primary",
            },
          }}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </Box>
    </Box>
  );
}
