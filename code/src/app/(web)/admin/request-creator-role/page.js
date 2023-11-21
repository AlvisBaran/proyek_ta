"use client"

import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TabPanel from '@/app/(web)/components/TabPanel';
import TabParent from '@/app/(web)/components/TabParent';
import Breadcrumb from '@/app/(web)/components/Breadcrumb';
import { Paper } from '@mui/material';





const page = () => {

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const label = ["Request Creator Role", "Request Refund", "Request Withdraw"]

  const dataBreadcrumb = [
    {
      title: "Request List",
      url: "/admin/request",
    }
  ]

  return (
    <Box sx={{ width: '100%' }}>
      <Breadcrumb data={dataBreadcrumb}/>
      <Typography sx={{marginBottom:2}} variant="h5">Request Creator Role</Typography>
      
    </Box>
  )
}

export default page
