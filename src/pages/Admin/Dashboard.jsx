import { Box, Typography, useMediaQuery, Paper, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { BarChart } from "@mui/x-charts/BarChart";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const chartData = {
  xAxis: [
    {
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      scaleType: "band",
    },
  ],
  series: [
    {
      data: [400, 300, 200, 278, 189, 239, 349],
      label: "Users",
    },
    {
      data: [2400, 2210, 2290, 2000, 2181, 2500, 2100],
      label: "Sales",
    },
  ],
  height: 300,
};

export default function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />

        <Box
          component="main"
          className="flex-1"
          sx={{
            p: { xs: 2, sm: 4 },
            width: "100%",
            overflowX: "hidden",
          }}
        >
          <Typography variant="h5" fontWeight={600} mb={3}>
            Dashboard
          </Typography>

          <Grid container spacing={2} mb={4}>
            <Grid item xs={12} sm={6} lg={4}>
              <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="subtitle1">Total Users</Typography>
                <Typography variant="h6">1200</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="subtitle1">Sales Today</Typography>
                <Typography variant="h6">$5400</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="subtitle1">Active Sessions</Typography>
                <Typography variant="h6">85</Typography>
              </Paper>
            </Grid>
          </Grid>

          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
              Weekly Stats
            </Typography>
            <BarChart
              xAxis={chartData.xAxis}
              series={chartData.series}
              height={chartData.height}
            />
          </Paper>
        </Box>
      </div>
    </div>
  );
}
