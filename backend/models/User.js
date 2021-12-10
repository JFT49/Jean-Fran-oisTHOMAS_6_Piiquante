const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');   //Gestion de champs unique 

const userShema = mongoose.Schema({             //La méthode  Schema  de Mongoose vous permet de créer un schéma de données pour votre base de données MongoDB
    email: { type: String, required: true, unique: true },      //champ email verifié comme unique par mongoose-unique-validator
    password: { type: String, required: true }
});

userShema.plugin(uniqueValidator);      //apply mongoose-unique-validator

module.exports = mongoose.model('User', userShema);    //La méthode  model  transforme ce modèle en un modèle utilisable.