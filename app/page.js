'use client'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import { firestore, auth} from '@/firebase';
import React, { useState } from 'react';
import { Box, Button, Modal, Typography, TextField, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { AnimatedEmoji } from './AnimatedEmoji';

const Homepage = () => {
  const [open, setOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [error, setError] = useState('');
  const auth = getAuth();

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      alert('All fields are required');
      return;
    }
  
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert('Please enter a valid email address');
      return;
    }
  
    if (password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
  
    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Add additional user data to Firestore in a unique collection for each user
      //const userCollection = collection(firestore, `Pantry_${user.uid}`);
      //await addDoc(userCollection, {
      //  name,
      //  email,
      //});
      const userCollection = collection(firestore, `users/${user.uid}/Pantry`);
  
      alert('Sign up successful!');
      router.push('./components'); 
    } catch (error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          alert('This email is already in use.');
          break;
        case 'auth/invalid-email':
          alert('The email address is not valid.');
          break;
        case 'auth/weak-password':
          alert('The password is too weak.');
          break;
        default:
          alert(`Sign-Up Error: ${error.message}`);
          break;
      }
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Both email and password are required');
      return;
    }
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Access user-specific collection
      const userCollection = collection(firestore, `users/${user.uid}/Pantry`);
      // Perform actions with userCollection

      alert('Login successful!');
      router.push('./components');  
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Login failed, please try again');
      }
  };

  const getUserItems = async () => {
    const user = auth.currentUser;
    if (user) {
      const userCollection = collection(firestore, `Pantry_${user.uid}`);
      const querySnapshot = await getDocs(userCollection);
      // Handle retrieved items
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
    bgcolor="#abd1b5"
    >
      <Box
        padding={4}
        bgcolor="#ffe9ec" 
        border="2px solid"
        borderColor="#f5e1e1"
        boxShadow={3}
        textAlign="center"
        color="#759274" 
      >
        <Box border="2px solid #759274">
        <Box
          width="600px"
          height="100px"
          bgcolor="#ffe9ec"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
        <Typography variant="h7" className = "ultra">
        <h2>PantryPath App</h2>
        Simplify your life by easily tracking and managing all your groceries and essentials!</Typography>
        </Box><AnimatedEmoji/>
        </Box>
        </Box>
        <Button variant="contained" onClick={() => setOpen(true)}>
          {isLogin ? 'Login' : 'Get Started'}
        </Button>

        <Modal open={open} onClose={() => setOpen(false)}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            width={400}
            bgcolor="#c4d9bc"
            border="2px solid #ddd"
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{ transform: 'translate(-50%, -50%)' }}
          >
            <Typography variant="h5">{isLogin ? 'Login' : 'Sign Up'}</Typography>
            <Stack width="100%" spacing={2}>
              {!isLogin && (
                <TextField
                  variant="outlined"
                  label="Name"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              )}
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
              <Button variant="contained" onClick={isLogin ? handleLogin : handleSignUp}>
                {isLogin ? 'Login' : 'Sign Up'}
              </Button>
              <Button variant="text" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Don’t have an account? Sign Up' : 'Already have an account? Login'}
              </Button>
            </Stack>
          </Box>
        </Modal>
        <Box
        position="absolute"
        bottom={0}
        width="100%"
        bgcolor="#abd1b5"
        padding={1.25}
        textAlign="center"
      >
        <Typography variant="body2" color="#f5e1e1" style={{ fontSize: '0.77rem'}}>
          &copy; {new Date().getFullYear()} Hiarimino Ralison Rakotoson. All rights reserved.
        </Typography></Box>
  </Box>
  
  );
};

export default Homepage;