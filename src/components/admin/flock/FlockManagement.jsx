import { Close, Filter, Search } from "@mui/icons-material";
import { Alert, Box, Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, IconButton, InputAdornment, MenuItem, Paper, Popover, Select, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  FileDownload as ExportIcon,
} from "@mui/icons-material";
import CustomPagination from "../../utils/CustomPagination";
import RowActionsMenu from "../../utils/RowActionsMenu";

export default function FlockManagement({ navToAdd, navToEdit }) {
  const [searchQuery, setSearchQuery] = useState("");

  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  const [filters, setFilters] = useState({
    status: {
      approved: false,
      pending: false,
    },
    breedType: {
      "Rhode Island Red": false,
      "White Leghorn": false,
      "Plymouth Rock": false,
      Sussex: false,
    },
    quantityMin: "",
    quantityMax: "",
    location: "",
  });

  const batchData = [
    {
      id: "#B-2023-042",
      breedType: "Rhode Island Red",
      breedColor: "#F59E0B",
      quantity: 1250,
      currentAge: "14 Days",
      location: "House A-01",
      status: "Approved",
    },
    {
      id: "#B-2023-045",
      breedType: "White Leghorn",
      breedColor: "#9CA3AF",
      quantity: 2100,
      currentAge: "8 Weeks",
      location: "House B-04",
      status: "Pending",
    },
    {
      id: "#B-2023-046",
      breedType: "Plymouth Rock",
      breedColor: "#EF4444",
      quantity: 850,
      currentAge: "4 Days",
      location: "Quarantine 1",
      status: "Approved",
    },
    {
      id: "#B-2023-047",
      breedType: "Sussex",
      breedColor: "#F97316",
      quantity: 1500,
      currentAge: "12 Weeks",
      location: "House C-02",
      status: "Approved",
    },
  ];
  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const isFilterOpen = Boolean(filterAnchorEl);

  const handleCheckboxChange = (category, name) => {
    setFilters((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [name]: !prev[category][name],
      },
    }));
  };
  const handleQuantityChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLocationChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      location: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      status: {
        approved: false,
        pending: false,
      },
      breedType: {
        "Rhode Island Red": false,
        "White Leghorn": false,
        "Plymouth Rock": false,
        Sussex: false,
      },
      quantityMin: "",
      quantityMax: "",
      location: "",
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  useEffect(() => {
    setPage(0);
  }, [filters, searchQuery]);

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    row: null,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleRowAction = (action, row) => {
    console.log(`Action: ${action}`, row);

    switch (action) {
      case "view":
        handleViewDetails(row);
        break;
      case "edit":
        handleEdit(row);
        break;
      case "duplicate":
        handleDuplicate(row);
        break;
      case "download":
        handleDownload(row);
        break;
      case "print":
        handlePrint(row);
        break;
      case "share":
        handleShare(row);
        break;
      case "delete":
        setDeleteDialog({ open: true, row });
        break;
      default:
        console.log("Unknown action:", action);
    }
  };

  const handleViewDetails = (row) => {
    navToEdit();
    setSnackbar({
      open: true,
      message: `Viewing details for ${row.id}`,
      severity: "info",
    });
  };

  // Edit
  const handleEdit = (row) => {
    setSnackbar({
      open: true,
      message: `Editing ${row.id}`,
      severity: "info",
    });
  };

  // Duplicate
  const handleDuplicate = (row) => {
    // TODO: Create a copy of the batch
    setSnackbar({
      open: true,
      message: `Duplicated ${row.id}`,
      severity: "success",
    });
  };

  const handleDownload = (row) => {
    setSnackbar({
      open: true,
      message: `Downloading report for ${row.id}`,
      severity: "info",
    });
    // TODO: Generate and download PDF/CSV report
  };

  // Print
  const handlePrint = (row) => {
    setSnackbar({
      open: true,
      message: `Preparing print view for ${row.id}`,
      severity: "info",
    });
  };

  // Share
  const handleShare = (row) => {
    setSnackbar({
      open: true,
      message: `Share link copied for ${row.id}`,
      severity: "success",
    });
  };

  // Delete (confirmed)
  const handleDeleteConfirm = () => {
    const row = deleteDialog.row;

    setSnackbar({
      open: true,
      message: `${row.id} has been deleted`,
      severity: "success",
    });

    setDeleteDialog({ open: false, row: null });
  };

  // Close delete dialog
  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, row: null });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const hasActiveFilters = () => {
    const hasStatusFilter = Object.values(filters.status).some((val) => val);
    const hasBreedFilter = Object.values(filters.breedType).some((val) => val);
    const hasQuantityFilter =
      filters.quantityMin !== "" || filters.quantityMax !== "";
    const hasLocationFilter = filters.location !== "";

    return (
      hasStatusFilter ||
      hasBreedFilter ||
      hasQuantityFilter ||
      hasLocationFilter
    );
  };

  const getFilteredData = () => {
    return batchData.filter((row) => {
      const matchesSearch =
        row.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.breedType.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      const statusFilters = filters.status;
      const hasStatusFilter = Object.values(statusFilters).some((val) => val);
      if (hasStatusFilter) {
        const statusMatch =
          (statusFilters.approved && row.status === "Approved") ||
          (statusFilters.pending && row.status === "Pending");
        if (!statusMatch) return false;
      }

      // Filter by breed type
      const breedFilters = filters.breedType;
      const hasBreedFilter = Object.values(breedFilters).some((val) => val);
      if (hasBreedFilter) {
        if (!breedFilters[row.breedType]) return false;
      }

      // Filter by quantity range
      if (filters.quantityMin !== "") {
        const minQuantity = parseInt(filters.quantityMin);
        if (row.quantity < minQuantity) return false;
      }
      if (filters.quantityMax !== "") {
        const maxQuantity = parseInt(filters.quantityMax);
        if (row.quantity > maxQuantity) return false;
      }
      if (filters.location !== "") {
        if (!row.location.includes(filters.location)) return false;
      }

      return true;
    });
  };
  const filteredData = getFilteredData();
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return { bg: "#D1FAE5", color: "#065F46" };
      case "pending":
        return { bg: "#FEF3C7", color: "#92400E" };
      default:
        return { bg: "#E5E7EB", color: "#1F2937" };
    }
  };

  const uniqueLocations = [...new Set(batchData.map((item) => item.location))];
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
          Bird Records
        </Typography>
        <Typography sx={{ fontSize: 16, color: "primary.light" }}>
          Monitor and manage your bird popuation accross all batches.
        </Typography>
      </Box>
      <Box sx={{ width: "100%", p: 3, pl: 0, backgroundColor: "#FAFAFA" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            px: 1,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <TextField
              placeholder="Search batch or breed..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              sx={{
                width: 280,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#FFFFFF",
                  borderRadius: 1.5,
                  fontSize: "0.875rem",
                  "& fieldset": {
                    borderColor: "#E5E7EB",
                  },
                  "&:hover fieldset": {
                    borderColor: "#D1D5DB",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#9CA3AF",
                    borderWidth: "1px",
                  },
                },
                "& .MuiInputBase-input": {
                  padding: "8px 12px",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "#9CA3AF", fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ position: "relative" }}>
              <Button
                variant="outlined"
                startIcon={<Filter sx={{ fontSize: 18 }} />}

                onClick={handleFilterClick}
                sx={{
                  textTransform: "none",
                  color: "#374151",
                  borderColor: hasActiveFilters() ? "#3B82F6" : "#E5E7EB",
                  backgroundColor: hasActiveFilters() ? "#EFF6FF" : "#FFFFFF",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  px: 2,
                  py: 0.75,
                  borderRadius: 1.5,
                  "&:hover": {
                    borderColor: hasActiveFilters() ? "#2563EB" : "#D1D5DB",
                    backgroundColor: hasActiveFilters() ? "#DBEAFE" : "#F9FAFB",
                  },
                }}
              >
                Filter
              </Button>
              {hasActiveFilters() && (
                <Box
                  sx={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "#3B82F6",
                  }}
                />
              )}
            </Box>

            <Popover
              open={isFilterOpen}
              anchorEl={filterAnchorEl}
              onClose={handleFilterClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              sx={{
                mt: 1,
              }}
            >
              <Box sx={{ width: 320, p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontSize: "1rem", fontWeight: 600 }}
                  >
                    Filter Batches
                  </Typography>
                  <IconButton size="small" onClick={handleFilterClose}>
                    <Close fontSize="small" />
                  </IconButton>
                </Box>

                <Divider sx={{ mb: 2 }} />
                <FormControl component="fieldset" sx={{ mb: 3, width: "100%" }}>
                  <FormLabel
                    component="legend"
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#374151",
                      mb: 1,
                    }}
                  >
                    Status
                  </FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.status.approved}
                          onChange={() =>
                            handleCheckboxChange("status", "approved")
                          }
                          size="small"
                        />
                      }
                      label={
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography sx={{ fontSize: "0.875rem" }}>
                            Approved
                          </Typography>
                          <Chip
                            label="Approved"
                            size="small"
                            sx={{
                              backgroundColor: "#D1FAE5",
                              color: "#065F46",
                              height: 20,
                              fontSize: "0.7rem",
                            }}
                          />
                        </Box>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.status.pending}
                          onChange={() =>
                            handleCheckboxChange("status", "pending")
                          }
                          size="small"
                        />
                      }
                      label={
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography sx={{ fontSize: "0.875rem" }}>
                            Pending
                          </Typography>
                          <Chip
                            label="Pending"
                            size="small"
                            sx={{
                              backgroundColor: "#FEF3C7",
                              color: "#92400E",
                              height: 20,
                              fontSize: "0.7rem",
                            }}
                          />
                        </Box>
                      }
                    />
                  </FormGroup>
                </FormControl>

                <Divider sx={{ mb: 2 }} />

                <FormControl component="fieldset" sx={{ mb: 3, width: "100%" }}>
                  <FormLabel
                    component="legend"
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#374151",
                      mb: 1,
                    }}
                  >
                    Breed Type
                  </FormLabel>
                  <FormGroup>
                    {Object.keys(filters.breedType).map((breed) => (
                      <FormControlLabel
                        key={breed}
                        control={
                          <Checkbox
                            checked={filters.breedType[breed]}
                            onChange={() =>
                              handleCheckboxChange("breedType", breed)
                            }
                            size="small"
                          />
                        }
                        label={
                          <Typography sx={{ fontSize: "0.875rem" }}>
                            {breed}
                          </Typography>
                        }
                      />
                    ))}
                  </FormGroup>
                </FormControl>

                <Divider sx={{ mb: 2 }} />

                <FormControl sx={{ mb: 3, width: "100%" }}>
                  <FormLabel
                    component="legend"
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#374151",
                      mb: 1,
                    }}
                  >
                    Quantity Range
                  </FormLabel>
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <TextField
                      type="number"
                      placeholder="Min"
                      value={filters.quantityMin}
                      onChange={(e) =>
                        handleQuantityChange("quantityMin", e.target.value)
                      }
                      size="small"
                      sx={{ flex: 1 }}
                    />
                    <Typography sx={{ color: "#6B7280" }}>-</Typography>
                    <TextField
                      type="number"
                      placeholder="Max"
                      value={filters.quantityMax}
                      onChange={(e) =>
                        handleQuantityChange("quantityMax", e.target.value)
                      }
                      size="small"
                      sx={{ flex: 1 }}
                    />
                  </Box>
                </FormControl>

                <Divider sx={{ mb: 2 }} />

                <FormControl sx={{ mb: 3, width: "100%" }}>
                  <FormLabel
                    component="legend"
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#374151",
                      mb: 1,
                    }}
                  >
                    Location
                  </FormLabel>
                  <Select
                    value={filters.location}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    size="small"
                    displayEmpty
                    sx={{ fontSize: "0.875rem" }}
                  >
                    <MenuItem value="">
                      <em>All Locations</em>
                    </MenuItem>
                    {uniqueLocations.map((location) => (
                      <MenuItem key={location} value={location}>
                        {location}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={handleClearFilters}
                    sx={{
                      flex: 1,
                      textTransform: "none",
                      fontSize: "0.875rem",
                    }}
                  >
                    Clear All
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleFilterClose}
                    sx={{
                      flex: 1,
                      textTransform: "none",
                      fontSize: "0.875rem",
                      backgroundColor: "#3B82F6",
                      "&:hover": {
                        backgroundColor: "#2563EB",
                      },
                    }}
                  >
                    Apply
                  </Button>
                </Box>
              </Box>
            </Popover>

            <Button
              variant="outlined"
              startIcon={<ExportIcon sx={{ fontSize: 18 }} />}
              sx={{
                textTransform: "none",
                color: "#374151",
                borderColor: "#E5E7EB",
                backgroundColor: "#FFFFFF",
                fontWeight: 500,
                fontSize: "0.875rem",
                px: 2,
                py: 0.75,
                borderRadius: 1.5,
                "&:hover": {
                  borderColor: "#D1D5DB",
                  backgroundColor: "#F9FAFB",
                },
              }}
            >
              Export
            </Button>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ fontSize: "0.875rem", color: "#6B7280" }}>
                Show:
              </Typography>
              <Select
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                size="small"
                sx={{
                  fontSize: "0.875rem",
                  backgroundColor: "#FFFFFF",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#E5E7EB",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#D1D5DB",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#9CA3AF",
                    borderWidth: "1px",
                  },
                  "& .MuiSelect-select": {
                    py: 0.75,
                    px: 1.5,
                  },
                }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {hasActiveFilters() && (
              <Typography
                variant="body2"
                sx={{
                  color: "#3B82F6",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                }}
              >
                Showing {filteredData.length} of {batchData.length}
              </Typography>
            )}
            <Typography
              variant="body2"
              sx={{
                color: "#9CA3AF",
                fontWeight: 500,
                fontSize: "0.75rem",
                letterSpacing: "0.05em",
              }}
            >
              TOTAL POPULATION: 42,500 BIRDS
            </Typography>
          </Box>
        </Box>

        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            border: "1px solid #E5E7EB",
            borderRadius: 2,
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#FFFFFF",
                  borderBottom: "1px solid #E5E7EB",
                }}
              >
                <TableCell
                  sx={{
                    fontWeight: 500,
                    fontSize: "0.75rem",
                    color: "#6B7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    py: 2,
                  }}
                >
                  Batch ID
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 500,
                    fontSize: "0.75rem",
                    color: "#6B7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    py: 2,
                  }}
                >
                  Breed Type
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 500,
                    fontSize: "0.75rem",
                    color: "#6B7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    py: 2,
                  }}
                >
                  Quantity
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 500,
                    fontSize: "0.75rem",
                    color: "#6B7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    py: 2,
                  }}
                >
                  Current Age
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 500,
                    fontSize: "0.75rem",
                    color: "#6B7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    py: 2,
                  }}
                >
                  Location
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 500,
                    fontSize: "0.75rem",
                    color: "#6B7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    py: 2,
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 500,
                    fontSize: "0.75rem",
                    color: "#6B7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    py: 2,
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row) => {
                  const statusStyle = getStatusColor(row.status);
                  return (
                    <TableRow
                      key={row.id}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#F9FAFB",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#059669",
                          fontSize: "0.875rem",
                        }}
                      >
                        {row.id}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              backgroundColor: row.breedColor,
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: "0.875rem",
                              color: "#1F2937",
                            }}
                          >
                            {row.breedType}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "0.875rem",
                          color: "#1F2937",
                        }}
                      >
                        {row.quantity.toLocaleString()}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "0.875rem",
                          color: "#1F2937",
                        }}
                      >
                        {row.currentAge}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "0.875rem",
                          color: "#1F2937",
                        }}
                      >
                        {row.location}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.status}
                          size="small"
                          sx={{
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.color,
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            height: 24,
                            borderRadius: 1.5,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <RowActionsMenu row={row} onAction={handleRowAction} />
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                // Empty state when no results match filters
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: "center", py: 6 }}>
                    <Typography sx={{ color: "#9CA3AF", fontSize: "0.875rem" }}>
                      No batches match your filters
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <CustomPagination
            count={filteredData.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
          />
        </TableContainer>
        <Dialog
          open={deleteDialog.open}
          onClose={handleDeleteCancel}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 600 }}>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete batch{" "}
              <strong>{deleteDialog.row?.id}</strong>? This action cannot be
              undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={handleDeleteCancel}
              variant="outlined"
              sx={{
                textTransform: "none",
                color: "#6B7280",
                borderColor: "#E5E7EB",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              variant="contained"
              sx={{
                textTransform: "none",
                backgroundColor: "#DC2626",
                "&:hover": {
                  backgroundColor: "#B91C1C",
                },
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}
