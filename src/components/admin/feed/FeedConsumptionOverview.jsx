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
import React, { useState } from "react";
import PageHeader from "../utils/PageHeader";
import {
  AddBox,
  CalendarToday,
  InfoOutlined,
  Inventory,
  Inventory2,
  MedicalInformation,
  Monitor,
  Search,
  Warning,
} from "@mui/icons-material";
import CustomPagination from "../../utils/CustomPagination";

export default function FeedConsumptionOverview() {
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
            value: () => {},
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
        <FeedInventory headers={headers} items={data}/>
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

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: "15px",
        overflow: "hidden",
        gridColumn: "span 2",
        gridRow:'span 3'
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
      <InventoryBody data={items} headers={headers} />
      <Box>
        <CustomPagination
          count={items.length}
          page={page}
          rowsPerPage={rowsPerPage}
          // onPageChange={() => handleChangePage}
        />
      </Box>
    </Paper>
  );
}

function InventoryBody({ headers, data }) {
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
          {data.map((record, index) => (
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
                  sx={{
                    bgcolor: "transparent",
                    border: `1px solid ${record.statusColor}40`,
                    color: record.statusColor,
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
