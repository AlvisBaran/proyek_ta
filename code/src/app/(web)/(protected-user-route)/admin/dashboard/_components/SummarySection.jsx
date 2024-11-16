'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { Card, CardHeader, TextField, useMediaQuery, useTheme } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { DatePicker } from '@mui/x-date-pickers'

import MyAxios from '@/hooks/MyAxios'
import { MUIDataGridDefaults } from '@/utils/muiDefaults'

const columns = [
  {
    flex: 1,
    minWidth: 160,
    type: 'string',
    field: 'month',
    headerName: 'Month'
  },
  {
    flex: 1,
    minWidth: 160,
    type: 'number',
    field: 'creatorEarning',
    headerName: 'Earning (Rp)'
  },
  {
    flex: 1,
    minWidth: 160,
    type: 'number',
    field: 'adminEarning',
    headerName: 'Admin Fee (Rp)'
  },
  {
    flex: 1,
    minWidth: 160,
    type: 'number',
    field: 'grandTotal',
    headerName: 'Total (Rp)'
  }
]

const summaryDefaultValues = {
  data: [],
  loading: false,
  success: false,
  error: false
}
export default function SummarySection() {
  const theme = useTheme()
  const upMd = useMediaQuery(theme.breakpoints.up('md'))
  const [filterYear, setFilterYear] = useState(new Date())
  const [summary, setSummary] = useState(summaryDefaultValues)

  // * Fetch Data
  async function fetchData() {
    setSummary({ ...summary, loading: true, error: false, success: false })
    await MyAxios.get(`admin/dashboard/website/earnings/summary`, {
      params: { year: filterYear.getFullYear() }
    })
      .then(resp => {
        setSummary({ ...summary, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        toast.error(`Failed to fetch data!\n${err.response.data.message}`)
        setSummary({ ...summary, data: [], loading: false, error: true })
      })
  }

  // * On Load
  useEffect(() => {
    if (!!filterYear) fetchData()
  }, [filterYear])

  return (
    <Card elevation={3}>
      <CardHeader
        title='Summary'
        subheader='Earning summary per month'
        action={
          <DatePicker
            disableFuture
            label='Year'
            views={['year']}
            value={filterYear}
            onChange={newValue => setFilterYear(newValue)}
            renderInput={params => <TextField {...params} />}
            sx={{ width: upMd ? undefined : '100%' }}
          />
        }
      />
      <DataGrid
        {...MUIDataGridDefaults}
        pageSizeOptions={[
          { value: 12, label: '12' },
          { value: 24, label: '24' }
        ]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 12
            }
          }
        }}
        columns={columns}
        rows={summary.data}
        loading={summary.loading}
      />
    </Card>
  )
}
