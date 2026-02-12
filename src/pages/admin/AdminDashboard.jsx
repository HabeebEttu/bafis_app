import {
  Agriculture,
  Analytics,
  Badge,
  Clear,
  DashboardOutlined,
  Egg,
  FlutterDashOutlined,
  Grass,
  Group,
  MedicalServices,
  NotificationsOutlined,
  PendingActions,
  Search,
  SettingsOutlined,
  TrendingUp,
  Add,
  LocalShipping,
  Vaccines,
  PersonAdd,
  Warning,
  Circle,
  InfoOutline,
  HealthAndSafetyOutlined,
  HistoryOutlined,
  LocalHospital,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
} from "@mui/material";
import React, { useState } from "react";
import { GiNestBirds } from "react-icons/gi";
import AddBirds from "../../components/admin/flock/AddFlock";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import FlockManagement from "../../components/admin/flock/FlockManagement";
import TrackMortality from "../../components/admin/flock/mortality/TrackMortality";
import RecordMortality from "../../components/admin/flock/mortality/RecordMortality";
import FeedConsumptionOverview, { FeedConsumptionHistory, FeedConsumptionTracker } from "../../components/admin/feed/FeedConsumptionOverview";
export default function AdminDashboard() {
  const [view, setView] = useState("dashboard");

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        bgcolor: "#fafafa",
      }}
    >
      <Sidebar
        view={view}
        itemsList={[
          {
            Icons: DashboardOutlined,
            title: "Dashboard",
            view: "dashboard",
            onClick: () => setView("dashboard"),
          },
          {
            Icons: FlutterDashOutlined,
            title: "Flock Management",
            view: "flock",
            onClick: () => setView("flock"),
          },
          {
            Icons: Grass,
            title: "Feed Management",
            view: "feed",
            onClick: () => setView("feed"),
          },
          {
            Icons: MedicalServices,
            title: "Health & Vets",
            view: "health",
            onClick: () => setView("health"),
          },
          {
            Icons: LocalHospital,
            title: "Mortality",
            view: "mortality",
            onClick: () => setView("mortality"),
          },
          {
            Icons: Analytics,
            title: "Reports",
            view: "reports",
            onClick: () => setView("reports"),
          },
          {
            Icons: Group,
            title: "Staffing",
            view: "staffing",
            onClick: () => setView("staffing"),
          },
        ]}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          flex: 1,
          minWidth: 0,
        }}
      >
        <Navbar />
        <Box sx={{ flex: 1, overflow: "auto", width: "100%" }}>
          {view === "dashboard" && (
            <DashboardView
              addBird={() => {
                setView("add_bird");
              }}
            />
          )}
          {view === "add_bird" && (
            <AddBirds
              onCancel={() => {
                setView("flock");
              }}
            />
          )}
          {view === "flock" && (
            <FlockManagement
              navToAdd={() => {
                setView("add_bird");
              }}
              navToEdit={() => {
                setView("view_flock_details");
              }}
            />
          )}
          {view === "mortality-record" && <RecordMortality />}
          {view === "view_flock_details" && <ViewFlockRecords />}
          {view === "mortality" && (
            <TrackMortality navToRecord={() => setView("mortality-record")} />
          )}
          {view === "feed" && (
            <FeedConsumptionOverview
              navToConsumptionHistory={() =>
                setView("feed/consumption_history")
              }
              navToRecordConsumption={() => 
                setView('feed/record_consumption')
              }
            />
          )}
          {view === "feed/consumption_history" && <FeedConsumptionHistory />}
          {view === "feed/record_consumption" && <FeedConsumptionTracker/>}
        </Box>
      </Box>
    </Box>
  );
}

function Navbar() {
  const [searchValue, setSearchValue] = useState("");
  const handleClear = () => {
    setSearchValue("");
  };
  return (
    <Box
      px={3}
      py={1.5}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        borderBottom: "1px solid",
        borderColor: "grey.200",
        flexShrink: 0,
        minWidth: 0,
        backgroundColor: "white",
      }}
    >
      <TextField
        size="small"
        placeholder="Search data, flocks, or reports..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: "text.secondary", fontSize: 20 }} />
            </InputAdornment>
          ),
          endAdornment: searchValue && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleClear} edge="end">
                <Clear fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          flexGrow: 1,
          maxWidth: 400,
          "& .MuiOutlinedInput-root": {
            borderRadius: "50px",
            backgroundColor: "grey.300",
            "& fieldset": {
              borderColor: "#e0e0e0",
            },
            "&:hover fieldset": {
              borderColor: "#bdbdbd",
            },
            "&.Mui-focused fieldset": {
              borderColor: "transparent",
              borderWidth: "1px",
            },
          },
        }}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexShrink: 0,
        }}
      >
        <IconButton
          size="small"
          sx={{
            p: 1,
            color: "primary.main",
            backgroundColor: "grey.300",
            "&:hover": {
              color: "white",
              backgroundColor: "primary.main",
            },
          }}
        >
          <NotificationsOutlined />
        </IconButton>
        <IconButton
          size="small"
          sx={{
            p: 1,
            color: "primary.main",
            backgroundColor: "grey.300",
            "&:hover": {
              color: "white",
              backgroundColor: "primary.main",
            },
          }}
        >
          <SettingsOutlined />
        </IconButton>
        <Divider orientation="vertical" flexItem />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.8,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "end",
              flexDirection: "column",
              gap: 0.5,
            }}
          >
            <Typography
              fontWeight={800}
              fontSize={15}
              sx={{ whiteSpace: "nowrap" }}
              color="black"
            >
              Director Sarah
            </Typography>
            <Typography
              fontWeight={500}
              fontSize={11}
              sx={{ whiteSpace: "nowrap" }}
              color="black"
            >
              Farm Manager
            </Typography>
          </Box>
          <Avatar
            src="/images/test/avatar/manager.jpg"
            sx={{ width: 35, height: 35 }}
          />
        </Box>
      </Box>
    </Box>
  );
}

function Sidebar({ itemsList, view }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        minHeight: "100vh",
        px: 3,
        py: 1,
        borderRight: "1px solid",
        borderColor: "grey.200",
        flexShrink: 0,
        width: 240,
        backgroundColor: "white",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 2,
        }}
      >
        <Box
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            py: 0.5,
            px: 0.8,
            borderRadius: 1,
          }}
        >
          <Agriculture />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.7 }}>
          <Typography
            sx={{
              textTransform: "uppercase",
              color: "primary.main",
              fontWeight: 800,
              fontSize: 17,
            }}
          >
            bafis
          </Typography>
          <Typography
            sx={{
              textTransform: "uppercase",
              color: "grey.500",
              fontWeight: 500,
              fontSize: 12,
              whiteSpace: "nowrap",
            }}
          >
            Poultry Management
          </Typography>
        </Box>
      </Box>
      {itemsList.map((item, index) => {
        let isActive = view === item.view;
        isActive =
          view === "add_bird" && item.view === "flock" ? true : isActive;
        isActive =
          view === "view_flock_details" && item.view === "flock"
            ? true
            : isActive;
        isActive =
          view === "mortality-record" && item.view === "mortality"
            ? true
            : isActive;
        return (
          <Box
            onClick={item.onClick}
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              px: 2,
              py: 1,
              gap: 1,
              color: isActive ? "white" : "grey.500",
              bgcolor: isActive ? "primary.main" : "white",
              borderRadius: 1,
              "&:hover": {
                backgroundColor: isActive ? "primary.main" : "grey.300",
              },
              transition: "0.2s",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <item.Icons />
            <Typography color={isActive ? "white" : "grey.500"}>
              {item.title}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

function DashboardView({ addBird }) {
  const stats = [
    {
      Icons: GiNestBirds,
      title: "Total Birds",
      value: "12,450",
      verdict: { Icon: TrendingUp, value: "+2.5%", color: "success" },
      iconBg: "#e8f5e9",
      iconColor: "#2E7D32",
    },
    {
      Icons: Egg,
      title: "Egg Production",
      value: "8,234",
      verdict: { Icon: TrendingUp, value: "+1.2%", color: "success" },
      iconBg: "#e8f5e9",
      iconColor: "#2E7D32",
    },
    {
      Icons: Badge,
      title: "Active Staff",
      value: "15",
      verdict: { value: "Stable", color: "default" },
      iconBg: "#e3f2fd",
      iconColor: "#1976d2",
    },
    {
      Icons: PendingActions,
      title: "Pending Approvals",
      value: "5",
      verdict: { value: "Urgent", color: "warning" },
      iconBg: "#fff3e0",
      iconColor: "#ed6c02",
    },
  ];

  const activities = [
    {
      icon: LocalShipping,
      title: "Feed Batch #402 Delivered",
      subtitle: "Organic Soy Mix - Silo A",
      time: "2 hours ago",
      iconBg: "#e8f5e9",
      iconColor: "#2E7D32",
    },
    {
      icon: Vaccines,
      title: "Vaccination Completed",
      subtitle: "Flock B - Routine H5N1",
      time: "5 hours ago",
      iconBg: "#fff3e0",
      iconColor: "#ed6c02",
    },
    {
      icon: PersonAdd,
      title: "New Staff Onboarded",
      subtitle: "Arjun K. joined Field Team",
      time: "Yesterday",
      iconBg: "#e3f2fd",
      iconColor: "#1976d2",
    },
    {
      icon: Warning,
      title: "Silo C Low Capacity",
      subtitle: "Critical alert - 15% remaining",
      time: "Yesterday",
      iconBg: "#ffebee",
      iconColor: "#d32f2f",
    },
  ];

  return (
    <Box
      sx={{
        px: 4,
        py: 3,
        bgcolor: "#fafafa",
        minHeight: "100%",
      }}
    >
      <Box mb={4}>
        <Typography
          sx={{
            fontSize: 25,
            fontWeight: 700,
            color: "black",
            mb: 0.5,
          }}
        >
          Welcome Back, Director
        </Typography>
        <Typography sx={{ fontSize: 16, color: "primary.light" }}>
          Here is the operational pulse of your farm for today, Oct 24th.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 3,
          mb: 4,
        }}
      >
        {stats.map((item, index) => (
          <WelcomeStatCard key={index} {...item} />
        ))}
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 3 }}>
        <Card sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography fontSize={20} fontWeight={700}>
                Production Trends
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Circle sx={{ fontSize: 12, color: "#2E7D32" }} />
                  <Typography fontSize={13} color="text.secondary">
                    This Week
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Circle sx={{ fontSize: 12, color: "#a5d6a7" }} />
                  <Typography fontSize={13} color="text.secondary">
                    Last Week
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ height: 300, position: "relative" }}>
              <svg width="100%" height="100%" viewBox="0 0 700 300">
                <line x1="0" y1="250" x2="700" y2="250" stroke="#f0f0f0" />
                <line x1="0" y1="200" x2="700" y2="200" stroke="#f0f0f0" />
                <line x1="0" y1="150" x2="700" y2="150" stroke="#f0f0f0" />
                <line x1="0" y1="100" x2="700" y2="100" stroke="#f0f0f0" />
                <line x1="0" y1="50" x2="700" y2="50" stroke="#f0f0f0" />

                <rect
                  x="60"
                  y="170"
                  width="50"
                  height="80"
                  fill="#a5d6a7"
                  rx="4"
                />
                <rect
                  x="160"
                  y="120"
                  width="50"
                  height="130"
                  fill="#a5d6a7"
                  rx="4"
                />
                <rect
                  x="260"
                  y="150"
                  width="50"
                  height="100"
                  fill="#a5d6a7"
                  rx="4"
                />
                <rect
                  x="360"
                  y="100"
                  width="50"
                  height="150"
                  fill="#a5d6a7"
                  rx="4"
                />
                <rect
                  x="460"
                  y="50"
                  width="50"
                  height="200"
                  fill="#a5d6a7"
                  rx="4"
                />
                <rect
                  x="560"
                  y="80"
                  width="50"
                  height="170"
                  fill="#a5d6a7"
                  rx="4"
                />

                <rect
                  x="80"
                  y="180"
                  width="50"
                  height="70"
                  fill="#2E7D32"
                  rx="4"
                />
                <rect
                  x="180"
                  y="110"
                  width="50"
                  height="140"
                  fill="#2E7D32"
                  rx="4"
                />
                <rect
                  x="280"
                  y="140"
                  width="50"
                  height="110"
                  fill="#2E7D32"
                  rx="4"
                />
                <rect
                  x="380"
                  y="80"
                  width="50"
                  height="170"
                  fill="#2E7D32"
                  rx="4"
                />
                <rect
                  x="480"
                  y="30"
                  width="50"
                  height="220"
                  fill="#2E7D32"
                  rx="4"
                />
                <rect
                  x="580"
                  y="70"
                  width="50"
                  height="180"
                  fill="#2E7D32"
                  rx="4"
                />

                <text
                  x="100"
                  y="280"
                  fontSize="12"
                  fill="#666"
                  textAnchor="middle"
                >
                  Mon
                </text>
                <text
                  x="200"
                  y="280"
                  fontSize="12"
                  fill="#666"
                  textAnchor="middle"
                >
                  Tue
                </text>
                <text
                  x="300"
                  y="280"
                  fontSize="12"
                  fill="#666"
                  textAnchor="middle"
                >
                  Wed
                </text>
                <text
                  x="400"
                  y="280"
                  fontSize="12"
                  fill="#666"
                  textAnchor="middle"
                >
                  Thu
                </text>
                <text
                  x="500"
                  y="280"
                  fontSize="12"
                  fill="#666"
                  textAnchor="middle"
                >
                  Fri
                </text>
                <text
                  x="600"
                  y="280"
                  fontSize="12"
                  fill="#666"
                  textAnchor="middle"
                >
                  Sat
                </text>

                <text x="5" y="255" fontSize="11" fill="#999">
                  0
                </text>
                <text x="5" y="205" fontSize="11" fill="#999">
                  2k
                </text>
                <text x="5" y="155" fontSize="11" fill="#999">
                  4k
                </text>
                <text x="5" y="105" fontSize="11" fill="#999">
                  6k
                </text>
                <text x="5" y="55" fontSize="11" fill="#999">
                  8k
                </text>
                <text x="5" y="15" fontSize="11" fill="#999">
                  10k
                </text>
              </svg>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography fontSize={20} fontWeight={700}>
                Recent Activities
              </Typography>
              <Typography
                fontSize={13}
                color="primary.main"
                sx={{ cursor: "pointer", fontWeight: 600 }}
              >
                View All
              </Typography>
            </Box>

            <List sx={{ p: 0 }}>
              {activities.map((activity, index) => (
                <ListItem
                  key={index}
                  sx={{
                    p: 0,
                    mb: 2,
                    alignItems: "flex-start",
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 48, mt: 0.5 }}>
                    <Box
                      sx={{
                        bgcolor: activity.iconBg,
                        color: activity.iconColor,
                        p: 1,
                        borderRadius: 1.5,
                        display: "flex",
                      }}
                    >
                      <activity.icon fontSize="small" />
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        fontSize={14}
                        component="span"
                        display="block"
                        fontWeight={600}
                        color="black"
                      >
                        {activity.title}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          fontSize={13}
                          component="span"
                          display="block"
                          color="text.secondary"
                        >
                          {activity.subtitle}
                        </Typography>
                        <Typography
                          fontSize={12}
                          color="text.disabled"
                          component="span"
                          display="block"
                          mt={0.3}
                        >
                          {activity.time}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>

      <Box
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{
            bgcolor: "#2E7D32",
            color: "white",
            py: 1.5,
            px: 3,
            borderRadius: 2,
            textTransform: "none",
            fontSize: 15,
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(46, 125, 50, 0.3)",
            "&:hover": {
              bgcolor: "#1b5e20",
            },
          }}
        >
          Record Feed
        </Button>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{
            bgcolor: "#2E7D32",
            color: "white",
            py: 1.5,
            px: 3,
            borderRadius: 2,
            textTransform: "none",
            fontSize: 15,
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(46, 125, 50, 0.3)",
            "&:hover": {
              bgcolor: "#1b5e20",
            },
          }}
          onClick={addBird}
        >
          New Bird Entry
        </Button>
      </Box>
    </Box>
  );
}

function WelcomeStatCard({ Icons, title, value, verdict, iconBg, iconColor }) {
  const getChipColor = (color) => {
    switch (color) {
      case "success":
        return { bg: "#e8f5e9", text: "#2E7D32" };
      case "warning":
        return { bg: "#fff3e0", text: "#ed6c02" };
      default:
        return { bg: "#f5f5f5", text: "#666" };
    }
  };

  const chipColors = getChipColor(verdict.color);

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        border: "1px solid #f0f0f0",
        transition: "all 0.3s",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
          }}
        >
          <Box
            sx={{
              bgcolor: iconBg,
              color: iconColor,
              p: 1.5,
              borderRadius: 2,
              display: "flex",
            }}
          >
            <Icons style={{ fontSize: 24 }} />
          </Box>
          <Chip
            label={verdict.value}
            {...(verdict.Icon && {
              deleteIcon: <verdict.Icon />,
              onDelete: () => {},
            })}
            size="small"
            sx={{
              bgcolor: chipColors.bg,
              color: chipColors.text,
              fontWeight: 600,
              fontSize: 12,
              height: 24,
              "& .MuiChip-deleteIcon": {
                color: chipColors.text,
                fontSize: 16,
                "&:hover": {
                  color: chipColors.text,
                },
              },
            }}
          />
        </Box>
        <Typography
          sx={{
            fontSize: 14,
            color: "text.secondary",
            mb: 1,
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontSize: 28,
            fontWeight: 700,
            color: "black",
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

function ViewFlockRecords() {
  const basicInfo = {
    breed: "rhode island red",
    quantity: "1,250 birds",
    age: "2 weeks",
    "date Recieved": "Jan 10 2026",
  };
  const healthMetrics = {
    "current status": "healthy",
    "mortality rate": "0.5%",
    "last check": "Today, 8:30pm",
  };
  const data = [
    { day: "DAY 1", actual: 45, target: 42 },
    { day: "DAY 4", actual: 68, target: 72 },
    { day: "DAY 7", actual: 95, target: 105 },
    { day: "DAY 10", actual: 128, target: 142 },
    { day: "DAY 14", actual: 165, target: 182 },
  ];
  const activities = [
    {
      id: 1,
      title: "Vaccination completed",
      description: "Automated update from Medical Module",
      date: "Jan 20, 2026",
      color: "#059669",
    },
    {
      id: 2,
      title: "Feed consumption recorded: 150kg",
      description: "Input by Farm Hand - Sarah M.",
      date: "Jan 18, 2026",
      color: "#3B82F6",
    },
  ];
  return (
    <Box
      sx={{
        px: 4,
        py: 3,
        bgcolor: "#fafafa",
        minHeight: "100%",
      }}
    >
      <Box mb={4}>
        <Box display={"flex"} alignItems={"center"} gap={2}>
          <Typography
            variant="h2"
            sx={{
              fontSize: 32,
              fontWeight: 700,
              color: "black",
              mb: 0.5,
            }}
          >
            Batch #B-2023-042
          </Typography>
          <Chip
            label="Approved"
            size="small"
            variant="outlined"
            sx={{
              backgroundColor: "#D1FAE5",
              color: "#065F46",
              height: 20,
              fontSize: "1rem",
              p: 2,
              borderWidth: 1,
              borderColor: "primary.light",
            }}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gridTemplateRows: "1fr 1fr 1fr",
          gap: 3,
          mb: 4,
        }}
      >
        <Card sx={{}}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"start"}
            gap={2}
            sx={{
              p: 2,
            }}
          >
            <InfoOutline htmlColor="#2D7A3E" />
            <Typography sx={{ textTransform: "capitalize", fontWeight: 600 }}>
              basic information
            </Typography>
          </Box>
          <Divider />
          <CardContent>
            {Object.entries(basicInfo).map(([key, value]) => {
              return (
                <Box
                  key={key}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  textTransform={"capitalize"}
                  mt={3}
                >
                  <Typography>{String(key)}</Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "black",
                    }}
                  >
                    {String(value)}
                  </Typography>
                </Box>
              );
            })}
          </CardContent>
        </Card>
        <Card
          sx={{
            gridColumn: "span 2",
            gridRow: "span 2",
            p: 2,
          }}
        >
          <ResponsiveContainer width={"100%"} height={"100%"}>
            <LineChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 10,
              }}
            >
              <CartesianGrid
                strokeDasharray={"3 3"}
                stroke="#F3F4F6"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                axisLine={false} // Remove axis line
                tickLine={false} // Remove tick marks
                tick={{
                  fill: "#9CA3AF", // Gray text
                  fontSize: 12,
                  fontWeight: 500,
                }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#9CA3AF",
                  fontSize: 12,
                }}
                dx={-10}
              />
              <Tooltip />
              <Line
                dataKey="actual"
                stroke="#059669"
                activeDot={{ r: 6 }}
                type="monotone"
                name="Actual"
                strokeWidth={2}
              />
              <Line
                dataKey="target"
                stroke="#059669"
                activeDot={{ r: 6 }}
                strokeDasharray={"5 5"}
                type="monotone"
                name="Target"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"start"}
            gap={2}
            sx={{
              p: 2,
            }}
          >
            <HealthAndSafetyOutlined htmlColor="#2D7A3E" />
            <Typography sx={{ textTransform: "capitalize", fontWeight: 600 }}>
              health metrics
            </Typography>
          </Box>
          <Divider />
          <CardContent>
            {Object.entries(healthMetrics).map(([key, value]) => {
              return (
                <Box
                  key={key}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  textTransform={"capitalize"}
                  mt={3}
                >
                  <Typography>{String(key)}</Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "text.primary",
                    }}
                  >
                    {String(value)}
                  </Typography>
                </Box>
              );
            })}
            <LinearProgress
              variant="determinate"
              value={99.5}
              sx={{
                height: 8,
                borderRadius: 5,
                bgcolor: "grey.300",
                mt: 3,
              }}
            />
            <Typography
              variant="span"
              textTransform={"capitalize"}
              fontSize={13}
              fontWeight={600}
              color="text.secondary"
              mt={1}
            >
              99.5% survival rate
            </Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            gridColumn: "span 3",
          }}
        >
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"start"}
            gap={2}
            sx={{
              p: 2,
            }}
          >
            <HistoryOutlined htmlColor="#2D7A3E" />
            <Typography sx={{ textTransform: "capitalize", fontWeight: 600 }}>
              recent activities
            </Typography>
          </Box>
          <Divider />
          <CardContent>
            {activities.map((item, index) => {
              return (
                <Box
                  key={item.id}
                  sx={{
                    display: "flex",
                    gap: 2,
                    position: "relative",
                    pb: index !== activities.length - 1 ? 3 : 0,
                  }}
                >
                  {index !== activities.length - 1 && (
                    <Box
                      sx={{
                        position: "absolute",
                        left: "3.5px",
                        top: "17px",
                        width: "1px",
                        height: "calc(100% - 20px)",
                        backgroundColor: "#E5E7EB",
                        zIndex: 0,
                      }}
                    />
                  )}
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: item.color,
                      zIndex: 1,
                      mt: 0.5,
                      position: "relative",
                      flexShrink: 0,
                    }}
                  ></Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 2,
                      }}
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            color: "#1F2937",
                            mb: 0.5,
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            color: "#9CA3AF",
                          }}
                        >
                          {item.description}
                        </Typography>
                      </Box>

                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          color: "#9CA3AF",
                          flexShrink: 0,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.date}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
