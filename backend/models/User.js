const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');   //Gestion de champs unique 

const userShema = mongoose.Schema({
    email: { type: String, required: true, unique: true },      //champ email verifié comme unique par mongoose-unique-validator
    password: { type: String, required: true }
});

userShema.plugin(uniqueValidator);      //apply mongoose-unique-validator

module.exports = mongoose.model('User', userShema);