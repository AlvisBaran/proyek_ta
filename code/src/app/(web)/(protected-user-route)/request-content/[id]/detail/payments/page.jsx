'use client'

import { Fragment, useEffect, useState } from 'react'

import { Button, Container, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid'

import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

import MyAxios from '@/hooks/MyAxios'
import { useDialog } from '@/hooks/useDialog'
import { MUIDataGridDefaults } from '@/utils/muiDefaults'
import UserPageLayout from '@/app/(web)/(protected-user-route)/_components/layout'
import AddPaymentDialog from './_components/AddPaymentDialog'
import toast from 'react-hot-toast'
import { intlNumberFormat } from '@/utils/intlNumberFormat'

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

const paymentsDefaultValues = { data: [], loading: false, success: false, error: false }
const deletePaymentDefaultValues = { loading: false, success: false, error: false }

export default function UserRequestContentDetailPaymentsPage({ params }) {
  const contentRequestId = params.id
  const { pushConfirm } = useDialog()
  const theme = useTheme()
  const upMd = useMediaQuery(theme.breakpoints.up('md'))
  const [payments, setPayments] = useState(paymentsDefaultValues)
  const [deletePayment, setDeletePayment] = useState(deletePaymentDefaultValues)
  const [openAddPayment, setOpenAddPayment] = useState(false)

  // * Fetch Data
  async function fetchPayments() {
    setPayments({ ...payments, loading: true, error: false, success: false })
    await MyAxios.get(`/user/content-request/${contentRequestId}/payment`)
      .then(resp => {
        setPayments({ ...payments, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        setPayments({ ...payments, data: [], loading: false, error: true })
      })
  }

  // * Delete Payment
  async function handleDeletePayment(paymentId) {
    setDeletePayment({ ...deletePayment, loading: true, error: false, success: false })
    await MyAxios.delete(`/user/content-request/${contentRequestId}/payment/${paymentId}`)
      .then(resp => {
        toast.success('Success cancel payment!')
        setDeletePayment({ ...deletePayment, loading: false, success: true })
        fetchPayments()
      })
      .catch(err => {
        console.error(err)
        toast.error(`Failed cancel payment!\n${err.response.data.message}`)
        setDeletePayment({ ...deletePayment, loading: false, error: true })
      })
  }

  // * On Load
  useEffect(() => {
    if (!!contentRequestId) fetchPayments()
  }, [contentRequestId])

  // * Grid Actions
  const columns = [
    ...baseColumns,
    {
      width: 160,
      filterable: false,
      sortable: false,
      type: 'actions',
      field: 'actions',
      headerName: 'Actions',
      getActions: ({ row }) => [
        <GridActionsCellItem
          key={`request-content-detail-payments-list-action-item-${row.id}-remove`}
          label='Remove'
          color='error'
          icon={<DeleteIcon />}
          onClick={() =>
            pushConfirm({
              title: 'Cancel Payment?',
              content: 'Are you sure to cancel this payment?',
              onAgreeBtnClick: () => handleDeletePayment(row.id)
            })
          }
        />
      ]
    }
  ]

  return (
    <UserPageLayout appbarTitle='Payments'>
      <Container maxWidth='md'>
        <Stack gap={2}>
          <Stack direction='row' justifyContent='end' alignItems='center' gap={upMd ? 2 : 1} flexWrap='wrap'>
            {!payments.loading && payments.success ? (
              <Fragment>
                <Typography fontWeight={600}>
                  SUM: Rp{' '}
                  {intlNumberFormat(
                    payments.data?.reduce((total, item) => (total += item.nominal), 0),
                    true
                  )}
                </Typography>
              </Fragment>
            ) : null}
            <Button
              fullWidth={!upMd}
              variant='contained'
              startIcon={<AddIcon />}
              onClick={() => setOpenAddPayment(true)}
            >
              Add Payment
            </Button>
          </Stack>
          <DataGrid {...MUIDataGridDefaults} columns={columns} rows={payments.data} loading={payments.loading} />
        </Stack>
      </Container>

      {openAddPayment ? (
        <AddPaymentDialog
          contentRequestId={contentRequestId}
          open={openAddPayment}
          onClose={() => setOpenAddPayment(false)}
          onSuccess={fetchPayments}
        />
      ) : null}
    </UserPageLayout>
  )
}
