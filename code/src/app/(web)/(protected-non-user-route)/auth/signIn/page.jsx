'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { signIn } from 'next-auth/react'
import toast from 'react-hot-toast'

import { Avatar, Button, TextField, Link, Grid, Box, Typography, Container } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)

  // ** Form Hooks
  const formHook = useForm({
    defaultValues: {
      email: searchParams.get('email') ?? '',
      password: ''
    },
    mode: 'onChange'
  })

  const handleSubmit = async data => {
    setIsLoading(true)
    await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password
    })
      .then(resp => {
        if (resp.ok) {
          toast.success('Success login!')
          router.refresh()
        } else {
          toast.error('Something wrong with your credentials!')
          // formHook.setError('email', {
          //   type: 'validate',
          //   message: 'Something wrong with your credentials!'
          // })
        }
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
          Sign in
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
            {isLoading ? 'Signing you in...' : 'Sign In'}
          </Button>
          <Grid container>
            <Grid item>
              <Link href='/auth/signUp' variant='body2'>
                {"Don't have an account? Sign Up"}
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
