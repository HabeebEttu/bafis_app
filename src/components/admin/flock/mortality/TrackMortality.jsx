import {
  Alert,
  AlertTitle,
  alpha,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  InputAdornment,
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
import React, { useState } from "react";
import PageHeader from "../../utils/PageHeader";
import {
  AddCircle,
  Close,
  Download,
  HealthAndSafety,
  InfoOutlined,
  MoreVert,
  PriorityHigh,
  Search,
  TrendingDown,
  TrendingUp,
  WarningAmber,
} from "@mui/icons-material";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CustomPagination from "../../../utils/CustomPagination";

export default function TrackMortality({ navToRecord }) {
  const mortalityCards = [
    {
      name: "Total Mortality (This Month)",
      count: 532,
      percentage: 5.2,
      isIncrease: true,
    },
    {
      name: "Av. Mortality Rate (%)",
      count: "2.4%",
      percentage: 0.1,
      isIncrease: false,
    },
  ];

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
      <PageHeader
        title={"Mortality Tracking"}
        subtitle={"Real time health monitoring and loss diagnostics"}
        actions={[
          {
            name: "Export",
            value: () => {},
            Icon: Download,
            variant: "outlined",
          },
          {
            name: "Record Mortality",
            value: navToRecord,
            Icon: AddCircle,
            variant: "contained",
          },
        ]}
      />
      <Box
        mt={2}
        width={"100%"}
        gap={3}
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 3,
          mb: 3,
        }}
      >
        {mortalityCards.map((item, index) => (
          <MortalityCard
            name={item.name}
            count={item.count}
            percentage={item.percentage}
            isIncrease={item.isIncrease}
            key={item}
          />
        ))}
        <CriticalAlertsCard label="active batches" count={8} />
      </Box>
      <MortalityTrendsChart />
      <Box mt={10} />
      <RecentRecords />
    </Box>
  );
}

function MortalityCard({ name, count, percentage, isIncrease = true }) {
  const isPositiveTrend = !isIncrease;
  const trendColor = isPositiveTrend ? "success.main" : "error.main";
  return (
    <Card
      variant="outlined"
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        boxShadow: 0,
        gap: 2,
        borderRadius: 2,
        "&:hover": {
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          transition: "box-shadow 0.3s ease",
        },
      }}
    >
      <Box display="flex" alignItems="center" gap={1} width="100%">
        <Typography
          variant="body1"
          fontSize={15}
          fontWeight={500}
          color="text.secondary"
          sx={{ textTransform: "none" }}
        >
          {name}
        </Typography>
      </Box>

      {/* Main Content */}
      <Box
        display="flex"
        justifyContent="flex-start"
        alignItems="baseline"
        gap={1.5}
      >
        {/* Count */}
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            color: "text.primary",
            lineHeight: 1,
          }}
        >
          {count.toLocaleString()}
        </Typography>

        <Box
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          gap={0.5}
          sx={{
            color: trendColor,
            bgcolor: isPositiveTrend ? "success.light" : "error.lighter",
            px: 1,
            py: 0.5,
            borderRadius: 1,
          }}
        >
          {isIncrease ? (
            <TrendingUp sx={{ fontSize: 18 }} />
          ) : (
            <TrendingDown sx={{ fontSize: 18 }} />
          )}
          <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1 }}>
            {percentage}%
          </Typography>
        </Box>
      </Box>

      {/* Optional: Additional Context */}
      {/* <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
        {isPositiveTrend
          ? `${percentage}% decrease from last month`
          : `${percentage}% increase from last month`}
      </Typography> */}
    </Card>
  );
}

const CriticalAlertsCard = ({
  count = 8,
  label = "active batches",
  onClick,
}) => {
  return (
    <Card
      variant="outlined"
      onClick={onClick}
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        boxShadow: 0,
        gap: 2,
        borderRadius: 2,
        position: "relative",
        overflow: "visible",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.3s ease",
        bgcolor: alpha("#FF6B35", 0.03),
        borderColor: alpha("#FF6B35", 0.2),
        "&:hover": {
          boxShadow: onClick ? "0 4px 12px rgba(255, 107, 53, 0.15)" : 0,
          borderColor: "error.main",
          bgcolor: alpha("#FF6B35", 0.05),
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -10,
          right: -10,
          width: 52,
          height: 52,
          borderRadius: "50%",
          bgcolor: "error.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "4px solid",
          borderColor: "background.paper",
          boxShadow: "0 4px 12px rgba(255, 107, 53, 0.3)",
        }}
      >
        <PriorityHigh
          sx={{
            fontSize: 28,
            color: "white",
            fontWeight: 700,
          }}
        />
      </Box>

      {/* Header */}
      <Typography
        variant="body1"
        fontSize={15}
        fontWeight={600}
        color="text.secondary"
        sx={{ textTransform: "none" }}
      >
        Critical Alerts
      </Typography>

      {/* Count and Label */}
      <Box display="flex" alignItems="baseline" gap={1}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            color: "error.main",
            lineHeight: 1,
            fontSize: "2.5rem",
          }}
        >
          {count}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            fontSize: "0.95rem",
            fontWeight: 400,
          }}
        >
          {label}
        </Typography>
      </Box>
    </Card>
  );
};

function MortalityTrendsChart() {
  const [timeRange, setTimeRange] = useState("7");
  const data = [
    {
      name: "Mon",
      val: 40,
    },
    {
      name: "Tue",
      val: 45,
    },
    {
      name: "Wed",
      val: 68,
    },
    {
      name: "Thu",
      val: 23,
    },
    {
      name: "Fri",
      val: 93,
    },
    {
      name: "Sat",
      val: 20,
    },
    {
      name: "Sun",
      val: 22,
    },
  ];
  return (
    <Card
      display={"flex"}
      flexDirection={"column"}
      variant="outlined"
      elevation={1}
    >
      <CardContent>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Typography color="text.primary" variant="body1">
            Mortality Trends
          </Typography>
          <TextField
            select
            value={timeRange}
            size="small"
            onChange={(e) => setTimeRange(e.target.value)}
            variant="outlined"
          >
            <MenuItem value={"7"}>This week (last 7 days)</MenuItem>
            <MenuItem value={"30"}>This week (last 30 days)</MenuItem>
          </TextField>
        </Box>
        <Box mt={8}></Box>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} barSize={45}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            {/* <Legend /> */}
            <Bar dataKey="val" fill="#2D7A3E" width={12} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

const RecentRecords = () => {
  const [alertOpen, setAlertOpen] = React.useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const records = [
    {
      date: "Oct 24, 2023",
      batch: "B-2024-A05",
      qty: 14,
      causeOfDeath: "Heat Stress",
      causeIcon: "🌡️",
      causeColor: "#d32f2f",
      staffMember: "John Doe",
      status: "CRITICAL",
      statusColor: "#d32f2f",
      statusBg: "#ffebee",
    },
    {
      date: "Oct 24, 2023",
      batch: "B-2024-C12",
      qty: 5,
      causeOfDeath: "Unknown",
      causeIcon: "🤷",
      causeColor: "#ed6c02",
      staffMember: "Jane Smith",
      status: "UNUSUAL SPIKE",
      statusColor: "#ed6c02",
      statusBg: "#fff4e5",
    },
    {
      date: "Oct 23, 2023",
      batch: "B-2024-D02",
      qty: 2,
      causeOfDeath: "Natural",
      causeIcon: "🍃",
      causeColor: "#0288d1",
      staffMember: "John Doe",
      status: "NORMAL",
      statusColor: "#0288d1",
      statusBg: "#e3f2fd",
    },
    {
      date: "Oct 23, 2023",
      batch: "B-2024-A05",
      qty: 1,
      causeOfDeath: "Disease Suspected",
      causeIcon: "🩺",
      causeColor: "#5e35b1",
      staffMember: "Robert King",
      status: "UNDER REVIEW",
      statusColor: "#5e35b1",
      statusBg: "#ede7f6",
    },
  ];
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const filteredData = records.filter(
    (record) =>
      record.batch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.causeOfDeath.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
            Recent Records
          </Typography>
          <TextField
            placeholder="Search batch or cause..."
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

        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#fafafa" }}>
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
                  Date
                </TableCell>
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
                  Batch#
                </TableCell>
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
                  QTY
                </TableCell>
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
                  Cause of Death
                </TableCell>
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
                  Staff Member
                </TableCell>
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
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    borderBottom: "1px solid #e0e0e0",
                    width: "48px",
                  }}
                />
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((record, index) => (
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
                    {record.qty}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderBottom: "1px solid #e0e0e0",
                      padding: "16px",
                    }}
                  >
                    <Chip
                      icon={
                        <span style={{ fontSize: "14px", marginLeft: "4px" }}>
                          {record.causeIcon}
                        </span>
                      }
                      label={record.causeOfDeath}
                      sx={{
                        bgcolor: "transparent",
                        border: `1px solid ${record.causeColor}40`,
                        color: record.causeColor,
                        fontSize: "13px",
                        fontWeight: 500,
                        height: "28px",
                        "& .MuiChip-icon": {
                          marginLeft: "8px",
                          marginRight: "-4px",
                        },
                        "& .MuiChip-label": {
                          paddingLeft: "8px",
                          paddingRight: "12px",
                        },
                      }}
                    />
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
                      padding: "16px",
                    }}
                  >
                    <Chip
                      label={record.status}
                      sx={{
                        bgcolor: record.statusBg,
                        color: record.statusColor,
                        fontSize: "11px",
                        fontWeight: 700,
                        height: "24px",
                        letterSpacing: "0.5px",
                        border: "none",
                        "& .MuiChip-label": {
                          paddingLeft: "8px",
                          paddingRight: "8px",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      borderBottom: "1px solid #e0e0e0",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    <IconButton size="small" sx={{ color: "#9e9e9e" }}>
                      <InfoOutlined sx={{ fontSize: "20px" }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer */}
        <Box>
          <CustomPagination
            count={records.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={() => handleChangePage}
          />
        </Box>
      </Paper>

      {/* Alert */}
      {alertOpen && (
        <Box
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: "380px",
            zIndex: 1300,
          }}
        >
          <Alert
            severity="error"
            icon={<WarningAmber sx={{ fontSize: "24px" }} />}
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => setAlertOpen(false)}
                sx={{ mt: -0.5 }}
              >
                <Close sx={{ fontSize: "20px" }} />
              </IconButton>
            }
            sx={{
              bgcolor: "#d32f2f",
              color: "#fff",
              borderRadius: "4px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              "& .MuiAlert-icon": {
                color: "#fff",
                fontSize: "24px",
              },
              "& .MuiAlert-message": {
                padding: "8px 0",
              },
              "& .MuiAlert-action": {
                padding: "4px 0 0 16px",
                marginRight: "-8px",
              },
            }}
          >
            <AlertTitle
              sx={{
                fontSize: "16px",
                fontWeight: 700,
                mb: 0.5,
              }}
            >
              Critical Spike Detected
            </AlertTitle>
            <Typography
              sx={{
                fontSize: "14px",
              }}
            >
              Batch #B-2024-A05 has exceeded 3% mortality threshold within 4
              hours.
            </Typography>
          </Alert>
        </Box>
      )}
    </Box>
  );
};
