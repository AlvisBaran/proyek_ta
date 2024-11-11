'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { Card, CardContent, Stack, TextField, useMediaQuery, useTheme } from '@mui/material'
import { LineChart } from '@mui/x-charts/LineChart'
import { DatePicker } from '@mui/x-date-pickers'

import MyAxios from '@/hooks/MyAxios'
import CreatorPageLayout from '../../_components/layout'
import CreatorInsightTabs from '../_components/CreatorInsightTabs'

const earningsDefaultValues = {
  data: { xAxis: { data: [] }, series: [] },
  loading: false,
  success: false,
  error: false
}

export default function CreatorInsightsEarningsPage() {
  const theme = useTheme()
  const upMd = useMediaQuery(theme.breakpoints.up('md'))
  const [filterDateStart, setFilterDateStart] = useState(null)
  const [filterDateEnd, setFilterDateEnd] = useState(null)
  const [earnings, setEarnings] = useState(earningsDefaultValues)

  // * Fetch Data
  async function fetchData() {
    setEarnings({ ...earnings, loading: true, error: false, success: false })
    await MyAxios.get(`/creator/insights/earnings`, {
      params: { dateStart: filterDateStart, dateEnd: filterDateEnd }
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
    if (!!filterDateStart && !!filterDateEnd) fetchData()
  }, [filterDateStart, filterDateEnd])

  return (
    <CreatorPageLayout appbarTitle='Insights'>
      <CreatorInsightTabs value='earnings' />
      <Card elevation={3} sx={{ mt: 2 }}>
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
            loading={earnings.loading}
            series={earnings.data.series}
            xAxis={[{ scaleType: 'point', ...earnings.data.xAxis }]}
          />
        </CardContent>
      </Card>
    </CreatorPageLayout>
  )
}
