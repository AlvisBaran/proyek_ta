// "use client"

import { Typography, Box } from "@mui/material";
import Header from "@/components/Header";
// import { useEffect } from "react";

export default function Home() {
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
        <Box sx={{
          minHeight: '100vh',
          backgroundColor: 'ocean.main'
        }}>
          <Typography variant="h5">
            Patreon Copy
          </Typography>
        </Box>
    </main>
  )
}
