const Sauce = require('../models/Sauce');
const fs = require('fs');   //FS : file system

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,                     //L'opérateur spread ... est utilisé pour faire une copie de tous les éléments de req.body
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,   //résolution de l'URL complète de l'image
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: []
    });
    sauce.save()   //enregistre la sauce dans la base de donnée
      .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
      .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?          //verifie si un fichier (image) est présent
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };        // req tratée tel quel si pas de fichier image
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {

///////////////////////
      if (sauce.userId !== req.auth.userId) {    //verifie que la demande de suppression vient du createur de la sauce
        res.status(400).json({
          error: new Error('Unauthorized request!')
        });
      }
////////////////

      const filename = sauce.imageUrl.split('/images/')[1];  //recupere le nom du fichier image a supprimer
      fs.unlink(`images/${filename}`, () => {     //supprime le fichier image
        Sauce.deleteOne({ _id: req.params.id })   //supprime l'objet sauce
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.likeSauce = (req, res, next) => {
  switch (req.body.like) {
    case 1:
      Sauce.updateOne({ _id: req.params.id }, {$addToSet: {usersLiked: req.body.userId}, $inc: {likes: 1}})
        .then(() => res.status(200).json({ message: 'Liked !'}))
        .catch(error => res.status(400).json({ error }));
       break;

    case -1:
      Sauce.updateOne({ _id: req.params.id }, {$addToSet: {usersDisliked: req.body.userId}, $inc: {dislikes: 1}})
        .then(() => res.status(200).json({ message: 'Disliked !'}))
        .catch(error => res.status(400).json({ error }));
      break;

    case 0:
      Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
          if ( sauce.usersLiked.includes(req.body.userId) ) {
            Sauce.updateOne({ _id: req.params.id }, {$pull: {usersLiked: { $in: [req.body.userId] }}, $inc: {likes: -1}})
              .then(() => res.status(200).json({ message: 'Unliked !'}))
              .catch(error => res.status(400).json({ error }));
          };
          if ( sauce.usersDisliked.includes(req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, {$pull: {usersDisliked: { $in: [req.body.userId] }}, $inc: {dislikes: -1}})
              .then(() => res.status(200).json({ message: 'Undisliked !'}))
              .catch(error => res.status(400).json({ error }));
          };
        })
        .catch(error => res.status(500).json({ error }));
  };
};