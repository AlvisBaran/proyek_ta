import { Box, Tab, Tabs } from '@mui/material'
import React from 'react'

function tabProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

const TabParent = ({ value, handleChange, label }) => {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
        {label.map((l, key) => (
          <Tab label={l} {...tabProps(key)} />
        ))}
      </Tabs>
    </Box>
  )
}

export default TabParent
