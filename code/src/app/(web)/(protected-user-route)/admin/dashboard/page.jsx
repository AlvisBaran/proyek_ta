'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import {
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { LineChart } from '@mui/x-charts/LineChart'

import MyAxios from '@/hooks/MyAxios'
import AdminPageLayout from '../_components/layout'

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

export default function AdminDashboardEarningsPage() {
  const theme = useTheme()
  const upMd = useMediaQuery(theme.breakpoints.up('md'))
  const [filterStatus, setFilterStatus] = useState('this-month')
  const [earnings, setEarnings] = useState(earningsDefaultValues)

  // * Fetch Data
  async function fetchData() {
    setEarnings({ ...earnings, loading: true, error: false, success: false })
    await MyAxios.get(`/admin/dashboard/website/earnings`, {
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
    <AdminPageLayout appbarTitle='Dashboard - Website Earnings'>
      <Card elevation={3}>
        <CardContent>
          <Stack direction='row' gap={2} alignItems='center' justifyContent='end' pb={2}>
            <FormControl fullWidth={!upMd} size='small' sx={{ minWidth: 280 }}>
              <InputLabel id='admin-dashboard-earnings-filter-label'>Filter</InputLabel>
              <Select
                labelId='admin-dashboard-earnings-filter-label'
                id='admin-dashboard-earnings-filter'
                label='Filter'
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                {filterOptions.map((item, index) => (
                  <MenuItem key={`admin-dashboard-earnings-filter-item-${index}`} value={item.value}>
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
        </CardContent>
      </Card>
    </AdminPageLayout>
  )
}
