'use client'

import { Box, Chip, Grid } from '@mui/material'

export default function ChipGroup({ data }) {
  return (
    <Box height={5}>
      <Grid container spacing={2}>
        {data.props.data.map(d => (
          <Grid item xs={12}>
            <Chip label={d.label} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
