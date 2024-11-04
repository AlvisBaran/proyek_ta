'use client'

import { Fragment, useEffect, useState } from 'react'

import { Card, CardActions, CardHeader, Divider, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import MyAxios from '@/hooks/MyAxios'
import { MUIDataGridDefaults } from '@/utils/muiDefaults'
import CreatorRequestContentLayout, { creatorRequestContentNavs } from '../_components/CreatorRequestContentLayout'
import LoadingSpinner from '@/app/(web)/_components/LoadingSpinner'
import { intlNumberFormat } from '@/utils/intlNumberFormat'

const activeNav = 'payments'
const paymentsDefaultValues = { data: [], loading: false, success: false, error: false }

const baseColumns = [
  {
    flex: 1,
    minWidth: 220,
    type: 'string',
    field: 'User.displayName',
    headerName: 'Name',
    valueGetter: params => params.row.User?.displayName
  },
  {
    flex: 1,
    minWidth: 220,
    type: 'string',
    field: 'User.email',
    headerName: 'Email',
    valueGetter: params => params.row.User?.email
  },
  {
    flex: 1,
    minWidth: 220,
    type: 'number',
    field: 'nominal',
    headerName: 'Nominal (Rp)'
  },
  {
    flex: 1,
    minWidth: 180,
    type: 'dateTime',
    field: 'createdAt',
    headerName: 'Payment At',
    valueGetter: params => new Date(params.value)
  }
]

export default function CreatorRequestContentDetailPaymentsPage({ params }) {
  const id = params.id
  const currNav = creatorRequestContentNavs.find(item => item.value === activeNav)

  const [payments, setPayments] = useState(paymentsDefaultValues)

  // * Fetch Payments
  async function fetchPayments() {
    setPayments({ ...payments, loading: true, error: false, success: false })
    await MyAxios.get(`/user/content-request/${id}/payment`)
      .then(resp => {
        setPayments({ ...payments, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        setPayments({ ...payments, data: [], loading: false, error: true })
      })
  }

  // * On Load
  useEffect(() => {
    if (!!id) fetchPayments()
  }, [id])

  // * Grid Actions
  const columns = [...baseColumns]

  return (
    <CreatorRequestContentLayout activeNav={activeNav} id={id}>
      {payments.loading ? (
        <LoadingSpinner />
      ) : payments.success ? (
        <Card elevation={3} sx={{ mt: 2 }}>
          <CardHeader
            title={currNav.label}
            titleTypographyProps={{ variant: 'h6' }}
            subheader={currNav.subTitle}
            subheaderTypographyProps={{ variant: 'body2' }}
          />
          <Divider />
          <CardActions sx={{ justifyContent: 'end' }}>
            {!payments.loading && payments.success ? (
              <Fragment>
                <Typography fontWeight={600}>
                  SUM: Rp{' '}
                  {intlNumberFormat(
                    payments.data?.reduce((total, item) => (total += Number(item.nominal)), 0),
                    true
                  )}
                </Typography>
              </Fragment>
            ) : null}
          </CardActions>
          <DataGrid {...MUIDataGridDefaults} columns={columns} rows={payments.data} loading={payments.loading} />
        </Card>
      ) : null}
    </CreatorRequestContentLayout>
  )
}
