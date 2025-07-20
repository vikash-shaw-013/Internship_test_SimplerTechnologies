'use client';

import { Button, Container, Typography, Box } from '@mui/material';
import Link from 'next/link';

export default function Home() {
  return (
    <Container maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" gutterBottom>
          Welcome to the Auth Flow App
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Link href="/login" passHref>
            <Button variant="contained" sx={{ m: 1 }}>
              Login
            </Button>
          </Link>
          <Link href="/signup" passHref>
            <Button variant="outlined" sx={{ m: 1 }}>
              Sign Up
            </Button>
          </Link>
        </Box>
      </Box>
    </Container>
  );
}
