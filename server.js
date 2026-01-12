// all file imports
const express = require('express');
// import with ecmascript 
// import express from 'express';
const morgan = require('morgan');
const methodOverride = require('method-override'); 
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config(); // loads the environment variables from the .env file 
const Car = require('./models/Car')

// use express (using app)
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

mongoose.connect(process.env.MONGODB_URI); // Connects to mongoDB using the connection string (our key) 
mongoose.connection.on('connected', () => {
  console.log(`connected to MongoDB ${mongoose.connection.name}`);
}) // our entry to the house is confirmed 

// routes 
app.get('/', async (req, res) => {
  res.render('index.ejs');
})

// INDEX
app.get('/Cars', async (req, res) => {
  const cars = await Car.find()
  res.render('Cars/Index', { cars })
})

// NEW
app.get('/Cars/new', (req, res) => {
  res.render('Cars/New')
})

// post car
app.post('/Cars', async (req, res) => {
  await Car.create(req.body)
  res.redirect('/Cars')
})

// show route - specific data 
// url looks something like cars/:id 
app.get('/Cars/:id', async (req, res) => {
  const car = await Car.findById(req.params.id)
  res.render('Cars/Show', { car })
})

// Edits the car 
app.get('/cars/:id/edit', async (req, res) => {
  const car = await Car.findById(req.params.id)
  res.render('cars/Edit', { car })
})

// Get Cars (index page)
app.put('/Cars/:id', async (req, res) => {
  await Car.findByIdAndUpdate(req.params.id, req.body)
  res.redirect(`/Cars/${req.params.id}`)
})

// Deletes the car 
app.delete('/Cars/:id', async (req, res) => {
  await Car.findByIdAndDelete(req.params.id)
  res.redirect('/Cars')
})

// listen 
app.listen(3000, () => {
  console.log('Listening on port 3000');
})