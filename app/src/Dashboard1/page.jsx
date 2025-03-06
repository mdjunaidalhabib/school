"use client";

import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Divider } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: ['Students', 'Teachers', 'Staff'],
  datasets: [
    {
      data: [60, 25, 15],
      backgroundColor: ['#36A2EB', '#FFCD56', '#FF5733'],
      hoverBackgroundColor: ['#36A2EB', '#FFCD56', '#FF5733'],
    },
  ],
};

const Dashboarda = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {/* First Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card className='bg-rose-400'>
            <CardContent>
              <Typography variant="h6">Total Students</Typography>
              <Typography variant="h4">1,200</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Second Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card className='bg-lime-400'>
            <CardContent>
              <Typography variant="h6">Teachers</Typography>
              <Typography variant="h4">50</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Third Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card className='bg-teal-400'>
            <CardContent>
              <Typography variant="h6">Staff</Typography>
              <Typography variant="h4">30</Typography>
            </CardContent>
          </Card>
        </Grid>

    
        {/* Data Table (Example) */}
        <Grid item xs={12} sm={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Recent Student Data</Typography>
              <Divider sx={{ my: 2 }} />
              {/* Here you can replace with an actual table component */}
              <Typography variant="body2">Student Table will be here</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboarda;
