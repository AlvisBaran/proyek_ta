'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import {
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { LineChart } from '@mui/x-charts'

import MyAxios from '@/hooks/MyAxios'
import { intlNumberFormat } from '@/utils/intlNumberFormat'
import CreatorPageLayout from '../../_components/layout'
import CreatorInsightTabs from '../_components/CreatorInsightTabs'

const filterOptions = [
  { value: 'this-month', label: 'This Month' },
  { value: 'this-year', label: 'This Year' },
  { value: 'last-5-year', label: 'Past 5 Years' }
]

const statisticsDefaultValues = { data: null, loading: false, error: false, success: false }
const chartDefaultValues = {
  data: { xAxis: { data: [] }, series: [] },
  loading: false,
  success: false,
  error: false
}

export default function CreatorInsightsViewsPage() {
  const theme = useTheme()
  const upMd = useMediaQuery(theme.breakpoints.up('md'))
  const [filterStatus, setFilterStatus] = useState('this-month')
  const [statistics, setStatistics] = useState(statisticsDefaultValues)
  const [chart, setChart] = useState(chartDefaultValues)

  // * Fetch Data Statistics
  async function fetchData() {
    setStatistics({ ...statistics, loading: true, error: false, success: false })
    await MyAxios('/creator/insights/views/statistics')
      .then(resp => {
        setStatistics({ ...statistics, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        toast.error(`Failed to load statistics data!\n${err.response.data.message}`)
        setStatistics({ ...statistics, data: null, loading: false, error: true })
      })
  }

  // * Fetch Data Chart
  async function fetchDataChart() {
    setChart({ ...chart, loading: true, error: false, success: false })
    await MyAxios.get(`/creator/insights/views/chart`, {
      params: { model: filterStatus }
    })
      .then(resp => {
        setChart({ ...chart, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        toast.error(`Failed to fetch data!\n${err.response.data.message}`)
        setChart({ ...chart, data: null, loading: false, error: true })
      })
  }

  // * On Load
  useEffect(() => {
    fetchData()
  }, [])

  // * On Filter Change
  useEffect(() => {
    fetchDataChart()
  }, [filterStatus])

  return (
    <CreatorPageLayout appbarTitle='Insights'>
      <CreatorInsightTabs value='views' />
      <Stack direction='row' flexWrap='wrap' sx={{ my: 2 }}>
        <Box
          sx={{
            p: 1,
            minWidth: 200,
            borderColor: 'primary.main',
            borderWidth: 2,
            borderStyle: 'solid'
          }}
        >
          <Typography fontWeight={600}>Views</Typography>
          <Typography fontSize={42} fontWeight={600}>
            {intlNumberFormat(statistics.data?.viewsCount ?? 0, true)}
          </Typography>
        </Box>
        <Box
          sx={{
            p: 1,
            minWidth: 200,
            borderColor: 'primary.main',
            borderWidth: 2,
            borderStyle: 'solid',
            borderLeftWidth: 0
          }}
        >
          <Typography fontWeight={600}>Shares</Typography>
          <Typography fontSize={42} fontWeight={600}>
            {intlNumberFormat(statistics.data?.sharesCount ?? 0, true)}
          </Typography>
        </Box>
        <Box
          sx={{
            p: 1,
            minWidth: 200,
            borderColor: 'primary.main',
            borderWidth: 2,
            borderStyle: 'solid',
            borderLeftWidth: 0
          }}
        >
          <Typography fontWeight={600}>Impressions</Typography>
          <Typography fontSize={42} fontWeight={600}>
            {intlNumberFormat(statistics.data?.likesCount ?? 0, true)}
          </Typography>
        </Box>
      </Stack>
      <Card elevation={3}>
        <CardContent>
          <Stack direction='row' gap={2} alignItems='center' justifyContent='end' pb={2}>
            <FormControl fullWidth={!upMd} size='small' sx={{ minWidth: 280 }}>
              <InputLabel id='creator-insight-views-filter-label'>Filter</InputLabel>
              <Select
                labelId='creator-insight-views-filter-label'
                id='creator-insight-views-filter'
                label='Filter'
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                {filterOptions.map((item, index) => (
                  <MenuItem key={`creator-insight-views-filter-item-${index}`} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <LineChart
            // width={500}
            height={300}
            loading={chart.loading}
            series={chart.data.series}
            xAxis={[{ scaleType: 'point', ...chart.data.xAxis }]}
          />
        </CardContent>
      </Card>
    </CreatorPageLayout>
  )
}
