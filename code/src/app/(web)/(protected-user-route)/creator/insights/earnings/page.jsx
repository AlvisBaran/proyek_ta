'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { FormControl, InputLabel, MenuItem, Select, Stack, useMediaQuery, useTheme } from '@mui/material'
import { LineChart } from '@mui/x-charts/LineChart'

import MyAxios from '@/hooks/MyAxios'
import CreatorPageLayout from '../../_components/layout'
import CreatorInsightTabs from '../_components/CreatorInsightTabs'

const filterOptions = [
  { value: 'this-month', label: 'This Month' },
  { value: 'this-year', label: 'This Year' },
  { value: 'last-5-year', label: 'Past 5 Years' }
]

const earningsDefaultValues = {
  data: { xAxis: { data: [] }, series: [] },
  loading: false,
  success: false,
  error: false
}

export default function CreatorInsightsEarningsPage() {
  const theme = useTheme()
  const upMd = useMediaQuery(theme.breakpoints.up('md'))
  const [filterStatus, setFilterStatus] = useState('this-month')
  const [earnings, setEarnings] = useState(earningsDefaultValues)

  // * Fetch Data
  async function fetchData() {
    setEarnings({ ...earnings, loading: true, error: false, success: false })
    await MyAxios.get(`/creator/insights/earnings`, {
      params: { model: filterStatus }
    })
      .then(resp => {
        setEarnings({ ...earnings, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        toast.error(`Failed to fetch data!\n${err.response.data.message}`)
        setEarnings({ ...earnings, data: null, loading: false, error: true })
      })
  }

  // * On Load
  useEffect(() => {
    fetchData()
  }, [filterStatus])

  return (
    <CreatorPageLayout appbarTitle='Insights'>
      <CreatorInsightTabs value='earnings' />
      <Stack direction='row' gap={2} alignItems='center' justifyContent='end' py={2}>
        <FormControl fullWidth={!upMd} size='small' sx={{ minWidth: 280 }}>
          <InputLabel id='creator-insight-earnings-filter-label'>Filter</InputLabel>
          <Select
            labelId='creator-insight-earnings-filter-label'
            id='creator-insight-earnings-filter'
            label='Filter'
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            {filterOptions.map((item, index) => (
              <MenuItem key={`creator-insight-earnings-filter-item-${index}`} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <LineChart
        // width={500}
        height={300}
        loading={earnings.loading}
        series={earnings.data.series}
        xAxis={[{ scaleType: 'point', ...earnings.data.xAxis }]}
      />
    </CreatorPageLayout>
  )
}
