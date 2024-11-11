'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { Box, Card, CardContent, Stack, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import { LineChart } from '@mui/x-charts'
import { DatePicker } from '@mui/x-date-pickers'

import MyAxios from '@/hooks/MyAxios'
import { intlNumberFormat } from '@/utils/intlNumberFormat'
import DashboardPageLayout from '../../_components/layout'
import AdminDashboardTabs from '../_components/AdminDashboardTabs'
import CreatorSelector from '../_components/CreatorSelector'

const statisticsDefaultValues = { data: null, loading: false, error: false, success: false }
const chartDefaultValues = {
  data: { xAxis: { data: [] }, series: [] },
  loading: false,
  success: false,
  error: false
}

export default function AdminDashboardMembershipsPage() {
  const theme = useTheme()
  const upMd = useMediaQuery(theme.breakpoints.up('md'))
  const [filterDateStart, setFilterDateStart] = useState(null)
  const [filterDateEnd, setFilterDateEnd] = useState(null)
  const [statistics, setStatistics] = useState(statisticsDefaultValues)
  const [chart, setChart] = useState(chartDefaultValues)
  const [selectedCreator, setSelectedCreator] = useState(null)

  // * Fetch Data Statistics
  async function fetchData() {
    setStatistics({ ...statistics, loading: true, error: false, success: false })
    await MyAxios(`/admin/dashboard/creator/${selectedCreator.id}/memberships/statistics`)
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
    await MyAxios.get(`/admin/dashboard/creator/${selectedCreator.id}/memberships/chart`, {
      params: { dateStart: filterDateStart, dateEnd: filterDateEnd }
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
    if (!!selectedCreator) fetchData()
    else setStatistics(statisticsDefaultValues)
  }, [selectedCreator])

  // * On Filter Change
  useEffect(() => {
    if (!!selectedCreator && !!filterDateStart && !!filterDateEnd) fetchDataChart()
    else setChart(chartDefaultValues)
  }, [selectedCreator, filterDateStart, filterDateEnd])

  return (
    <DashboardPageLayout appbarTitle='Insights'>
      <AdminDashboardTabs
        value='memberships'
        action={<CreatorSelector selectedCreator={selectedCreator} setSelectedCreator={setSelectedCreator} />}
      />
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
          <Typography fontWeight={600}>Followers</Typography>
          <Typography fontSize={42} fontWeight={600}>
            {intlNumberFormat(statistics.data?.followersCount ?? 0, true)}
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
          <Typography fontWeight={600}>Upgraded to paid</Typography>
          <Typography fontSize={42} fontWeight={600}>
            {intlNumberFormat(statistics.data?.activeMembershipCount ?? 0, true)}
          </Typography>
        </Box>
      </Stack>
      <Card elevation={3}>
        <CardContent>
          <Stack direction='row' gap={2} alignItems='center' justifyContent='end' pb={2}>
            <DatePicker
              disableFuture
              label='Date Start'
              value={filterDateStart}
              onChange={newValue => setFilterDateStart(newValue)}
              renderInput={params => <TextField {...params} />}
              sx={{ width: upMd ? undefined : '100%' }}
            />
            <DatePicker
              disableFuture
              label='Date End'
              value={filterDateEnd}
              onChange={newValue => setFilterDateEnd(newValue)}
              renderInput={params => <TextField {...params} />}
              sx={{ width: upMd ? undefined : '100%' }}
            />
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
    </DashboardPageLayout>
  )
}
