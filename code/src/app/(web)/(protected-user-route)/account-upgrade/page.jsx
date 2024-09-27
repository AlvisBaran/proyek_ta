'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Container,
  TextField,
  Typography
} from '@mui/material'

import UserPageLayout from '../_components/layout'
import MyAxios from '@/hooks/MyAxios'
import LoadingSpinner from '../../_components/LoadingSpinner'
import { DataGrid } from '@mui/x-data-grid'
import { MUIDataGridDefaults } from '@/utils/muiDefaults'

const upgradeRequestsDefaultValues = { data: [], success: false, error: false, loading: false }

const baseColumns = [
  {
    flex: 1,
    minWidth: 180,
    type: 'dateTime',
    field: 'requestedAt',
    headerName: 'Requested At',
    valueGetter: params => new Date(params.value)
  },
  {
    flex: 1,
    minWidth: 160,
    type: 'string',
    field: 'newUsername',
    headerName: 'Username'
  },
  {
    flex: 1,
    minWidth: 160,
    type: 'custom',
    align: 'center',
    headerAlign: 'center',
    field: 'status',
    headerName: 'Status',
    renderCell: params => {
      return (
        <Chip
          size='small'
          label={String(params.value).toUpperCase()}
          color={
            params.value === 'requested'
              ? 'warning'
              : params.value === 'approved'
                ? 'success'
                : params.value === 'rejected'
                  ? 'error'
                  : 'default'
          }
        />
      )
    }
  },
  {
    flex: 1,
    minWidth: 160,
    type: 'string',
    field: 'adminNote',
    headerName: 'Admin Note'
  }
]

export default function AccountUpgradePage() {
  const [upgradeRequests, setUpgradeRequests] = useState(upgradeRequestsDefaultValues)
  const [requestUpgrade, setRequestUpgrade] = useState({ loading: false })

  // ** Request list Section
  // * Fetch data requests
  async function fetchUpgradeRequests() {
    setUpgradeRequests({ ...upgradeRequests, success: false, error: false, loading: true })
    await MyAxios.get('/user/account-upgrade')
      .then(resp => {
        setUpgradeRequests({ ...upgradeRequests, data: resp.data, loading: false, success: true })
      })
      .catch(err => {
        console.error(err)
        setUpgradeRequests({ ...upgradeRequests, data: [], loading: false, error: true })
      })
  }

  // * On Load
  useEffect(() => {
    fetchUpgradeRequests()
  }, [])

  // ** Create new request Section
  const formHook = useForm({
    defaultValues: {
      cUsername: ''
    },
    mode: 'onChange'
  })

  async function onSubmit(data) {
    setRequestUpgrade({ loading: true })
    await MyAxios.post('/user/account-upgrade', {
      newUsername: data.cUsername
    })
      .then(resp => {
        toast.success('Success!')
        fetchUpgradeRequests()
      })
      .catch(err => {
        console.error(err)
        toast.error(`Failed! ${err.message}`)
      })
      .finally(() => setRequestUpgrade({ loading: false }))
  }

  return (
    <UserPageLayout appbarTitle='Account Upgrade'>
      {upgradeRequests.loading ? (
        <LoadingSpinner />
      ) : upgradeRequests.success && upgradeRequests.data.length > 0 ? (
        <Card elevation={3} sx={{ maxWidth: '90vw' }}>
          <CardHeader
            title='Account Upgrade Request History'
            subheader='Theese are your previous or current account upgrade requests.'
          />
          <DataGrid {...MUIDataGridDefaults} columns={baseColumns} rows={upgradeRequests.data} />
        </Card>
      ) : (
        <Container maxWidth='sm' sx={{ mx: 'auto', pt: 4 }}>
          <Box component='form' onSubmit={formHook.handleSubmit(onSubmit)}>
            <Card elevation={0}>
              <CardHeader title='🥳 Yayy!' subheader='You are becoming our creator!' />
              <CardContent>
                <TextField
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  label='Creator Username'
                  placeholder='Please set your new creator username 😊'
                  {...formHook.register('cUsername', { required: 'Username is required!' })}
                  error={Boolean(formHook.formState.errors.cUsername)}
                  helperText={
                    Boolean(formHook.formState.errors.cUsername)
                      ? formHook.formState.errors.cUsername.message
                      : undefined
                  }
                />
                <Typography variant='body2' fontWeight={600} mt={2}>
                  Keep in mind!
                </Typography>
                <Typography variant='body2' textAlign='justify'>
                  You are now going to send request for becoming a new creator on Panthreon. You will need approvement
                  from our admin to evaluate you as our new creator. This process could take sometimes, please be
                  patient on waiting your approval. Thankyou!
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'end', pb: 2 }}>
                <Button variant='contained' disabled={requestUpgrade.loading} type='submit'>
                  {requestUpgrade.loading ? 'Submitting request...' : 'Submit Request'}
                </Button>
              </CardActions>
            </Card>
          </Box>
        </Container>
      )}
    </UserPageLayout>
  )
}
