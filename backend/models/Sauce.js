const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({   //La méthode  Schema  de Mongoose vous permet de créer un schéma de données pour votre base de données MongoDB
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: true },
  dislikes: { type: Number, required: true },
  usersLiked: { type: Array, required: true },
  usersDisliked: { type: Array, required: true },
});

module.exports = mongoose.model('Sauce', sauceSchema);  //La méthode  model  transforme ce modèle en un modèle utilisable.