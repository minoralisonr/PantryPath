'use client';
import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, IconButton, Modal, Stack, TextField, Typography } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, query, updateDoc, where } from 'firebase/firestore';
import debounce from 'lodash/debounce';
import { firestore } from '@/firebase';

export default function Home() {
  const normalizeName = (name) => {
    // Ensure name is a string and not undefined
    if (typeof name !== 'string') {
      return ''; // or handle as needed
    }
    return name.trim().toLowerCase();
  };

  const [Pantry, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');

  const updateInventory = async () => {
    const snapshot = await getDocs(collection(firestore, 'Pantry'));
    const inventoryList = snapshot.docs.map(doc => ({
      name: doc.id,
      ...doc.data(),
    }));
    setInventory(inventoryList);
  };

  const addItem = async (item, quantityToAdd) => {
    const normalizedItemName = normalizeName(item);
    const docRef = doc(collection(firestore, 'Pantry'), normalizedItemName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const currentData = docSnap.data();
      const currentQuantity = Number(currentData.quantity) || 0;
      const newQuantity = currentQuantity + Number(quantityToAdd);
      await updateDoc(docRef, { quantity: newQuantity });
    } else {
      await setDoc(docRef, { quantity: quantityToAdd });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const normalizedItemName = normalizeName(item);
    const docRef = doc(collection(firestore, 'Pantry'), normalizedItemName);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
      await updateInventory();
    }
  };

  const searchItem = async (searchTerm) => {
    if (typeof searchTerm !== 'string' || searchTerm.trim() === '') {
      setSearchResults([]);
      setErrorMessage('');
      return;
    }
    const normalizedSearchTerm = normalizeName(searchTerm);
    const pantryRef = collection(firestore, 'Pantry');
    const snapshot = await getDocs(pantryRef);
    const allItems = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    const filteredResults = allItems.filter(item =>
      normalizeName(item.name).includes(normalizedSearchTerm)
    );

    if (filteredResults.some(item => normalizeName(item.name).includes(normalizedSearchTerm))) {
      setErrorMessage('');
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
      setTimeout(() => {
        setErrorMessage('');
      }, 1500);
    }
  };

  const debouncedSearch = debounce((term) => {
    searchItem(term);
  }, 300);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  }

  useEffect(() => {
    updateInventory();
  }, []);

  const filteredItems = searchQuery
    ? Pantry.filter(item => item.name.toLowerCase().startsWith(searchQuery.toLowerCase()))
    : Pantry;

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'center'}
      gap={2}
    >
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="#a0a899"
          border="2px solid #f0f0f0"
          boxShadow={24}
          p={4}
          display={'flex'}
          flexDirection={'column'}
          gap={3}
          sx={{
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography variant={'h5'}>Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              type='text'
              placeholder='Enter item'
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              variant="outlined"
              fullWidth
              type='text'
              placeholder='Enter qty'
              value={itemQuantity}
              onChange={(e) => setItemQuantity(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={async () => {
                await addItem(itemName, itemQuantity);
                setItemName('');
                setItemQuantity('');
                setOpen(false);
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          startIcon={<AddShoppingCartIcon />}
          onClick={() => setOpen(true)}
        >
          Add New Item
        </Button>
        <TextField
          variant="outlined"
          placeholder="Search item"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </Stack>

      {errorMessage && <Typography color="error">{errorMessage}</Typography>}

      <Box border="2px solid #f5e1e1">
        <Box
          width="600px"
          height="100px"
          bgcolor={'#759274'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h3'} color={'#fff'} textAlign={'center'}>Inventory Tracker</Typography>
        </Box>
        {(filteredItems.length > 0) && (
        <Stack width="600px" height="450px" spacing={2} overflow="auto">
          {filteredItems.map(({ id, name, quantity }) => (
            <Box
              key={id}
              width="100%"
              minHeight="100px"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              bgcolor="#ffe9ec"
              padding={4}
            >
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h5" color="#333" textAlign={'left'}>
                    {name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h5" color="#333" textAlign={'center'}>
                    {quantity}
                  </Typography>
                </Grid>
              </Grid>
              <Stack direction="row" spacing={2}>
                <IconButton
                  aria-label="add"
                  onClick={() => addItem(name, 1)}
                >
                  <AddCircleOutlineRoundedIcon />
                </IconButton>
                <IconButton
                  aria-label="remove"
                  onClick={() => removeItem(name)}
                >
                  <RemoveCircleOutlineRoundedIcon />
                </IconButton>
              </Stack>
            </Box>
          ))}
        </Stack>)}
      </Box>
    </Box>
  );
}