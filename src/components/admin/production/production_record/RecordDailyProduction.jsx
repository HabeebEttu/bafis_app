import {
  Alert,
  alpha,
  Box,
  Chip,
  IconButton,
  InputAdornment,
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
  InfoOutlined,
  MoreVert,
  Search,
  StackedLineChart,
  Verified,
  Warning,
} from "@mui/icons-material";
import CustomPagination from "../../../utils/CustomPagination";
import { useState } from "react";

export default function RecordDailyProduction() {
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
              value: () => { },
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
  const records = [
    {
      date: 'Oct 23, 2023',
      time: '10:30 AM',
      batch: 'B-204',
      quantity: 1200,
      eggs: {
        regular: 1150,
        cracked: 10
      },
      staffMember: 'John Doe'
    }
  ];
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
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const filteredData = records.filter(
    (record) =>
      record.batch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.causeOfDeath.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.staffMember.toLowerCase().includes(searchQuery.toLowerCase()) || {},
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

        <TableContainer sx={{ width: '100%', overflow: 'auto' }}>
          <Table sx={{
            minWidth: 650,
            width: '100%',
          }}>
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
                    <IconButton size="small" sx={{ color: "#9e9e9e" }}>
                      <MoreVert sx={{ fontSize: "20px" }} />
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
    </Box>
  );
};