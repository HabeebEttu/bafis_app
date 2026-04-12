import {
  Alert,
  alpha,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import PageHeader from "../../utils/PageHeader";
import {
  AddCircle,
  Delete,
  Edit,
  InfoOutlined,
  MoreVert,
  Search,
  StackedLineChart,
  Verified,
  Visibility,
  Warning,
} from "@mui/icons-material";
import CustomPagination from "../../../utils/CustomPagination";
import { useState } from "react";

export default function RecordDailyProduction({ navToCollectionForm }) {
  const productionOverview = [
    {
      title: "total Eggs Today.",
      value: "8,234",
      Icon: StackedLineChart,
      description: "vs. yesterday",
      secondary: "4%",
      iconColor: "#2e7d32",
      isIncrement: true,
    },
    {
      title: "Average Grade A %",
      value: "94%",
      Icon: Verified,
      description: "Stable performance",
      secondary: "-0% ",
      iconColor: "#2196f3",
      isIncrement: false,
    },
    {
      title: "Total Cracks / Damaged",
      value: "42",
      Icon: Warning,
      description: "Redution from last batch",
      secondary: "2%",
      iconColor: "#f44336",
      isIncrement: true,
    },
  ];
  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        minHeight: "100vh",
        py: 4,
        px: 3,
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: "auto" }}>
        <PageHeader
          title={"Daily Egg collection"}
          subtitle={"Manage and track you farms daily production input"}
          actions={[
            {
              variant: "contained",
              value: navToCollectionForm,
              Icon: AddCircle,
              name: "Record New Collection",
            },
          ]}
        />
        <Box mb={5} />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 3,
            mb: 4,
          }}
        >
          {productionOverview.map((item, _) => {
            return (
              <ProductionOverviewCard
                key={item}
                title={item.title}
                value={item.value}
                description={item.description}
                secondary={item.secondary}
                iconColor={item.iconColor}
                Icon={item.Icon}
                isIncrement={item.isIncrement}
              />
            );
          })}
        </Box>
        <RecentEggCollections />
      </Box>
    </Box>
  );
}

function ProductionOverviewCard({
  title,
  Icon,
  value,
  secondary,
  description,
  iconColor,
  isIncrement,
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        px: 3,
        pt: 2,
        pb: 1.5,
        minHeight: 115,
        transition: "all 0.3s ease-in-out",
        cursor: "pointer",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          fontSize={15}
          fontWeight={700}
          color="text.secondary"
          component="h3"
          textTransform={"capitalize"}
        >
          {title}
        </Typography>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          px={1}
          py={0.75}
          bgcolor={alpha(iconColor || "#2D7A3E", 0.2)}
          color={iconColor || "#2D7A3E"}
          borderRadius={1}
          aria-hidden="true"
        >
          <Icon />
        </Box>
      </Box>

      <Box
        mt={1}
        display="flex"
        flexDirection="row"
        alignItems="baseline"
        gap={1}
      >
        <Typography variant="h3" fontWeight={800} fontSize={26} component="p">
          {value}
        </Typography>
        <Typography
          variant="body1"
          fontSize={11}
          fontWeight={600}
          color={isIncrement ? "primary.main" : "error.main"}
        >
          {secondary}
        </Typography>
      </Box>

      <Typography color="text.secondary" fontSize={12} mt={1.8}>
        {description}
      </Typography>
    </Paper>
  );
}
const RecentEggCollections = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [records, setRecords] = useState([
    {
      id: 1,
      date: "Oct 23, 2023",
      time: "10:30 AM",
      batch: "B-204",
      quantity: 1200,
      eggs: {
        regular: 1150,
        cracked: 10,
      },
      staffMember: "John Doe",
    },
  ]);
  const headers = [
    "date/time",
    "batch",
    "regular",
    "cracked",
    "staff member",
    "actions",
  ];
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editFormData, setEditFormData] = useState({
    batch: "",
    regularEggs: "",
    crackedEggs: "",
    staffMember: "",
  });
  const handleMenuOpen = (event, record) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedRecord(record);
  };
  const handleMenuClose = () => {
    setMenuAnchor(null);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleEditAction = () => {
    setEditFormData({
      batch: selectedRecord.batch,
      regularEggs: selectedRecord.eggs.regular.toString(),
      crackedEggs: selectedRecord.eggs.cracked.toString(),
      staffMember: selectedRecord.staffMember,
    });
    setOpenEditDialog(true);
    handleMenuClose();
  };
  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
    handleMenuClose();
  };
  const handleConfirmDelete = () => {
    if (!selectedRecord) {
      console.error("No record selected for deletion");
      setOpenDeleteDialog(false);
      return;
    }
    const updatedRecords = records.filter(
      (record) => record.id !== selectedRecord.id,
    );
    setRecords(updatedRecords);
    setSelectedRecord(null);
    setOpenDeleteDialog(false);
  };
  const handleSaveEdit = () => {
    const updatedRecords = records.map((record) => {
      if (record.id === selectedRecord.id) {
        return {
          ...record,
          batch: editFormData.batch,
          eggs: {
            regular: parseInt(editFormData.regularEggs) || 0,
            cracked: parseInt(editFormData.crackedEggs) || 0,
          },
          staffMember: editFormData.staffMember,
          quantity:
            (parseInt(editFormData.regularEggs) || 0) +
            (parseInt(editFormData.crackedEggs) || 0),
        };
      }
      return record;
    });
    setOpenDeleteDialog(false);
    setRecords(updatedRecords);
    setEditFormData({
      batch: "",
      regularEggs: 0,
      crackedEgs: 0,
      staffMember: "",
    });
  };
  const filteredData = records.filter(
    (record) =>
      record.batch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.staffMember.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );
  return (
    <Box sx={{ width: "100%", bgcolor: "#fafafa" }}>
      <Paper
        elevation={0}
        sx={{
          border: "1px solid #e0e0e0",
          borderRadius: "15px",
          overflow: "hidden",
          width: "100%",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid #e0e0e0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#212121",
            }}
          >
            Recent Collections
          </Typography>
          <TextField
            placeholder="Search batch or staff..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            size="small"
            sx={{
              width: "240px",
              "& .MuiOutlinedInput-root": {
                fontSize: "14px",
                bgcolor: "#fff",
                "& fieldset": {
                  borderColor: "#e0e0e0",
                },
                "&:hover fieldset": {
                  borderColor: "#bdbdbd",
                },
              },
              "& .MuiOutlinedInput-input": {
                padding: "8px 14px",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#9e9e9e", fontSize: "20px" }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <TableContainer sx={{ width: "100%", overflow: "auto" }}>
          <Table
            sx={{
              minWidth: 650,
              width: "100%",
            }}
          >
            <TableHead>
              <TableRow sx={{ bgcolor: "#fafafa" }}>
                {headers.map((item) => (
                  <TableCell
                    key={item}
                    sx={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#616161",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderBottom: "1px solid #e0e0e0",
                      padding: "12px 16px",
                    }}
                  >
                    {item}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((record, index) => (
                <>
                  <TableRow
                    key={index}
                    sx={{
                      "&:hover": {
                        bgcolor: "#f5f5f5",
                      },
                    }}
                  >
                    <TableCell
                      sx={{
                        fontSize: "14px",
                        color: "#212121",
                        borderBottom: "1px solid #e0e0e0",
                        padding: "16px",
                      }}
                    >
                      {record.date}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "14px",
                        color: "#212121",
                        fontWeight: 500,
                        borderBottom: "1px solid #e0e0e0",
                        padding: "16px",
                      }}
                    >
                      {record.batch}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "14px",
                        color: record.qty >= 10 ? "#d32f2f" : "#212121",
                        fontWeight: 500,
                        borderBottom: "1px solid #e0e0e0",
                        padding: "16px",
                      }}
                    >
                      {record?.eggs?.regular}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: "1px solid #e0e0e0",
                        padding: "16px",
                      }}
                    >
                      {record?.eggs?.cracked}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "14px",
                        color: "#212121",
                        borderBottom: "1px solid #e0e0e0",
                        padding: "16px",
                      }}
                    >
                      {record.staffMember}
                    </TableCell>

                    <TableCell
                      sx={{
                        borderBottom: "1px solid #e0e0e0",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      <IconButton
                        size="small"
                        sx={{ color: "#9e9e9e" }}
                        onClick={(event) => {
                          handleMenuOpen(event, record);
                        }}
                      >
                        <MoreVert sx={{ fontSize: "20px" }} />
                      </IconButton>
                      <Menu
                        anchorEl={menuAnchor}
                        open={Boolean(
                          menuAnchor && selectedRecord?.id === record.id,
                        )}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        TransitionComponent={Fade}
                        transitionDuration={{
                          enter: 150,
                          exit:200
                        }}
                        slotProps={{
                          paper: {
                            elevation: 8,
                            sx: {
                              marginTop: "8px", 
                              padding: "8px 0",
                              minWidth:'180px',
                              borderRadius: "10px",
                              overflow: "visible",
                              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
                              border: `1px solid #e0e0e0`,
                              bgcolor:'white'
                            },
                          },
                        }}
                      >
                        <MenuItem
                          onClick={handleEditAction}
                          sx={{
                            padding: "12px 16px",
                            minHeight: "44px",
                            gap: "12px",
                            display: "flex",
                            alignItems: "center",
                            transform: "all 0.2 ",
                            "&:hover": {
                              backgroundColor: "#f5f5f5",
                              paddingLeft: "20px",
                              transform: "translateX(4px)",
                            },
                            
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#212121",
                          }}
                        >
                          <Edit sx={{ mr: 3 }} fontSize="small" />
                          Edit
                        </MenuItem>
                        <MenuItem
                          onClick={handleDeleteClick}
                          sx={{
                            color: "#d32f2f",
                            padding: "12px 16px",
                            minHeight: "44px",
                            gap: "12px",
                            display: "flex",
                            alignItems: "center",
                            transform: "all 0.2 ",
                            "&:hover": {
                              backgroundColor: "#ffebee",
                              paddingLeft: "20px",
                            },
                            "&:focus": {
                              outline: "0.75px solid #2e7d32",
                              outlineOffset: "-2px",
                            },
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                        >
                          <Delete sx={{ mr: 1 }} />
                          Delete
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                  <Dialog
                    open={openEditDialog}
                    onClose={() => setOpenEditDialog(false)}
                  >
                    <DialogTitle>
                      Edit Record - {selectedRecord?.batch}
                    </DialogTitle>
                    <DialogContent>
                      <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2,1fr)',
                        rowGap: 1,
                        columnGap: 1,
                        overflowY: 'scroll',
                        py:1
                      }}>
                      <TextField
                        label="Batch ID"
                        value={editFormData.batch}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            batch: e.target.value,
                          })
                        }
                      />
                      <TextField
                        label="Regular Eggs"
                        type="number"
                        value={editFormData.regularEggs}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            regularEggs: e.target.value,
                          })
                        }
                      />
                      <TextField
                        label="Cracked Eggs"
                        type="number"
                        value={editFormData.crackedEggs}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            crackedEggs: e.target.value,
                          })
                        }
                      />
                      <TextField
                        label="Staff Member"
                        value={editFormData.staffMember}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            staffMember: e.target.value,
                          })
                        }
                      />
                      </Box></DialogContent>
                    <DialogActions>
                      <Button onClick={() => setOpenEditDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveEdit} variant="contained">
                        Save
                      </Button>
                    </DialogActions>
                  </Dialog>

                  <Dialog
                    open={openDeleteDialog}
                    onClose={() => setOpenDeleteDialog(false)}
                  >
                    <DialogTitle>Delete Record?</DialogTitle>
                    <DialogContent>
                      Are you sure you want to delete batch{" "}
                      {selectedRecord?.batch}?
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setOpenDeleteDialog(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        variant="contained"
                      >
                        Delete
                      </Button>
                    </DialogActions>
                  </Dialog>
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box>
          <CustomPagination
            count={filteredData.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={() => handleChangePage}
          />
        </Box>
      </Paper>
    </Box>
  );
};
