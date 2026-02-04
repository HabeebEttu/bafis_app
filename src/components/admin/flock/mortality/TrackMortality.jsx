import { alpha, Box, Card, CardContent, MenuItem, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import PageHeader from "../../utils/PageHeader";
import {
  AddCircle,
  Download,
  HealthAndSafety,
  PriorityHigh,
  TrendingDown,
  TrendingUp,
} from "@mui/icons-material";
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function TrackMortality() {
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
  const onClick = null;
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
            value: () => {},
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
      <MortalityTrendsChart/>
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
  const [timeRange, setTimeRange] = useState('7')
  const data = [
    {
      name: 'Mon',
      val:40,
    },{
      name: 'Tue',
      val:45,
    },{
      name: 'Wed',
      val:68,
    },{
      name: 'Thu',
      val:23,
    },{
      name: 'Fri',
      val:93,
    },{
      name: 'Sat',
      val:20,
    },{
      name: 'Sun',
      val:22,
    }
  ]
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
            <Bar dataKey="val" fill="#2D7A3E" width={12}/>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>

  );
}
 function 