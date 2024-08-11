'use client';

import { firestore } from '@/firebase';
import React, { useState } from 'react';
import { Box, Button, Modal, Typography, TextField, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { collection, addDoc } from 'firebase/firestore'; // Import addDoc from Firebase

const Homepage = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); // Added state for email
  const [password, setPassword] = useState(''); // Added state for password
  const router = useRouter();

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      alert('All fields are required');
      return;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Password strength check
    if (password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    try {
      // Data Submission
      const usersCollection = collection(firestore, 'users');
      await addDoc(usersCollection, {
        name,
        email,
        password,  // Note: Storing passwords in plaintext is insecure
      });

      // Success Feedback
      alert('Sign up successful!');

      // Redirect to another page (e.g., main application page)
      router.push('/page');
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Sign-up failed, please try again');
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Typography variant="h2">Welcome to Our App!</Typography>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Get Started
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #ddd"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ transform: 'translate(-50%, -50%)' }}
        >
          <Typography variant="h5">Sign Up</Typography>
          <Stack width="100%" spacing={2}>
            <TextField
              variant="outlined"
              label="Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              variant="outlined"
              label="Email"
              fullWidth
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              label="Password"
              fullWidth
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant="contained" onClick={handleSignUp}>
              Sign Up
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
};

export default Homepage;