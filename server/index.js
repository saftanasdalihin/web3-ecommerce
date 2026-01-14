const express = require('express');
const cors = require('cors');
// const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/products');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;

mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

app.get('/', (req, res) => {
    res.send('Welcome to the Web3 E-commerce Server!');
});

app.post('/api/products', async (req, res) => {
  try {
    const {
      productId,
      name,
      description,
      imageUrl,
      price,
      quantity,
      seller
    } = req.body;
    
    const newProduct = new Product({
      productId,
      name,
      description,
      imageUrl,
      price,
      quantity,
      seller
    });
    
    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findOne({ productId: productId });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/products/name/:name', async (req, res) => {
  try {
    const { name } = req.params;
    let filter = { name: { $regex: name, $options: 'i' } };

    let products = await Product.find(filter);

    products.sort((a, b) => {

      const aStarts = a.name.toLowerCase().startsWith(name.toLowerCase());
      const bStarts = b.name.toLowerCase().startsWith(name.toLowerCase());
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.name.localeCompare(b.name);
    });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error searching products by name:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Web3 Server is running! at http://localhost:${PORT}`);
  
});