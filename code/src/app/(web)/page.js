"use client"

import { Typography, Box, Button, Stack, Paper } from "@mui/material";
import Header from "@/app/(web)/components/Header";
import { signIn, signOut, useSession } from "next-auth/react";
import { Fragment } from "react";
// import { useEffect } from "react";

export default function Home() {
  const session = useSession();
  // console.log(session)
  // useEffect(() => {
  //   const getUsers = async () => {
  //     await fetch('/service/test')
  //       .then(res => res.json())
  //       .then(users => console.log(users))
  //   }

  //   getUsers();
  // }, [])
  
  return (
    <main>
      <Header />
        <Box p={4} sx={{
          minHeight: '100vh',
          backgroundColor: 'ocean.main'
        }}>
          <Typography variant="h5" mb={2}>
            Patreon Copy
          </Typography>
          { session.status !== 'loading' && !!session?.data?.user ? (
            <Fragment>
              <Button variant="contained" onClick={() => signOut()}>
                Sign out
              </Button>
              <Paper elevation={5} sx={{ p: 2, my: 2 }}>
                <Stack direction='column' gap={2}>
                  <Typography>
                    Current User Name: {session.data.user.name}
                  </Typography>
                  <Typography>
                    Current User Email: {session.data.user.email}
                  </Typography>
                  <Typography>
                    Current User Creator Username: {session.data.user.cUsername ?? "<memang-null>"}
                  </Typography>
                  <Typography>
                    Current User ID: {session.data.user.id}
                  </Typography>
                  <Typography>
                    Current User Image: {session.data.user.image ?? "<memang-null>"}
                  </Typography>
                </Stack>
              </Paper>
            </Fragment>
          ) : (
            <Button variant="contained" onClick={() => signIn(undefined, { redirect: true, callbackUrl: "/" })}>
              Sign In
            </Button>
          ) }
        </Box>
    </main>
  )
}
