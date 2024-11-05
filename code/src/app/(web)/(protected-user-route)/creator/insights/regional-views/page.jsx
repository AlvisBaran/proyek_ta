'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { Card, CardContent } from '@mui/material'
import { BarChart } from '@mui/x-charts/BarChart'

import MyAxios from '@/hooks/MyAxios'
import CreatorPageLayout from '../../_components/layout'
import CreatorInsightTabs from '../_components/CreatorInsightTabs'

const chartDefaultValues = {
  data: { xAxis: { data: [] }, series: [] },
  loading: false,
  success: false,
  error: false
}

export default function CreatorInsightsRegionalViewPage() {
  const [chart, setChart] = useState(chartDefaultValues)

  // * Fetch Data Chart
  async function fetchDataChart() {
    setChart({ ...chart, loading: true, error: false, success: false })
    await MyAxios.get(`/creator/insights/regional-views/chart`)
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
    fetchDataChart()
  }, [])

  return (
    <CreatorPageLayout appbarTitle='Insights'>
      <CreatorInsightTabs value='regional-views' />
      <Card elevation={3} sx={{ mt: 2 }}>
        <CardContent>
          <BarChart
            // width={500}
            height={300}
            loading={chart.loading}
            series={chart.data.series}
            xAxis={[{ scaleType: 'band', ...chart.data.xAxis, id: 'x-axis-id' }]}
          />
        </CardContent>
      </Card>
    </CreatorPageLayout>
  )
}
