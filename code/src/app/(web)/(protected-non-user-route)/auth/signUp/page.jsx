'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { signIn } from 'next-auth/react'
import toast from 'react-hot-toast'
import MyAxios from '@/hooks/MyAxios'

import { Avatar, Button, TextField, Link, Grid, Box, Typography, Container } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'

export default function SignUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // ** Form Hooks
  const formHook = useForm({
    defaultValues: {
      email: '',
      password: '',
      displayName: ''
    },
    mode: 'onChange'
  })

  const handleSubmit = async data => {
    setIsLoading(true)
    await MyAxios.post('/auth/register', {
      email: data.email,
      displayName: data.displayName,
      password: data.password,
      confirmPassword: data.password,
      role: 'normal'
    })
      .then(async resp => {
        toast.success('Success user register!')
        // toast.loading('Redirecting you to sign in page!', { duration: 2000 })
        // router.push(`/auth/signIn?email=${data.email}`)
        toast.loading('Sigin you in!', { duration: 2000 })
        await signIn('credentials', {
          redirect: false,
          email: data.email,
          password: data.password
        }).then(resp => {
          if (resp.ok) {
            toast.success('Success login!')
            router.refresh()
          } else {
            toast.error('Something wrong with your credentials!')
          }
        })
      })
      .catch(err => {
        console.error(err)
        toast.error('Something wrong with your credentials!')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <Container component='main' maxWidth='xs'>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign up
        </Typography>
        <Box component='form' onSubmit={formHook.handleSubmit(handleSubmit)} noValidate sx={{ mt: 1 }}>
          <TextField
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            autoComplete='email'
            autoFocus
            type='email'
            {...formHook.register('email', { required: 'Email is required!' })}
            error={!!formHook.formState.errors.email}
            helperText={!!formHook.formState.errors.email ? formHook.formState.errors.email.message : undefined}
          />
          <TextField
            margin='normal'
            required
            fullWidth
            label='Display Name'
            name='displayName'
            {...formHook.register('displayName', { required: 'Display Name is required!' })}
            error={!!formHook.formState.errors.displayName}
            helperText={
              !!formHook.formState.errors.displayName ? formHook.formState.errors.displayName.message : undefined
            }
          />
          <TextField
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            autoComplete='current-password'
            {...formHook.register('password', { required: 'Password is required!' })}
            error={!!formHook.formState.errors.password}
            helperText={!!formHook.formState.errors.password ? formHook.formState.errors.password.message : undefined}
          />
          <Button type='submit' fullWidth disabled={isLoading} variant='contained' sx={{ mt: 3, mb: 2 }}>
            {isLoading ? 'Signing you up...' : 'Sign Up'}
          </Button>
          <Grid container>
            <Grid item>
              <Link href='/auth/signIn' variant='body2'>
                {'Already have an account? Sign In'}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Typography variant='body2' color='text.secondary' align='center' sx={{ mt: 8, mb: 4 }}>
        {'Copyright © '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    </Container>
  )
}
