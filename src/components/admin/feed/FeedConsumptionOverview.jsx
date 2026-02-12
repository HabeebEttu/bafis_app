import {
  Alert,
  AlertTitle,
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import PageHeader from "../utils/PageHeader";
import {
  AddBox,
  CalendarMonth,
  CalendarToday,
  CalendarTodayOutlined,
  CheckCircle,
  Download,
  Grass,
  Info,
  InfoOutlined,
  Inventory,
  Inventory2,
  MedicalInformation,
  Monitor,
  OpenInNew,
  Search,
  Warning,
} from "@mui/icons-material";
import CustomPagination from "../../utils/CustomPagination";

export default function FeedConsumptionOverview({
  navToConsumptionHistory,
  navToRecordConsumption,
}) {
  const overviewData = [
    {
      title: "Current Stock (Kg)",
      Icon: Inventory,
      value: "12,450",
      secondary: "-5.2%",
      description: "vs. last month (13,100kg)",
      iconColor: "",
      isIncrement: false,
    },

    {
      title: "Estimated Days Remaining",
      Icon: CalendarToday,
      value: "13 Days",
      secondary: "+2",
      description: "vs. last month (13,100kg)",
      iconColor: "#3b82f6",
      isIncrement: true,
    },
    {
      title: "Total Consumption (Month)",
      Icon: Monitor,
      value: "8,200",
      secondary: "-3.1%",
      description: "Efficiency trend: Improving",
      iconColor: "#f97316",
      isIncrement: false,
    },
  ];
  const headers = [
    "Feed Type",
    "Supplier",
    "Quantity (kg)",
    "expiry date",
    "status",
  ];

  const data = [
    {
      feedType: "starter mash",
      supplier: "Agro Feed Solution",
      quantity: "420kg",
      expiryDate: "Oct 12,2024",
      status: "low stock",
      statusColor: "#9f1239",
    },
  ];
  return (
    <Box display={"flex"} flexDirection={"column"} gap={3} px={3} py={4}>
      <PageHeader
        title={"Feed inventory & consumption overview"}
        subtitle={"Monitor your stock levels and daily feed usage efficiency"}
        actions={[
          {
            variant: "outlined",
            Icon: AddBox,
            name: "Record Consumption",
            value: navToRecordConsumption,
          },
          {
            variant: "contained",
            Icon: Inventory2,
            name: "Add Stock",
            value: () => {},
          },
        ]}
      />
      <Box mt={1} />
      <Alert
        severity="warning"
        variant="outlined"
        sx={{
          bgcolor: "rgb(255 193 7 / 0.1)",
          borderColor: "rgb(255 193 7 / 0.3)",
        }}
        action={
          <Button
            variant="contained"
            color="black"
            size="small"
            sx={{
              bgcolor: "secondary.main",
              textTransform: "capitalize",
            }}
          >
            reorder now
          </Button>
        }
      >
        <AlertTitle
          textTransform={"capitalize"}
          color={"black"}
          fontWeight={700}
        >
          Low stock alert starter mash
        </AlertTitle>
        Current inventory is below the 500kg safety threshold. We recommend
        reordering immediately.
      </Alert>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 3,
          mb: 4,
        }}
      >
        {overviewData.map((item, index) => {
          return (
            <FeedOverviewCard
              key={item}
              title={item.title}
              Icon={item.Icon}
              description={item.description}
              iconColor={item.iconColor}
              isIncrement={item.isIncrement}
              secondary={item.secondary}
              value={item.value}
            />
          );
        })}
        <FeedInventory headers={headers} items={data} />
        <RecentConsumption navToConsumptionHistory={navToConsumptionHistory} />
      </Box>
    </Box>
  );
}
function FeedOverviewCard({
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
function FeedInventory({ items, headers }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const paginatedData = items.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );
  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: "15px",
        overflow: "hidden",
        gridColumn: "span 2",
        gridRow: "span 6",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
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
          Feed Inventory
        </Typography>
        <TextField
          placeholder="Search feed..."
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

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <InventoryBody data={paginatedData} headers={headers} />
      </Box>

      <Box
        sx={{
          flexShrink: 0,
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "white",
        }}
      >
        <CustomPagination
          count={items.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
        />
      </Box>
    </Paper>
  );
}

function InventoryBody({ headers, data }) {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "optimal":
        return { bg: "#D1FAE5", color: "#065F46" };
      case "low stock":
        return { bg: "#FEF3C7", color: "#92400E" };
      default:
        return { bg: "#E5E7EB", color: "#1F2937" };
    }
  };
  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ bgcolor: "#fafafa" }}>
            {headers.map((header, _) => (
              <TableCell
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
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((record, index) => {
            const statusStyle = getStatusColor(record.status);
            return (
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
                    textTransform: "capitalize",
                    fontWeight: 600,
                  }}
                >
                  {record.feedType}
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
                  {record.supplier}
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
                  {record.quantity}
                </TableCell>

                <TableCell
                  sx={{
                    fontSize: "14px",
                    color: "#212121",
                    borderBottom: "1px solid #e0e0e0",
                    padding: "16px",
                  }}
                >
                  {record.expiryDate}
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: "1px solid #e0e0e0",
                    padding: "16px",
                  }}
                >
                  <Chip
                    label={record.status}
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
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
function RecentConsumption({ navToConsumptionHistory }) {
  const consumptionData = [
    { date: "Today", batch: "B-2024-001", quantity: "150 kg" },
    { date: "Yesterday", batch: "B-2024-001", quantity: "148 kg" },
    { date: "24 Sep", batch: "B-2024-002", quantity: "220 kg" },
    { date: "23 Sep", batch: "B-2023-098", quantity: "185 kg" },
    { date: "22 Sep", batch: "B-2023-098", quantity: "190 kg" },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: "15px",
        overflow: "hidden",
        gridRow: "span 6",
      }}
    >
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
          textTransform={"capitalize"}
          sx={{
            fontSize: "16px",
            fontWeight: 600,
            color: "#212121",
          }}
        >
          Recent Consumption
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 2,
            mb: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#9e9e9e",
              textTransform: "uppercase",
            }}
          >
            Date
          </Typography>
          <Typography
            sx={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#9e9e9e",
              textTransform: "uppercase",
            }}
          >
            Batch #
          </Typography>
          <Typography
            sx={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#9e9e9e",
              textTransform: "uppercase",
              textAlign: "right",
            }}
          >
            Quantity Used
          </Typography>
        </Box>

        {consumptionData.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 2,
              py: 2,
              borderBottom:
                index !== consumptionData.length - 1
                  ? "1px solid #f5f5f5"
                  : "none",
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                color: "#212121",
              }}
            >
              {item.date}
            </Typography>
            <Typography
              sx={{
                fontSize: "14px",
                color: "#212121",
              }}
            >
              {item.batch}
            </Typography>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#212121",
                textAlign: "right",
              }}
            >
              {item.quantity}
            </Typography>
          </Box>
        ))}

        
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 3,
          }}
        >
          <Typography
            component="button"
            variant="text"
            onClick={navToConsumptionHistory}
            sx={{
              fontSize: "14px",
              fontWeight: 500,
              color: "#2e7d32",
              textDecoration: "none",
              border: "none",
              cursor: "pointer",
              bgcolor: "transparent",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            View All Logs
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

export function FeedConsumptionHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState("7");
  const headers = [
    "Date & time",
    "feed type",
    "batch #",
    "quantity",
    "staff member",
    "status",
  ];
  const data = [
    {
      date: "Sep 25, 2024",
      time: "8:20 AM",
      feedType: "Starter Mash",
      batch: "B-2024-01",
      quantity: 150,
      staffMember: "John Doe",
      status: "logged",
    },
    {
      date: "Sep 25, 2024",
      time: "7:15 AM",
      feedType: "Grower Feed",
      batch: "B-2024-042",
      quantity: 130,
      staffMember: "Jake Tetra",
      status: "pending review",
    },
    {
      date: "Sep 25, 2024",
      time: "5:45 PM",
      feedType: "Finisher Mash",
      batch: "B-2024-098",
      quantity: 100,
      staffMember: "Abdullahi Obi",
      status: "pending review",
    },
    {
      date: "Sep 25, 2024",
      time: "9:00 AM",
      feedType: "Starter Mash",
      batch: "B-2024-01",
      quantity: 210,
      staffMember: "Joshua King",
      status: "pending review",
    },
    {
      date: "Sep 25, 2024",
      time: "8:45 AM",
      feedType: "Grower Feed",
      batch: "B-2024-02",
      quantity: 50,
      staffMember: "Nsikak Itama",
      status: "logged",
    },
  ];
  const feedTypes = [...new Set(data.map((item, _) => item.feedType))];
  const [selectedFeedType, setSelectedFeedType] = useState("all");
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "logged":
        return { bg: "#D1FAE5", color: "#065F46" };
      case "pending review":
        return { bg: "#FEF3C7", color: "#92400E" };
      default:
        return { bg: "#E5E7EB", color: "#1F2937" };
    }
  };
  return (
    <Box display={"flex"} flexDirection={"column"} gap={3} px={3} py={4}>
      <PageHeader
        title={"Feed Consumption History"}
        subtitle={"Detailed logs for all feed consumption accross the farm"}
        actions={[
          {
            variant: "outlined",
            Icon: Download,
            name: "Export",
            value: () => {},
          },
          {
            variant: "contained",
            Icon: AddBox,
            name: "Record Consumption",
            value: () => {},
          },
        ]}
      />
      <Paper
        variant="outlined"
        sx={{
          width: "100%",
          borderRadius: 2,
          borderColor: "#e5e7eb",
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
          px={3}
          py={2}
          flexWrap="wrap"
        >
          {/* Search Input */}
          <TextField
            placeholder="Search batch or feed type"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{
              minWidth: "280px",
              flex: { xs: "1 1 100%", sm: "1 1 auto" },
              "& .MuiOutlinedInput-root": {
                fontSize: "14px",
                bgcolor: "#fff",
                borderRadius: "8px",
                "& fieldset": {
                  borderColor: "#e0e0e0",
                },
                "&:hover fieldset": {
                  borderColor: "#bdbdbd",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#059669",
                  borderWidth: "2px",
                },
              },
              "& .MuiOutlinedInput-input": {
                padding: "10px 14px",
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

          <Box
            display="flex"
            gap={2}
            flexWrap="wrap"
            sx={{
              flex: { xs: "1 1 100%", sm: "0 1 auto" },
            }}
          >
            {/* Time Range Filter */}
            <TextField
              select
              value={timeRange}
              size="small"
              onChange={(e) => setTimeRange(e.target.value)}
              variant="outlined"
              sx={{
                minWidth: "160px",
                "& .MuiOutlinedInput-root": {
                  fontSize: "14px",
                  bgcolor: "#fff",
                  borderRadius: "8px",
                  "& fieldset": {
                    borderColor: "#e0e0e0",
                  },
                  "&:hover fieldset": {
                    borderColor: "#bdbdbd",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#059669",
                    borderWidth: "2px",
                  },
                },
                "& .MuiSelect-select": {
                  padding: "10px 14px",
                },
              }}
            >
              <MenuItem value="7">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <CalendarMonth sx={{ color: "#6b7280", fontSize: "18px" }} />
                  <Typography fontSize={14} color="text.primary">
                    Last 7 days
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value="30">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <CalendarMonth sx={{ color: "#6b7280", fontSize: "18px" }} />
                  <Typography fontSize={14} color="text.primary">
                    Last 30 days
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value="90">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <CalendarMonth sx={{ color: "#6b7280", fontSize: "18px" }} />
                  <Typography fontSize={14} color="text.primary">
                    Last 90 days
                  </Typography>
                </Box>
              </MenuItem>
            </TextField>

            {/* Feed Type Filter */}
            <TextField
              select
              size="small"
              value={selectedFeedType}
              onChange={(e) => setSelectedFeedType(e.target.value)}
              variant="outlined"
              SelectProps={{
                // This customizes what shows in the select when a value is chosen
                renderValue: (selected) => {
                  if (selected === "all") {
                    return (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                        }}
                      >
                        <Grass sx={{ color: "#6b7280", fontSize: "18px" }} />
                        <Typography fontSize={14} color="text.primary">
                          All Feed Types
                        </Typography>
                      </Box>
                    );
                  }
                  return (
                    <Typography fontSize={14} color="text.primary">
                      {selected}
                    </Typography>
                  );
                },
              }}
              sx={{
                minWidth: "180px",
                "& .MuiOutlinedInput-root": {
                  fontSize: "14px",
                  bgcolor: "#fff",
                  borderRadius: "8px",
                  "& fieldset": {
                    borderColor: "#e0e0e0",
                  },
                  "&:hover fieldset": {
                    borderColor: "#bdbdbd",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#059669",
                    borderWidth: "2px",
                  },
                },
                "& .MuiSelect-select": {
                  padding: "10px 14px",
                },
              }}
            >
              {/* <MenuItem value="all" hidden>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Grass sx={{ color: "#6b7280", fontSize: "18px" }} />
                  <Typography fontSize={14} color="text.primary">
                    All Feed Types
                  </Typography>
                </Box>
              </MenuItem> */}
              {feedTypes.map((type, index) => (
                <MenuItem key={index} value={type}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      pl: 3.5,
                    }}
                  >
                    <Typography fontSize={14} color="text.primary">
                      {type}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>
      </Paper>
      <Paper
        variant="outlined"
        sx={{
          width: "100%",
          borderRadius: 2,
          borderColor: "#e5e7eb",
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table
            sx={{
              minWidth: 650,
            }}
          >
            <TableHead>
              <TableRow sx={{ bgcolor: "#fafafa" }}>
                {headers.map((item, index) => (
                  <TableCell
                    key={index}
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
              {data.map((record, index) => {
                const statusStyle = getStatusColor(record.status);

                return (
                  <TableRow
                    key={record.id || index}
                    sx={{
                      "&:hover": {
                        bgcolor: "#f9fafb",
                      },
                      "&:last-child td": {
                        borderBottom: 0,
                      },
                    }}
                  >
                    {/* Date & Time Cell */}
                    <TableCell
                      sx={{
                        borderBottom: "1px solid #e5e7eb",
                        padding: "16px",
                      }}
                    >
                      <Box display="flex" flexDirection="column" gap={0.5}>
                        <Typography
                          fontSize={14}
                          fontWeight={600}
                          color="#1f2937"
                          sx={{ textTransform: "capitalize" }}
                        >
                          {record.date || "N/A"}
                        </Typography>
                        <Typography fontSize={13} color="#6b7280">
                          {record.time || "N/A"}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Feed Type Cell */}
                    <TableCell
                      sx={{
                        fontSize: "14px",
                        color: "#1f2937",
                        fontWeight: 500,
                        borderBottom: "1px solid #e5e7eb",
                        padding: "16px",
                      }}
                    >
                      {record.feedType || "N/A"}
                    </TableCell>

                    {/* Batch Cell */}
                    <TableCell
                      sx={{
                        fontSize: "14px",
                        color: "#6b7280",
                        fontWeight: 500,
                        borderBottom: "1px solid #e5e7eb",
                        padding: "16px",
                      }}
                    >
                      {record.batch || "N/A"}
                    </TableCell>

                    {/* Quantity Cell */}
                    <TableCell
                      sx={{
                        fontSize: "14px",
                        color: "#1f2937",
                        fontWeight: 600,
                        borderBottom: "1px solid #e5e7eb",
                        padding: "16px",
                      }}
                    >
                      {record.quantity || "N/A"}
                    </TableCell>

                    {/* Staff Member Cell */}
                    <TableCell
                      sx={{
                        fontSize: "14px",
                        color: "#1f2937",
                        fontWeight: 500,
                        borderBottom: "1px solid #e5e7eb",
                        padding: "16px",
                      }}
                    >
                      {record.staffMember || "N/A"}
                    </TableCell>

                    {/* Status Cell */}
                    <TableCell
                      sx={{
                        borderBottom: "1px solid #e5e7eb",
                        padding: "16px",
                      }}
                    >
                      <Chip
                        label={record.status || "Unknown"}
                        size="small"
                        sx={{
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.color,
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          height: 28,
                          borderRadius: "6px",
                          textTransform: "capitalize",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}



// Styled components for exact match
const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  padding: '8px 16px',
  borderRadius: 8,
  border: '1px solid #E5E7EB',
  backgroundColor: '#F9FAFB',
  color: '#666666',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.875rem',
  '&.Mui-selected': {
    backgroundColor: '#E8F5E9',
    color: '#2D7A3E',
    border: '1px solid #E8F5E9',
    '&:hover': {
      backgroundColor: '#E8F5E9',
    },
  },
  '&:hover': {
    backgroundColor: '#F3F4F6',
  },
}));

const ColorDot = styled(Box)(({ color }) => ({
  width: 32,
  height: 32,
  borderRadius: 4,
  backgroundColor: color || '#FF6B35',
}));

export function FeedConsumptionTracker() {
  const [feedType, setFeedType] = useState('');
  const [batch, setBatch] = useState('Batch #B204-L (2,500 birds)');
  const [quantity, setQuantity] = useState('0.00');
  const [timeOfDay, setTimeOfDay] = useState('Morning');
  const [remarks, setRemarks] = useState('');

  const handleTimeChange = (event, newTime) => {
    if (newTime !== null) {
      setTimeOfDay(newTime);
    }
  };

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
          title={"Record Feed Consumption"}
          subtitle={
            "Log daily usage to track performance and manage warehouse stock."
          }
        />
        <Box mb={4} />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
            gap: 3,
          }}
        >
          <Card variant="outlined">
            <CardContent sx={{ p: 4 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 3,
                  mb: 3,
                }}
              >
                <Box>
                  <Typography
                    variant="overline"
                    sx={{ display: "block", mb: 1, color: "text.primary" }}
                  >
                    Select Feed Type
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Search feed (Starter, Grower...)"
                    value={feedType}
                    onChange={(e) => setFeedType(e.target.value)}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: "text.secondary" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "grey.50",
                      },
                      fontSize: 15,
                    }}
                  />
                </Box>

                <Box>
                  <Typography
                    variant="overline"
                    sx={{ display: "block", mb: 1, color: "text.primary" }}
                  >
                    Select Batch
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)}
                      size="small"
                      sx={{
                        backgroundColor: "grey.50",
                        "& .MuiSelect-select": {
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        },
                      }}
                      // endAdornment={
                      //   <InputAdornment position="end" sx={{ mr: 4 }}>
                      //     <ColorDot color="#FF6B35" />
                      //   </InputAdornment>
                      // }
                    >
                      <MenuItem value="Batch #B204-L (2,500 birds)">
                        Batch #B204-L (2,500 birds)
                      </MenuItem>
                      <MenuItem value="Batch #B205-L (3,000 birds)">
                        Batch #B205-L (3,000 birds)
                      </MenuItem>
                      <MenuItem value="Batch #B206-M (2,200 birds)">
                        Batch #B206-M (2,200 birds)
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              {/* Quantity and Time */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 3,
                  mb: 3,
                }}
              >
                <Box>
                  <Typography
                    variant="overline"
                    sx={{ display: "block", mb: 1, color: "text.primary" }}
                  >
                    Quantity Used
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    value={quantity}
                    size="small"
                    onChange={(e) => setQuantity(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography
                            sx={{
                              color: "text.secondary",
                              fontWeight: 600,
                              fontSize: "0.875rem",
                            }}
                          >
                            BAGS
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "grey.50",
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Typography
                    variant="overline"
                    sx={{ display: "block", mb: 1, color: "text.primary" }}
                  >
                    Time of Feeding
                  </Typography>
                  <ToggleButtonGroup
                    value={timeOfDay}
                    exclusive
                    onChange={handleTimeChange}
                    fullWidth
                    sx={{ gap: 1 }}
                  >
                    <StyledToggleButton value="Morning">
                      Morning
                    </StyledToggleButton>
                    <StyledToggleButton value="Afternoon">
                      Afternoon
                    </StyledToggleButton>
                    <StyledToggleButton value="Evening">
                      Evening
                    </StyledToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </Box>

              {/* Remarks */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="overline"
                  sx={{ display: "block", mb: 1, color: "text.primary" }}
                >
                  Additional Remarks (Optional)
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Note any spillages or bird behavior changes..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "grey.50",
                    },
                  }}
                />
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  sx={{ color: "text.primary", borderColor: "grey.300" }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<CalendarToday />}
                  sx={{ px: 3 }}
                >
                  Log Consumption
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Current Stock Card */}
            <Card>
              <Box
                sx={{
                  p: 2,
                  borderBottom: "1px solid",
                  borderColor: "grey.200",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarToday
                    sx={{ fontSize: 20, color: "text.secondary" }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ fontSize: "1rem", fontWeight: 600 }}
                  >
                    Current Stock
                  </Typography>
                </Box>
                <Chip
                  label="LIVE STATUS"
                  size="small"
                  sx={{
                    backgroundColor: "success.light",
                    color: "success.main",
                    fontSize: "0.625rem",
                    fontWeight: 700,
                    height: 24,
                  }}
                />
              </Box>
              <CardContent>
                <Typography
                  variant="overline"
                  sx={{ display: "block", color: "text.secondary", mb: 1 }}
                >
                  Broiler Grower
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "3rem",
                      fontWeight: 700,
                      lineHeight: 1,
                      color: "text.primary",
                    }}
                  >
                    12
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "1.25rem",
                      color: "text.secondary",
                      fontWeight: 500,
                    }}
                  >
                    Bags
                  </Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={72}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    mb: 1.5,
                    backgroundColor: "grey.200",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "primary.main",
                      borderRadius: 4,
                    },
                  }}
                />

                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", fontSize: "0.875rem", mb: 3 }}
                >
                  Based on consumption rates, this stock will last for
                  approximately{" "}
                  <Box
                    component="span"
                    sx={{ fontWeight: 600, color: "text.primary" }}
                  >
                    8 days
                  </Box>
                </Typography>

                <Button
                  fullWidth
                  variant="text"
                  endIcon={<OpenInNew sx={{ fontSize: 16 }} />}
                  sx={{
                    color: "text.primary",
                    backgroundColor: "grey.50",
                    justifyContent: "center",
                    "&:hover": {
                      backgroundColor: "grey.100",
                    },
                  }}
                >
                  View full inventory details
                </Button>
              </CardContent>
            </Card>

            {/* Feeding Tip Card */}
            <Card sx={{ backgroundColor: "primary.main", color: "white" }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.5,
                    mb: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      borderRadius: 1,
                      p: 0.75,
                      display: "flex",
                    }}
                  >
                    <Info sx={{ fontSize: 20 }} />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontSize: "1rem", fontWeight: 600 }}
                  >
                    Feeding Tip
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ fontSize: "0.875rem", lineHeight: 1.6, opacity: 0.95 }}
                >
                  Birds tend to consume 20% more feed during cooler morning
                  hours. Ensure water troughs are cleaned before the morning
                  feed log.
                </Typography>
              </CardContent>
            </Card>

            {/* Recent Logs Card */}
            <Card>
              <Box
                sx={{
                  p: 2,
                  borderBottom: "1px solid",
                  borderColor: "grey.200",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontSize: "1rem", fontWeight: 600 }}
                >
                  Recent Logs
                </Typography>
              </Box>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.5,
                    p: 2,
                    backgroundColor: "grey.50",
                    borderRadius: 2,
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "grey.100",
                    },
                  }}
                >
                  <CheckCircle
                    sx={{ color: "primary.main", fontSize: 20, mt: 0.25 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 1,
                        mb: 0.5,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "1.125rem",
                          fontWeight: 700,
                          color: "text.primary",
                        }}
                      >
                        120kg
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", fontSize: "0.875rem" }}
                      >
                        Afternoon
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", fontSize: "0.875rem" }}
                      >
                        Yesterday
                      </Typography>
                      <Typography sx={{ color: "text.secondary" }}>
                        •
                      </Typography>
                      <Chip
                        label="Batch #8204-L"
                        size="small"
                        sx={{
                          backgroundColor: "#E3F2FD",
                          color: "#1976D2",
                          fontSize: "0.75rem",
                          height: 22,
                          fontWeight: 600,
                          "& .MuiChip-label": {
                            px: 1,
                          },
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
