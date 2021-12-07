const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require("helmet");    //HELMET : xssFilter, noSniff, ...
require('dotenv').config();         //DOTENV : pour le gestion des variables d'environneemnts

const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');

mongoose.connect( process.env.MONGOOSE_CONNECT_ENV ,    //Variable d'environnement définit dans le .env de DOTENV (.env à mettre dans gitignore)
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(helmet());   //HELMET
app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
  });

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', stuffRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;